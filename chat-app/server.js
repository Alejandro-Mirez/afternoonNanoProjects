const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 3001;

app.use(express.static(join(__dirname, "public")));
app.use(express.json());
app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "public", "index.html"));
});

let history = [];

io.on("connection", (socket) => {
	socket.emit(
		"messageFromServer",
		"Hello from the server! Be good, children, the big brother is watching!"
	);
	socket.on("messageFromClient", (message) => {
		history.push(message);
		socket.broadcast.emit("messageFromServer", message);
	});
	socket.emit("messageHistory", history);
});

let users = [];

app.post("/users", (req, res) => {
	users.push(req.body.username);
});

app.get("/users", (req, res) => res.send(users));

server.listen(PORT, console.log("Server is up and running on port", PORT));
