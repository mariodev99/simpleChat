import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const usernameInLocalStorage = localStorage.getItem("username");
const userIdInLocalStorage = localStorage.getItem("userId");
const userColorInLocalStorage = localStorage.getItem("userColor");

if (!usernameInLocalStorage) {
  window.location.replace("/login");
}

// Config del auth socket
const socket = io({
  auth: {
    username: usernameInLocalStorage,
    userId: userIdInLocalStorage,
    userColor: userColorInLocalStorage,
    serverOffset: 0,
  },
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const upButton = document.getElementById("up-button");

// Conectado
socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on(
  "chat message",
  (msg, serverOffset, username, userId, previousUserMatch, lastSentMessage) => {
    let item;

    // Si soy yo
    if (username === usernameInLocalStorage) {
      item = `
        <li class="position-end">
          <div class="message-content me">
            <p>${msg}</p>
          </div>
        </li>
      `;
    } else {
      if (previousUserMatch) {
        item = `
          <li class="position-start">
            <div class="message-content other">
              <p>${msg}</p>
            </div>
          </li>
        `;
      } else {
        item = `
          <li class="position-start">
            <div class="message-content other">
              <p class="username">${username}</p>
              <p>${msg}</p>
            </div>
          </li>
        `;
      }
    }

    messages.insertAdjacentHTML("beforeend", item);

    socket.auth.serverOffset = serverOffset;

    // Si envio un mensaje scrollea al final
    if (username === usernameInLocalStorage) {
      scrollToBottom();
    }
    // else: mostrar un boton para realizar un scroll hacia abajo
  }
);

// Enviar un mensaje
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //TODO: Aca enviar tambien el id del user
  if (input.value) {
    socket.emit(
      "chat message",
      input.value,
      socket.auth.username,
      socket.auth.userId
    );
    input.value = "";
  }

  upButton.classList.add("show-button");
});

// Scroll button logic
function showScrollButton() {
  if (messages.scrollTop < messages.scrollHeight - 700) {
    upButton.classList.add("show-button");
  } else {
    upButton.classList.remove("show-button");
  }
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

messages.addEventListener("scroll", showScrollButton);
upButton.addEventListener("click", scrollToBottom);
