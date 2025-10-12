# shortener/models.py
from django.db import models

class URL(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.UUIDField(null=True)  # referencing auth.users.id (UUID)
    original_url = models.TextField()
    short_code = models.CharField(max_length=10, unique=True)
    short_url = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    click_count = models.IntegerField(default=0)
    expiry_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "urls"
        ordering = ["-created_at"]

class Analytics(models.Model):
    id = models.AutoField(primary_key=True)
    url = models.ForeignKey(URL, on_delete=models.CASCADE, related_name="analytics", db_column="url_id")
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=50, null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    referrer = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = "analytics"
        ordering = ["-timestamp"]

class QRCode(models.Model):
    id = models.AutoField(primary_key=True)
    url = models.OneToOneField(URL, on_delete=models.CASCADE, related_name="qr", db_column="url_id")
    qr_image = models.TextField(null=True, blank=True)  # base64 or path
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "qrcodes"

class CustomDomain(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.UUIDField(null=True)
    domain_name = models.CharField(max_length=100, unique=True)
    is_verified = models.BooleanField(default=False)
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "custom_domains"
