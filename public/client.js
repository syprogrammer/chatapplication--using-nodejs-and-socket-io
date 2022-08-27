const socket = io();
const form = document.getElementById("form-container");
const messageInput = document.getElementById("messageinp");
const messageContainer = document.getElementById("chat-area");
const audio = new Audio("sounds/tone.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
};

socket.on("receive", (data) => {
  audio.play();
  append(
    `
    <div class ="left">
    <p>
    <span class="chat-name">${data.name}</span>
    <span class="chat-msg">${data.message}</span> 
             </p>
<span class="chat-date">${data.Date}</span>
</div>
`,
    "left"
  );
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const currentDate = new Intl.DateTimeFormat("en-US", {
    timeStyle: "medium",
    dateStyle: "medium",
    timeZone,
  });
  let dateandtime = currentDate.format(date);
  function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
  }
});
form.addEventListener("submit", (e) => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
 
  e.preventDefault();
  const message = messageInput.value;
  append(
    `
  <div class ="left">
    <p>
    <span class="chat-name">You</span>
    <span class="chat-msg">${message}</span> 
             </p>
<span class="chat-date">${dateTime}</span>
</div>
  `,
    "right"
  );

  socket.emit("send", message);
  messageInput.value = "";
  scrollToBottom();
});
