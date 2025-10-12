import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
HEADERS = {"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {SUPABASE_ANON_KEY}"}

@api_view(['POST'])
def signup(request):
    """
    Signup with email and password via Supabase
    """
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    url = f"{SUPABASE_URL}/auth/v1/signup"
    payload = {"email": email, "password": password}

    response = requests.post(url, json=payload, headers=HEADERS)
    data = response.json()

    if response.status_code != 200:
        return Response(data, status=response.status_code)

    return Response({"message": "Signup successful!", "user": data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request):
    """
    Login with email and password via Supabase
    """
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
    payload = {"email": email, "password": password}

    response = requests.post(url, json=payload, headers=HEADERS)
    data = response.json()

    if response.status_code != 200:
        return Response(data, status=response.status_code)

    return Response({"message": "Login successful!", "session": data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def google_login(request):
    """
    Generate Supabase OAuth URL for Google login
    Frontend will redirect user to Supabase Google OAuth
    """
    redirect_url = request.data.get("redirectTo", "http://localhost:3000/dashboard/")
    oauth_url = f"{SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to={redirect_url}"

    return Response({"oauth_url": oauth_url})
