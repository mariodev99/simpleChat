// function addMessage(messageContent) {
//   return new Promise((resolve, reject) => {
//     db.run(
//       "INSERT INTO messages (contenido) VALUES (?)",
//       [messageContent],
//       function (err) {
//         if (err) {
//           console.error("Error al insertar en la tabla messages:", err.message);
//           reject(err);
//         } else {
//           console.log("Nuevo mensaje insertado correctamente");
//           resolve(this.lastID); // "this" se refiere al objeto Statement
//         }
//       }
//     );
//   });
// }
