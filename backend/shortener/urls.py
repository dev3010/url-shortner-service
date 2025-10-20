from django.urls import path
from .views import signup, login, google_login, GuestURLViewSet, redirect_short_url

guest_url_create = GuestURLViewSet.as_view({'post': 'create'})

urlpatterns = [
    # Auth endpoints
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login, name='login'),
    path('auth/google-login/', google_login, name='google-login'),

    # Guest URL shortening
    path('api/guest/shorten/', guest_url_create, name='guest-shorten'),

    # Short URL redirect (must be last!)
    path('<str:short_code>/', redirect_short_url, name='redirect_short_url'),
]