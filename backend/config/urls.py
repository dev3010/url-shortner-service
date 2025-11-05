from django.contrib import admin
from django.urls import path, include
from shortener.views import google_login, login, signup
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny



# schema_view = get_schema_view(
#     openapi.Info(
#         title="URL Shortener API",
#         default_version='v1',
#         description="API documentation for the URL shortener project (Django + Supabase)",
#         terms_of_service="https://www.google.com/policies/terms/",
#         contact=openapi.Contact(email="support@lynkr.io"),
#         license=openapi.License(name="MIT License"),
#     ),
#     public=True,
#     permission_classes=(AllowAny,),
# )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('shortener.urls')),  # include all app routes in one file
    # path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    # path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]