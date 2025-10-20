# shortener/serializers.py
from rest_framework import serializers
from .models import URL, Analytics, QRCode

from rest_framework import serializers

class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, min_length=6)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, min_length=6)

