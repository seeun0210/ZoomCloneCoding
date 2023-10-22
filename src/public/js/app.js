//클라이언트
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
//FE에서 connect를 요청해야 함
// 이 socket은 BE와 연결된 socket
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload }; //object를 만들고
  return JSON.stringify(msg);
  //Json형태로 바꿈(다른 언어를 지원하는 브라우저에서 js로 데이터를 보내면 못읽음..
  //   그래서 JSON이라는 문자열형태로 바꿔서 보내주면 그걸 백에서 풀어서 객체형태로 사용함)
  //   이렇게 해야하는 이유는 webSocket이 브라우저에 있는 API이기 때문임!!!!!!
  //   백엔드에서는 다양한 프로그래밍 언어를 사용할 수 있기 때문에 이 API는 어떠한 판단도 하면 안됨
  //   그래서 string으로만 보내고있는거임
}
socket.addEventListener("open", () => {
  console.log("Connected to Server!✅");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;

  messageList.append(li);
  //   console.log("New message:", message.data);
});
socket.addEventListener("close", () => {
  console.log("Connected from server❌");
}); //서버를 끄면 이 메시지가 콘솔창에 뜸  ㄷㄷ

function handleSubmit(event) {
  event.preventDefault(false);
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  //   여기에서는 나를 포함한 모든 사람에게 메시지를 보내고 있음.
  // 나를 제외한 다른 사람 모두에게 메시지를 보내는 것이 로직상 맞음
  //   어떻게 할까?
  const li = document.createElement("li");
  //   const li = document.querySelector("li");
  li.innerText = `You:${input.value}`;
  messageList.append(li);
  input.value = "";
}
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
