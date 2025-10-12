from django.urls import path
from .views import signup, login, google_login  # make sure these exist in views.py

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('google-login/', google_login, name='google-login'),
]
