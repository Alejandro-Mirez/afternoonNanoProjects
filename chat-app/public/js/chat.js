const socket = io();
//select elements
const sendButton = document.querySelector(".send-button");
const messageArea = document.querySelector("#messageArea");
const messageInput = document.querySelector("#messageInput");

let username = sessionStorage.getItem("username") || "";
console.log(username);

if (username !== "") {
	showChat();
}

async function setUsername() {
	if (document.getElementById("username").value.replace(" ", "") !== "") {
		const userexists = await fetch("/users")
			.then((response) => response.json())
			.then((userList) => {
				if (
					userList.includes(document.getElementById("username").value)
				) {
					window.alert("username exists, please choose another one");
				} else {
					username = document.getElementById("username").value;
					showChat();
				}
			});
	}
	const response = await fetch("/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username }),
	});

	return response;
}

function showChat() {
	document.getElementById("chat").classList.remove("invisible");
	document.getElementById("login").classList.add("invisible");
	sessionStorage.setItem("username", username);
}

//Add message
function addMessage(message, sender) {
	const messageDiv = document.createElement("div");
	messageDiv.className = `message ${sender}-message`;
	messageDiv.textContent = message;
	messageArea.appendChild(messageDiv);
	messageArea.scrollTop = messageArea.scrollHeight;
}

//Display server messages
socket.on("messageFromServer", (message) => addMessage(message, "server"));

socket.on("messageHistory", (history) =>
	history.map((message) => {
		if (message.includes(username)) {
			addMessage(message, "client");
		} else {
			addMessage(message, "server");
		}
	})
);

//Send message to the server
function sendMessage() {
	const message = username + ": " + messageInput.value.trim();
	if (message) {
		socket.emit("messageFromClient", message);
		addMessage(message, "client");
		messageInput.value = "";
	}
}

sendButton.addEventListener("click", sendMessage);

function fetchUsers() {
	fetch("/users")
		.then((response) => response.json())
		.then((userList) => {
			const listEl = document.getElementById("list");
			listEl.innerHTML = "";

			for (let i = 0; i < userList.length; i++) {
				const userName = document.createElement("div");
				userName.textContent = userList[i];
				listEl.appendChild(userName);
			}
		})
		.catch((error) => {
			console.log("error", error);
		});
}
// first time fetch already existing users
fetchUsers();
