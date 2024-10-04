document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const primaryButton = document.getElementById("loginPrimaryButton");
  const secondaryButton = document.getElementById("loginSecondaryButton");
  const title = document.getElementById("loginTitle");
  const subtitle = document.getElementById("loginSubtitle");

  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  const usernameInLocalStorage = localStorage.getItem("username");
  const userIdInLocalStorage = localStorage.getItem("userId");

  // Verifica si los valores existen en localStorage
  if (usernameInLocalStorage && userIdInLocalStorage) {
    if (primaryButton && title && subtitle) {
      primaryButton.textContent = `Cambiar nombre de usuario`;
      secondaryButton.textContent = `Seguir como ${usernameInLocalStorage}`;
      title.textContent = `Bienvenido ${usernameInLocalStorage}`;
      subtitle.textContent = `¿Quieres cambiar tu nombre de usuario?`;
    }
  } else {
    title.textContent = `Bienvenido!`;
    subtitle.textContent = `Crea un nombre de usuario!`;
    primaryButton.textContent = `Comenzar a chatear`;
    secondaryButton.classList.add("hidden");
  }

  function login() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();

    if (username != "" && username.length < 15) {
      const userId = generateUniqueId();
      const userColor = getRandomColor();

      // Guardar la información
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("userColor", userColor);

      window.location.href = "/";
    } else {
      if (username.length > 15) {
        alert("El nombre de usuario es muy largo!");
      } else {
        alert("Por favor, introduce un nombre de usuario.");
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });

  secondaryButton.addEventListener("click", (e) => {
    window.location.href = "/";
  });
});
