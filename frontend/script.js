const API = "http://18.61.234.18:3000";


// =========================
// GET TASKS
// =========================

async function loadTasks() {

    try {

        const response = await fetch(`${API}/api/tasks`);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const tasks = await response.json();

        const list = document.getElementById("taskList");

        list.innerHTML = "";

        tasks.forEach(task => {

            const li = document.createElement("li");

            li.className = "task-item";

            // Task name
            const span = document.createElement("span");

            span.className = "task-title";

            span.textContent = task.title;


            // Delete button
            const deleteButton = document.createElement("button");

            deleteButton.className = "delete-btn";

            deleteButton.textContent = "Delete";

            deleteButton.onclick = function () {

                deleteTask(task.id);

            };


            li.appendChild(span);

            li.appendChild(deleteButton);

            list.appendChild(li);

        });


        document.getElementById("status").textContent =
            `${tasks.length} task(s)`;


    } catch (error) {

        console.error(error);

        document.getElementById("status").textContent =
            "Unable to connect to server";

    }
}



// =========================
// ADD TASK
// =========================

async function addTask() {

    const input = document.getElementById("taskInput");

    const title = input.value.trim();

    if (!title) {

        alert("Please enter a task");

        return;
    }


    try {

        const response = await fetch(`${API}/api/tasks`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title
            })

        });


        const result = await response.json();


        if (!response.ok) {

            console.error(result);

            document.getElementById("status").textContent =
                "Failed to add task";

            return;
        }


        // Clear input
        input.value = "";


        // Reload tasks
        await loadTasks();


    } catch (error) {

        console.error(error);

        document.getElementById("status").textContent =
            "Unable to connect to server";

    }
}



// =========================
// DELETE TASK
// =========================

async function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API}/api/tasks/${id}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            console.error(result);

            document.getElementById("status").textContent =
                "Failed to delete task";

            return;
        }


        // Reload tasks after deletion
        await loadTasks();


    } catch (error) {

        console.error(error);

        document.getElementById("status").textContent =
            "Unable to connect to server";

    }
}



// =========================
// LOAD TASKS ON PAGE LOAD
// =========================

loadTasks();
