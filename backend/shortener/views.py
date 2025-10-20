from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.conf import settings
from supabase import create_client

from .serializers import SignupSerializer, LoginSerializer

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)


@swagger_auto_schema(
    method='post',
    request_body=SignupSerializer,
    responses={201: "User registered", 400: "Error"}
)
@api_view(['POST'])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            response = supabase.auth.sign_up({"email": email, "password": password})
            return Response({"message": "User registered", "email": response.user.email}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=LoginSerializer,
    responses={200: "Login successful", 400: "Invalid credentials"}
)
@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            response = supabase.auth.sign_in_with_password({"email": email, "password": password})
            return Response({
                "message": "Login successful",
                "access_token": response.session.access_token,
                "user": response.user.email
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    responses={200: "Google login URL"}
)
@api_view(['GET'])
def google_login(request):
    try:
        url = supabase.auth.sign_in_with_oauth({"provider": "google"})
        return Response({"google_login_url": url.url})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
