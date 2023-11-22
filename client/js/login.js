document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const button = document.getElementById("loginButton");

  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Refactor en una func
  const usernameInLocalStorage = localStorage.getItem("username");
  const userIdInLocalStorage = localStorage.getItem("userId");

  // Verifica si los valores existen en localStorage
  if (usernameInLocalStorage && userIdInLocalStorage) {
    if (button) {
      button.textContent = `Entrar como ${usernameInLocalStorage}`;
    }
  }
  // Refactor en una func

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  function login() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();

    if (username) {
      const userId = generateUniqueId();
      const userColor = getRandomColor();

      // Guardar la información
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("userColor", userColor);

      // Redirige al chat
      window.location.href = "/";
    } else {
      if (usernameInLocalStorage && userIdInLocalStorage) {
        window.location.href = "/";
      } else {
        alert("Por favor, introduce un nombre de usuario.");
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });
});
