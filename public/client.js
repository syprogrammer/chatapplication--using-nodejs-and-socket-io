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
  
 
});
function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}
form.addEventListener("submit", (e) => {
 const date = new Date();
 const timeZone = "Asia/Kolkata";
 const currentDate = new Intl.DateTimeFormat("en-US", {
   timeStyle: "medium",
   dateStyle: "medium",
   timeZone,
 });
 let dateTime = currentDate.format(date);
 
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
