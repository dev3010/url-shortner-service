from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.conf import settings
from supabase import create_client
from .serializers import URLSerializer, SignupSerializer, LoginSerializer
import random
import string
import datetime

# ---------------- Supabase client ----------------
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)


# ---------------- Utility ----------------
def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


# ---------------- Signup API ----------------
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
            if response.get('error'):
                return Response({"error": str(response['error'])}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "User registered", "email": response['user']['email']}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- Login API ----------------
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
            if response.get('error'):
                return Response({"error": str(response['error'])}, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                "message": "Login successful",
                "access_token": response['session']['access_token'],
                "user": response['user']['email']
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- Google Login API ----------------
@swagger_auto_schema(
    method='get',
    responses={200: "Google login URL"}
)
@api_view(['GET'])
def google_login(request):
    try:
        response = supabase.auth.sign_in_with_oauth({"provider": "google"})
        if response.get('error'):
            return Response({"error": str(response['error'])}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"google_login_url": response['url']})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ---------------- Guest URL Shortening ----------------
class GuestURLViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['original_url'],
            properties={
                'original_url': openapi.Schema(type=openapi.TYPE_STRING, description='URL to shorten')
            },
        ),
        responses={
            201: openapi.Response('Created', URLSerializer),
            400: 'Bad Request'
        },
        operation_description="Guest URL shortening (no login required)"
    )
    def create(self, request):
        original_url = request.data.get("original_url")
        if not original_url:
            return Response({"error": "original_url is required"}, status=status.HTTP_400_BAD_REQUEST)

        short_code = generate_short_code()
        short_url = f"http://localhost:3000/{short_code}"  # Update for production

        # Insert into Supabase
        response = supabase.table("urls").insert({
            "original_url": original_url,
            "short_code": short_code,
            "short_url": short_url,
            "user_id": None,
            "created_at": datetime.datetime.utcnow().isoformat(),
            "is_active": True,
            "click_count": 0
        }).execute()

        if not response.data:
            return Response({"error": "Failed to insert URL"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        data = response.data[0]
        return Response(data, status=status.HTTP_201_CREATED)
