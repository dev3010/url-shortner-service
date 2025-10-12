# shortener/utils.py
import random
import string
import io
import base64
import qrcode
from django.conf import settings

def generate_short_code(length=6):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

def generate_qr_base64(text):
    # creates a PNG image and returns base64 string
    img = qrcode.make(text)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_b64 = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/png;base64,{img_b64}"
