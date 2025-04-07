const API_URL = "http://192.168.1.135:3000/login";
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageElement = document.getElementById("message");

  messageElement.textContent = "Loging in...";

  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      messageElement.textContent = result.message;

       // Store JWT token and user info in localStorage
       localStorage.setItem('token', result.token);
       localStorage.setItem('user', JSON.stringify(result.user));
       
       // Redirect to the todo list page
       window.location.href = "dashboard.html";
       
    } else {
      messageElement.textContent = result.message;
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    messageElement.textContent = "Error al conectar con el servidor";
  }
});
