from django.urls import path
from .views import signup, login, google_login, GuestURLViewSet

guest_url_create = GuestURLViewSet.as_view({'post': 'create'})

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('google-login/', google_login, name='google-login'),
    path('guest/shorten/', guest_url_create, name='guest-shorten'),

]
