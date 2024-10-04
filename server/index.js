import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import logger from "morgan";
import sqlite3 from "sqlite3";

const app = express();
const server = createServer(app);
const port = process.env.PORT ?? 3000;
const db = new sqlite3.Database("mariochat.sqlite3");

app.use(express.static("client")); // sirve archivos estáticos desde la carpeta 'client'

const io = new Server(server, {
  connectionStateRecovery: {},
});

// Comando SQL para crear la tabla
const createTableQuery = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT,
  user TEXT
  userId TEXT
)
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error("Error al crear la tabla messages:", err.message);
  }
});

// Funciones
function addMessageInDB(content, username, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO messages (content, user, userId) VALUES (?,?,?)",
      [content, username, userId],
      function (err) {
        if (err) {
          console.error("Error al insertar en la tabla messages:", err.message);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

function getAllMessages(serverOffset) {
  return new Promise((resolve, reject) => {
    const consulta = "SELECT * FROM messages WHERE id > (?)";
    db.all(consulta, [serverOffset], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

let lastSentMessage = {
  content: "",
  userId: "",
};

// Socket
io.on("connection", async (socket) => {
  // console.log("Usuario conectado");

  // socket.on("disconnect", () => {
  //   console.log("Usuario desconectado");
  // });

  let lastIndexMsg;
  let newPreviousUserMatch;

  // let lastMsgUserId;

  // Recuperar los mensajes de DB y emito los mensajes al usuario
  if (!socket.recovered) {
    try {
      const allMessages = await getAllMessages(
        socket.handshake.auth.serverOffset ?? 0
      );

      lastIndexMsg = allMessages.length;

      lastSentMessage = {
        content: allMessages[lastIndexMsg - 1].content,
        userId: allMessages[lastIndexMsg - 1].userId,
      };

      let previousUserMatch;

      // Obtengo el ultimo usuario en mandar el mensaje
      // lastMsgUsername = allMessages[allMessages.length - 1].user;

      // Logica de previous Match para los mensajes traidos de la BD
      for (let index = 1; index < allMessages.length; index++) {
        previousUserMatch = false;

        // Verifico si el anterior mensaje es del mismo usuario
        if (index < allMessages.length) {
          if (allMessages[index].userId === allMessages[index - 1].userId) {
            previousUserMatch = true;
          }
        }

        socket.emit(
          "chat message",
          allMessages[index].content,
          allMessages[index].id.toString(),
          allMessages[index].user,
          allMessages[index].userId,
          previousUserMatch
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  // guarda el mensaje en base de datos, obtengo el ultimo mensaje enviado y emito el mensaje a todos
  socket.on("chat message", (msg, username, userId) => {
    let lastIdMsg;

    if (lastSentMessage.userId === userId) {
      newPreviousUserMatch = true;
    } else {
      newPreviousUserMatch = false;
    }

    // Guardar mensaje en base de datos
    addMessageInDB(msg, username, userId)
      .then((lastInsertId) => {
        lastIdMsg = lastInsertId;
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    // Emitir el mensaje a todos los clientes
    io.emit(
      "chat message",
      msg,
      lastIdMsg,
      socket.handshake.auth.username,
      socket.handshake.auth.userId,
      newPreviousUserMatch,
      lastSentMessage
    );

    // Convertir lastSentMessage al ultimo mensaje enviado
    lastSentMessage = {
      content: msg,
      userId: userId,
    };
  });
});

app.use(logger("dev"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(process.cwd() + "/client/login.html");
});

server.listen(port, () => {
  console.log("server running", port);
});
