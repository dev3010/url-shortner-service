from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
# from drf_yasg.utils import swagger_auto_schema
# from drf_yasg import openapi
from django.conf import settings
from django.shortcuts import redirect
from supabase import create_client
from .serializers import URLSerializer, SignupSerializer, LoginSerializer
import random
import string
from datetime import datetime, timezone
import qrcode
import base64
from io import BytesIO
import jwt
import os

# ---------------- Supabase client ----------------
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")


# ---------------- Utility ----------------
def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def get_user_from_token(request):
    """
    Extract user info from Authorization Bearer token.
    Swagger calls skip this logic (no token during schema generation).
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        # When Swagger or unauthenticated requests hit endpoints, return None safely
        return None, Response({"error": "Authorization token required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split(" ")[1]
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not getattr(user_response, "user", None):
            return None, Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)
        return user_response.user, None
    except Exception as e:
        return None, Response({"error": f"Auth error: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)

# ---------------- Signup API ----------------
# @swagger_auto_schema(
#     method='post',
#     request_body=SignupSerializer,
#     responses={201: "User registered successfully", 400: "Validation error"},
# )
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            response = supabase.auth.sign_up({"email": email, "password": password})
            if hasattr(response, "error") and response.error:
                return Response({"error": str(response.error)}, status=status.HTTP_400_BAD_REQUEST)
            user_email = getattr(response.user, "email", email)
            return Response({"message": "User registered", "email": user_email}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------- Login API ----------------
# @swagger_auto_schema(
#     method='post',
#     request_body=LoginSerializer,
#     responses={200: "Login successful", 400: "Invalid credentials"},
# )
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            response = supabase.auth.sign_in_with_password({"email": email, "password": password})
            if hasattr(response, "error") and response.error:
                return Response({"error": str(response.error)}, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                "message": "Login successful",
                "access_token": response.session.access_token,
                "user": response.user.email,
                "user_id": response.user.id
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------- Google Login API ----------------
#@swagger_auto_schema(method='get', responses={200: "Google login URL"})
@api_view(['GET'])
@permission_classes([AllowAny])
def google_login(request):
    try:
        response = supabase.auth.sign_in_with_oauth({"provider": "google"})
        if hasattr(response, "error") and response.error:
            return Response({"error": str(response.error)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"google_login_url": getattr(response, "url", None)})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ---------------- Guest URL Shortening ----------------
class GuestURLViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    # @swagger_auto_schema(
    #     request_body=openapi.Schema(
    #         type=openapi.TYPE_OBJECT,
    #         required=['original_url'],
    #         properties={
    #             'original_url': openapi.Schema(type=openapi.TYPE_STRING, description='URL to shorten')
    #         },
    #     ),
    #     responses={201: openapi.Response('Created', URLSerializer), 400: 'Bad Request'},
    #     operation_description="Shorten a URL (guest access, no login required)"
    # )
    def create(self, request):
        original_url = request.data.get("original_url")
        if not original_url:
            return Response({"error": "original_url is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get user_id (optional, sent from frontend if user is logged in)
        user_id = request.data.get("user_id")

        # Determine user type
        user_type = "registered" if user_id else "guest"

        # Generate short code and short URL
        short_code = generate_short_code()
        short_url = f"http://localhost:8000/{short_code}"

        # Prepare record to insert
        record = {
            "original_url": original_url,
            "short_code": short_code,
            "short_url": short_url,
            "user_id": user_id if user_id else None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True,
            "click_count": 0
        }

        # Insert into Supabase
        response = supabase.table("urls").insert(record).execute()

        if not response or not response.data:
            return Response({"error": "Failed to insert URL"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Success response
        data = response.data[0]
        data["user_type"] = user_type
        return Response(data, status=status.HTTP_201_CREATED)

# ---------------- Redirect Short URL ----------------
@api_view(['GET'])
@permission_classes([AllowAny])
def redirect_short_url(request, short_code):
    try:
        response = supabase.table("urls").select("*").eq("short_code", short_code).maybe_single().execute()
        url_obj = getattr(response, "data", None)
        if not url_obj:
            return Response({"error": "Short URL not found"}, status=status.HTTP_404_NOT_FOUND)

        if not url_obj.get("is_active", True):
            return Response({"error": "This URL has been deactivated"}, status=status.HTTP_403_FORBIDDEN)

        supabase.table("urls").update({
            "click_count": url_obj.get("click_count", 0) + 1,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq("short_code", short_code).execute()

        return redirect(url_obj["original_url"])

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ---------------- Authenticated APIs ----------------
@api_view(['GET'])
def user_analytics(request):
    user, error_response = get_user_from_token(request)
    if error_response:
        return error_response

    try:
        urls_response = supabase.table("urls").select("*").eq("user_id", user.id).execute()
        urls = getattr(urls_response, "data", [])
        analytics_data = []

        for url in urls:
            clicks_resp = supabase.table("analytics").select("*").eq("url_id", url['id']).execute()
            analytics_data.append({
                "short_url": url['short_url'],
                "original_url": url['original_url'],
                "click_count": url['click_count'],
                #"analytics": getattr(clicks_resp, "data", []),
                "is_active": url['is_active'],
                "created_at": url['created_at'],
                "id": url['id']
            })

        return Response({"data": analytics_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def generate_qr(request):
    user, error_response = get_user_from_token(request)
    if error_response:
        return error_response

    short_url = request.data.get("short_url")
    if not short_url:
        return Response({"error": "short_url is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        url_resp = supabase.table("urls").select("*").eq("short_url", short_url).eq("user_id", user.id).maybe_single().execute()
        url_obj = getattr(url_resp, "data", None)
        if not url_obj:
            return Response({"error": "URL not found or not owned by user"}, status=status.HTTP_404_NOT_FOUND)

        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(url_obj['original_url'])
        qr.make(fit=True)
        img = qr.make_image(fill="black", back_color="white")

        buffer = BytesIO()
        img.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        supabase.table("qrcodes").upsert({
            "url_id": url_obj['id'],
            "qr_image": qr_base64
        }).execute()

        return Response({"short_url": short_url, "qr_code": qr_base64}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def user_urls(request):
    user, error_response = get_user_from_token(request)
    if error_response:
        return error_response
    try:
        urls_resp = supabase.table("urls").select("*").eq("user_id", user.id).execute()
        return Response({"urls": getattr(urls_resp, "data", [])}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def update_url(request):
    user, error_response = get_user_from_token(request)
    if error_response:
        return error_response

    short_url = request.data.get("short_url")
    updates = request.data.get("updates", {})
    if not short_url or not updates:
        return Response({"error": "short_url and updates are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        url_resp = supabase.table("urls").select("*").eq("short_url", short_url).eq("user_id", user.id).maybe_single().execute()
        url_obj = getattr(url_resp, "data", None)
        if not url_obj:
            return Response({"error": "URL not found or not owned by user"}, status=status.HTTP_404_NOT_FOUND)

        supabase.table("urls").update(updates).eq("short_url", short_url).execute()
        return Response({"message": "URL updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

