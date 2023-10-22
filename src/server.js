import exp from "constants";
import express from "express";
import http from "http";
import { Server } from "socket.io";
// import { WebSocketServer } from "ws";
import { dirname } from "path";
import { fileURLToPath } from "url";
const app = express();

app.set("view engine", "pug");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");
//express는 ws를 따로 지원하지 않기 때문에 function을 만들어 주어야 한다
//이렇게 해서 서버는 http와 ws 두개의 protocol을 이해할 수 있게 됨
//항상 이렇게 할 필요는 없고 websocet server만 만들어도 된다.
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);
function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}
wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  console.log("사용자가 연결되었습니다");
  //여기에서 socket은 wetSocket의 소켓과 다르다!
  // 왜냐면 socket.io의 socket이니까!!
  //   console.log(socket);
  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event:${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    // socket.to(roomName).emit("welcome");
    socket.to(roomName).emit("welcome", socket.nickname);

    //     setTimeout(() => {
    //       done("Hello from the back-end");
    //       // done()함수를 실행하면 backend에서는 아무일도 일어나지 않는다
    //       // front-end에서 backendDone의 실행버튼을 누르는 거라 생각하면 된다!!!
    //     }, 3000);
  });
  //   disconect !== disconnecting
  //  disconnet:완전히 연결이 끊겼다!
  // disconnecting:고객이 접속을 중단할 것이지만 아직 방을 완전히 나가지는 않았다
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("newMessage", `${socket.nickname}:${msg}`);
    done(); //이건 백엔드에서 실행하지 않는다!
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});
// const wss = new WebSocketServer({ server });
//FE로 부터 socket에 대한 정보를 주고받을 수 있다.

////////////[websocket]아 몇시간동안 이게 머고 하면서 했더니 이제야 socket.io쓴다고함 이건 websocket쓴거니까 참고만////////////////////////
// const sockets = []; //여기에 connection을 넣어줌
// //wss.on("여러가지 이벤트들",콜백함수)
// wss.on("connection", (socket) => {
//   //여기에서 소켓은 websocet에서 지정한 거임..
//   sockets.push(socket);
//   //   브라우저에서 연결이 추가될 때 작동
//   socket["nickname"] = "익명 사용자";
//   //   누구의 소켓인지 알기 위해서,, 초기값으로 익명

//   console.log("Connected to Browser!✅");
//   socket.on("close", () => console.log("Disconnected from the Browser❌"));
//   socket.on("message", (message) => {
//     const msg = message.toString("utf8"); //버전 문제로 이렇게 써야함
//     console.log(msg); //{"type":"new_message","payload":"ㅁㄴㅇㄻ"}
//     console.log(JSON.parse(msg)); //{ type: 'new_message', payload: 'ㅁㄴㅇㄻ' }=>js object로 바뀜
//     const parsed = JSON.parse(msg);
//     // if (parsed.type === "new_message") {
//     //   //FE에서 보낸 tyoe이 'new_message'인 경우 해당하는 내용인 payload만 걸러서 보내줌
//     //   sockets.forEach((aSocket) => aSocket.send(parsed.payload));
//     // } else if (parsed.type === "nickname") {
//     //   console.log(parsed.payload);
//     // }
//     switch (parsed.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}:${parsed.payload}`)
//         );
//         break;
//       case "nickname":
//         // console.log(parsed.payload);
//         // 닉네임을 소켓 안에 넣어 주어야 함
//         socket["nickname"] = parsed.payload;
//         console.log(socket["nickname"]); //
//         break;
//       default:
//         // 다른 모든 경우에 대한 처리를 추가할 수 있습니다.
//         break;
//     }

//     // socket.send(message.toString("utf8"));
//   });
// });
httpServer.listen(3000, handleListen);
