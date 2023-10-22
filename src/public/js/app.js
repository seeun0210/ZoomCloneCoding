// //클라이언트[webSocket]
// const messageList = document.querySelector("ul");
// const messageForm = document.querySelector("#message");
// const nickForm = document.querySelector("#nick");
// //FE에서 connect를 요청해야 함
// // 이 socket은 BE와 연결된 socket
// const socket = new WebSocket(`ws://${window.location.host}`);

// function makeMessage(type, payload) {
//   const msg = { type, payload }; //object를 만들고
//   return JSON.stringify(msg);
//   //Json형태로 바꿈(다른 언어를 지원하는 브라우저에서 js로 데이터를 보내면 못읽음..
//   //   그래서 JSON이라는 문자열형태로 바꿔서 보내주면 그걸 백에서 풀어서 객체형태로 사용함)
//   //   이렇게 해야하는 이유는 webSocket이 브라우저에 있는 API이기 때문임!!!!!!
//   //   백엔드에서는 다양한 프로그래밍 언어를 사용할 수 있기 때문에 이 API는 어떠한 판단도 하면 안됨
//   //   그래서 string으로만 보내고있는거임
// }
// socket.addEventListener("open", () => {
//   console.log("Connected to Server!✅");
// });

// socket.addEventListener("message", (message) => {
//   const li = document.createElement("li");
//   li.innerText = message.data;

//   messageList.append(li);
//   //   console.log("New message:", message.data);
// });
// socket.addEventListener("close", () => {
//   console.log("Connected from server❌");
// }); //서버를 끄면 이 메시지가 콘솔창에 뜸  ㄷㄷ

// function handleSubmit(event) {
//   event.preventDefault(false);
//   const input = messageForm.querySelector("input");
//   socket.send(makeMessage("new_message", input.value));
//   //   여기에서는 나를 포함한 모든 사람에게 메시지를 보내고 있음.
//   // 나를 제외한 다른 사람 모두에게 메시지를 보내는 것이 로직상 맞음
//   //   어떻게 할까?
//   const li = document.createElement("li");
//   //   const li = document.querySelector("li");
//   li.innerText = `You:${input.value}`;
//   messageList.append(li);
//   input.value = "";
// }
// function handleNickSubmit(event) {
//   event.preventDefault();
//   const input = nickForm.querySelector("input");
//   socket.send(makeMessage("nickname", input.value));
// }
// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);
const socket = io();
// io function: socket.io를 알아서 실행하고 있는 서버를 찾아줌
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;
let roomName;
function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  //   결론: 이제 socket.io에서 emit을 통해 모든걸 할 수 있다~~~!!!
  socket.emit("enter_room", { payload: input.value }, showRoom);
  roomName = input.value;
  //   첫번째 인자: 프론트의 emit 과 백의 on이 같은 이름 같은 string이어야 한다
  //   두번째 인자: argument
  //   세번째 인자(중간에 다른 것들도 보내야하는 경우 마지막인자): 여기에서 세번째 인자가 진짜 지리는건데 서버의 함수가 여기에서 호출되는거임
  //   ✅주로 서버의 소켓에서 보낸 메시지를 보고 싶을 때 사용한다고 해!
  //   그래서 server.js에 setTimeout에 있는 done()함수가 여기서 실행되는 거라 볼 수 있음
  //     그리고 주의해야할 것! 백엔드에서 온 함수를 프론트에서 실행하는 건 괜찮지만, 프론트의 함수를 백엔드에서 실행하는건 엄청난 보안문제라 안된다!!!

  input.value = "";
  //   [webSocket]
  //   const msg = { type, payload }; //object를 만들고
  //   return JSON.stringify(msg);
  // 이전에는 이런식으로 문자열만 보낼 수 있었지만

  //   [socket.io]
  // 이제는 여러개의 argument를 보낼 수 있다.
  // 이제 JSON으로 안바꿔서 보내도 됨 ㅋ 진작에 알려주지
  // 이렇게 보내면 백에서 { payload: '김세은의 방' }이런 형태로 뜸
  // 백에서 바로 사용 가능
}
form.addEventListener("submit", handleRoomSubmit);
