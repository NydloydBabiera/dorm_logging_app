// //initialized one socket connection to be use across the pages and components
// //1 socket connection per client
// import io from "socket.io-client";
// const serverLink = `${process.env.SOCKET_URL}`;
// export default {
//   state() {
//     return {
//       socket: io.connect(serverLink, {
//         secure: true,
//       }),
//     };
//   }
// };
