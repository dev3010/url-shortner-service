from django.urls import path
from .views import (
    signup,
    login,
    google_login,
    redirect_short_url,
    GuestURLViewSet,
    user_analytics,
    generate_qr,
    user_urls,
    update_url,
)

guest_url_create = GuestURLViewSet.as_view({'post': 'create'})

urlpatterns = [
    # AUTH ROUTES
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login, name='login'),
    path('auth/google-login/', google_login, name='google-login'),

    # GUEST SHORTENER
    path('api/shorten/', guest_url_create, name='guest-shorten'),

    # USER PREMIUM FEATURES
    path('api/user/analytics/', user_analytics, name='user-analytics'),
    path('api/user/generate-qr/', generate_qr, name='generate-qr'),
    path('api/user/urls/', user_urls, name='user-urls'),
    path('api/user/update-url/', update_url, name='update-url'),

    # REDIRECT HANDLER (always at end)
    path('<str:short_code>/', redirect_short_url, name='redirect_short_url'),
]