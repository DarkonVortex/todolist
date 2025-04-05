export async function fetchTasks(API_URL, tasks, displayTasks) {
    try {
      const response = await fetch(`${API_URL}`);
  
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