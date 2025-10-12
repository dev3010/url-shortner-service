// api.js
const API_BASE = "http://127.0.0.1:8000"; // Django backend

export async function signup(email, password) {
  const res = await fetch(`${API_BASE}/api/signup/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });
  return res.json();
}

export async function googleLogin(redirect_url) {
  const res = await fetch(`${API_BASE}/api/google-login/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({redirect_url})
  });
  return res.json();
}
