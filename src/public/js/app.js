//클라이언트
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
//FE에서 connect를 요청해야 함
// 이 socket은 BE와 연결된 socket
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server!✅");
});

socket.addEventListener("message", (message) => {
  console.log("New message:", message.data);
});
socket.addEventListener("close", () => {
  console.log("Connected from server❌");
}); //서버를 끄면 이 메시지가 콘솔창에 뜸  ㄷㄷ

function handleSubmit(event) {
  event.preventDefault(false);
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
