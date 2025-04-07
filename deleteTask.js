export async function deleteTask(event, tasks, API_URL, displayTasks) {
  const liElement = event.target.parentElement;

  liElement.nextElementSibling?.remove(); // Remove hr if it exists

  // For MongoDB we need to use the _id property
  const taskId = liElement.querySelector(".taskContent").id; 

  console.log(taskId + " es id del elemento que quieres borrar");
  
  try {
      let response = await fetch(`${API_URL}/${taskId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
      });

      if (!response.ok) throw new Error("Error deleting task");
      
      // Remove element from DOM only after successful API call
      liElement.remove();
      
      await response.json();
      
      // Find the index of the task based on its ID
      const index = tasks.findIndex((task) => task._id === taskId);
      
      if (index !== -1) {
          tasks.splice(index, 1); // Remove the task from the array
          console.log("Updated tasks:", tasks);
          displayTasks();
      }
  } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete task.");
  }
}
