# shortener/urls.py
from django.urls import path
#from .views import ShortenCreateAPIView, RedirectView, UserURLsAPIView, ToggleURLAPIView, URLAnalyticsAPIView, GenerateQRAPIView
from django.views.generic import TemplateView
urlpatterns = [
    # path("api/shorten/", ShortenCreateAPIView.as_view(), name="shorten"),
    # path("api/user/urls/", UserURLsAPIView.as_view(), name="user_urls"),
    # path("api/url/<int:url_id>/toggle/", ToggleURLAPIView.as_view(), name="toggle_url"),
    # path("api/url/<str:short_code>/analytics/", URLAnalyticsAPIView.as_view(), name="url_analytics"),
    # path("api/url/<int:url_id>/qr/", GenerateQRAPIView.as_view(), name="generate_qr"),
    # # redirect - place at root with short code param (catch-all)
    # path("<str:code>/", RedirectView.as_view(), name="redirect"),
    path('auth/', TemplateView.as_view(template_name='frontend/auth.html'), name='auth')
]
