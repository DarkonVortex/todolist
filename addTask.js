export async function addTask(newTask, tasks, API_URL, modalContainer, displayTasks) {
    if (newTask.value.trim().length > 0) {
      const taskData = { userId: Date.now(), title: newTask.value };
  
      try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
          });
    
          if (!response) throw new Error("Error adding task")
      
          let result = await response.json();
      
          tasks.push(result);
      
          displayTasks();
      
          newTask.value = "";
      
          modalContainer.close();
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to add Task.")
      }
    } else {
      console.log("write your task!");
    }
  }