export async function fetchTasks(API_URL, tasks, displayTasks) {
    try {
      const token = localStorage.getItem('token');
    
      if (!token) {
        // If no token, redirect to login page
        window.location.href = "login.html";
        return;
      }

      const response = await fetch(`${API_URL}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = "login.html";
        return;
      }
  
      if (!response.ok) throw new Error("Error fetching tasks");
  
      tasks.length = 0;

      const fetchedTasks = await response.json();
      fetchedTasks.forEach(task => tasks.push(task));

      displayTasks();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch tasks.");
    }
  }