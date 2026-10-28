const API = "/api";

async function post(url, data) {
  const r = await fetch(API + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const d = await r.json();
  if (!r.ok) throw new Error(d.message || "Request failed");
  return d;
}

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginForm) {
  const loginEmail = document.getElementById("email");
  const loginPassword = document.getElementById("password");
  const loginMsg = document.getElementById("msg");

  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    loginMsg.textContent = "";

    try {
      const d = await post("/auth/login", {
        email: loginEmail.value.trim(),
        password: loginPassword.value
      });

      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      location.href = "dashboard.html";
    } catch (x) {
      loginMsg.textContent = x.message;
    }
  };
}

if (registerForm) {
  const registerName = document.getElementById("name");
  const registerEmail = document.getElementById("email");
  const registerPassword = document.getElementById("password");
  const registerMsg = document.getElementById("msg");

  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    registerMsg.textContent = "";

    const nameValue = registerName.value.trim();
    const emailValue = registerEmail.value.trim();
    const passwordValue = registerPassword.value;

    if (!nameValue || !emailValue || !passwordValue) {
      registerMsg.textContent = "All fields are required";
      return;
    }

    if (passwordValue.length < 6) {
      registerMsg.textContent = "Password must be at least 6 characters";
      return;
    }

    try {
      const d = await post("/auth/register", {
        name: nameValue,
        email: emailValue,
        password: passwordValue
      });

      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      location.href = "dashboard.html";
    } catch (x) {
      registerMsg.textContent = x.message;
    }
  };
}
