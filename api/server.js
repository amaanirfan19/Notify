const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

app.use(express.json());
app.use(cors());

mongoose
  .connect( process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mern-todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

// Models
const Todo = require("./models/Todo");

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save();

  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findById(req.params.id);
  await Todo.deleteOne({ _id: result._id });

  res.json({ result });
});

app.get("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
});

app.put("/todo/update/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.text = req.body.text;

  todo.save();

  res.json(todo);
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static( '../client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
	});
}

server.listen(PORT);