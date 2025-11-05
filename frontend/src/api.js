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
  const user_id = localStorage.getItem("user_id"); // saved at login
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    original_url,
  };

  // If user_id exists (logged-in user), include it in the payload
  if (user_id) {
    body.user_id = user_id;
  }

  const res = await fetch(`${API_BASE}/api/shorten/`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return res.json();
}

export const getUserAnalytics = async (token) => {
  const response = await fetch(`${API_BASE}/api/user/analytics/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response; 
};
