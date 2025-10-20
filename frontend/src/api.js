const API_BASE = "http://127.0.0.1:8000"; // Django backend

export async function signup(email, password) {
  const res = await fetch(`${API_BASE}/auth/signup/`, { 
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });
  return res.json();
}

export async function googleLogin() {
  const res = await fetch(`${API_BASE}/auth/google-login/`); // GET
  return res.json();
}

export async function shortenURL(original_url) {
  const res = await fetch(`${API_BASE}/api/guest/shorten/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ original_url }),
  });
  return res.json();
}
