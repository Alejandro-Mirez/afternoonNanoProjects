const select = document.getElementById("usernames");
const todos = document.getElementById("todos");
const heading = document.getElementById("heading");


fetch("https://jsonplaceholder.typicode.com/users").then((response) => {
    return response.json().then((user) => {
        for (let i = 0; i < user.length; i++) {
            select.add(document.createElement("option"))
            select.children[i].setAttribute("data-id", user[i].id)
            select.children[i].text = user[i].username
        }
    })
}).catch((error) => {
    console.log("error", error)
})

function fetchToDo() {
    let selectedUsername;
    let selectedUserId;
    for (let i = 0; i < select.children.length; i++) {
        if (select.children[i].selected) {
            selectedUsername = select.children[i].text
            selectedUserId = select.children[i].dataset.id
        }
    }
    fetch(`https://jsonplaceholder.typicode.com/todos?userId=${selectedUserId}`).then((response) => {
        return response.json().then((todo) => {
            while (todos.firstChild) {
                todos.removeChild(todos.firstChild);
            }
            heading.textContent = `${selectedUsername}'s To-Do List:`
            for (let i = 0; i < todo.length; i++) {
                todos.appendChild(document.createElement("div"))
                todos.children[i].textContent = todo[i].title
                todos.children[i].setAttribute("onclick", "toggleClass(this)")
                if (todo[i].completed) {
                    todos.children[i].setAttribute("data-status", "completed")
                    todos.children[i].setAttribute("class", "completed task")
                } else {
                    todos.children[i].setAttribute("data-status", "to-do")
                    todos.children[i].setAttribute("class", "to-do task")
                }

            }
        })
    }).catch((error) => {
        console.log("error", error)
    })
}

function toggleClass(element) {
    element.classList.toggle("completed")
    element.classList.toggle("to-do")
}