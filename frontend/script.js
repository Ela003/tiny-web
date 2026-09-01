const API = "http://18.61.234.18:3000";


// ==============================
// LOAD TASKS
// ==============================

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

            li.innerHTML = `
                <span class="task-title">
                    ${escapeHTML(task.title)}
                </span>

                <div class="actions">

                    <button
                        class="update-btn"
                        onclick="updateTask(${task.id}, '${escapeHTML(task.title)}')"
                    >
                        Update
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})"
                    >
                        Delete
                    </button>

                </div>
            `;

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



// ==============================
// ADD TASK
// ==============================

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

            alert("Failed to add task");

            return;
        }


        input.value = "";

        await loadTasks();


    } catch (error) {

        console.error(error);

        alert("Unable to connect to server");

    }

}



// ==============================
// UPDATE TASK
// ==============================

async function updateTask(id, oldTitle) {

    const newTitle = prompt(
        "Enter new task name:",
        oldTitle
    );


    if (newTitle === null) {
        return;
    }


    const title = newTitle.trim();


    if (!title) {

        alert("Task cannot be empty");

        return;
    }


    try {

        const response = await fetch(
            `${API}/api/tasks/${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title
                })

            }
        );


        const result = await response.json();


        if (!response.ok) {

            console.error(result);

            alert("Failed to update task");

            return;
        }


        await loadTasks();


    } catch (error) {

        console.error(error);

        alert("Unable to connect to server");

    }

}



// ==============================
// DELETE TASK
// ==============================

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

            alert("Failed to delete task");

            return;
        }


        await loadTasks();


    } catch (error) {

        console.error(error);

        alert("Unable to connect to server");

    }

}



// ==============================
// SECURITY HELPER
// ==============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}



// ==============================
// LOAD WHEN PAGE OPENS
// ==============================

loadTasks();
