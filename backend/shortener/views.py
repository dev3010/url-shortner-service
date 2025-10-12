from django.shortcuts import render
import os


# Create your views here.
def auth_view(request):
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
    return render(request, 'auth.html', {
        'supabase_url': supabase_url,
        'supabase_anon_key': supabase_anon_key
    })