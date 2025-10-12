# shortener/auth_backend.py
import time
import requests
import jwt
from jwt import algorithms
from django.conf import settings
from django.utils.functional import SimpleLazyObject

# simple lightweight user object
class SimpleUser:
    def __init__(self, payload):
        self.payload = payload or {}
        self.id = self.payload.get("sub") or self.payload.get("user_id") or self.payload.get("id")
        self.email = self.payload.get("email")
        self.raw = payload

    def is_authenticated(self):
        return bool(self.id)

# JWKS caching
_jwks_cache = {"keys": None, "fetched_at": 0}
JWKS_CACHE_TTL = 3600  # 1 hour

def fetch_jwks():
    now = time.time()
    if _jwks_cache["keys"] and now - _jwks_cache["fetched_at"] < JWKS_CACHE_TTL:
        return _jwks_cache["keys"]
    url = settings.SUPABASE_JWKS_URL
    resp = requests.get(url, timeout=5)
    resp.raise_for_status()
    jwks = resp.json()
    _jwks_cache["keys"] = jwks
    _jwks_cache["fetched_at"] = now
    return jwks

def verify_supabase_jwt(token):
    jwks = fetch_jwks()
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")
    key = None
    for k in jwks.get("keys", []):
        if k.get("kid") == kid:
            key = k
            break
    if not key:
        raise Exception("Unable to find matching JWK")
    public_key = algorithms.RSAAlgorithm.from_jwk(key)
    options = {"verify_aud": False}  # optionally check audience if you know it
    decoded = jwt.decode(token, public_key, algorithms=[unverified_header.get("alg", "RS256")], options=options)
    # optionally check issuer
    # issuer = settings.SUPABASE_URL + "/"
    # if decoded.get("iss") != issuer: raise Exception(...)
    return decoded

class SupabaseJWTAuthenticationMiddleware:
    """
    Django middleware that validates Bearer token and sets request.user = SimpleUser(payload)
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user = SimpleUser(None)
        auth = request.META.get("HTTP_AUTHORIZATION", "")
        if auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1]
            try:
                payload = verify_supabase_jwt(token)
                request.user = SimpleUser(payload)
            except Exception as e:
                # invalid token -> keep request.user as unauthenticated
                request.user = SimpleUser(None)
        return self.get_response(request)
