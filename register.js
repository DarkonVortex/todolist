const API_URL = "http://192.168.1.135:3000/register";
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();
  
    console.log("hi")
  
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: username, 
        email: email, 
        password: password 
      })
    })
  
    const result = await response.json()
    document.getElementById("message").textContent = result.message
  });