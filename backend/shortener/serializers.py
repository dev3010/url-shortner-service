# shortener/serializers.py
from rest_framework import serializers
from .models import URL, Analytics, QRCode

class URLSerializer(serializers.ModelSerializer):
    class Meta:
        model = URL
        fields = ["id","user_id","original_url","short_code","short_url","is_active","click_count","created_at","expiry_date"]

class CreateURLSerializer(serializers.Serializer):
    original_url = serializers.URLField()
    custom_code = serializers.CharField(required=False, allow_blank=True, max_length=30)

class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ["id","url_id","timestamp","ip_address","user_agent","referrer","location"]
