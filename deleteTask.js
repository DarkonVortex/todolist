export async function deleteTask(event, tasks, API_URL, displayTasks) {
    const liElement = event.target.parentElement;
  
    liElement.nextElementSibling?.remove(); // Remove hr if it exists

    const taskId = Number(liElement.querySelector(".taskContent").id); // Get the task id

    console.log(taskId + "es id del elemento que quieres borrar")
    liElement.remove(); // Remove the li element from the DOM
    
    try {
        let response = await fetch(`${API_URL}/${taskId}`, {
            method: "DELETE",
          });

          if (!response) throw new Error("Error deleting task")
        
          await response.json();
        
          // Find the index of the task based on its ID
          const index = tasks.findIndex((task) => task.id === taskId);
        
          if (index !== -1) {
            tasks.splice(index, 1); // Remove the task from the array
            console.log("Updated tasks:", tasks);
            displayTasks();
          }
    } catch (error) {
        console.error("Error:", error)
        alert("Failed to delte task.")
    }
  }