# shortener/serializers.py
from rest_framework import serializers
from .models import URL, Analytics, QRCode

class URLSerializer(serializers.ModelSerializer):
    class Meta:
        model = URL
        fields = '__all__'

class CreateURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = URL
        fields = ['original_url', 'user_id']

class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = '__all__'

class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCode
        fields = '__all__'
