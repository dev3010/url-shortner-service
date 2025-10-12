from django.contrib import admin
from django.urls import path, include
from shortener.views import google_login, login, signup
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


# Swagger schema setup
schema_view = get_schema_view(
   openapi.Info(
      title="Lynkr API",
      default_version='v1',
      description="API docs for URL shortener",
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('shortener.urls')),  # all API endpoints will be defined in shortener/urls.py
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
