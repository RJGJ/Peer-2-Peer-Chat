let peer = new Peer({
  config: {
    iceServers: [{ url: "stun:stun.l.google.com:19302" }],
  },
});
let connection = null;
const chats = [];

$(document).ready(() => {
  updateChatsUI();

  window.location.href = "/#focus-me";
});

// functions
function handleConnection(conn) {
  connection = conn;
  // console.log(conn);
  conn.on("open", () => {
    // Receive messages
    conn.on("data", (data) => {
      // console.log(data);
      pushChat(data, false);
    });
  });
}

function pushChat(message, sender) {
  chats.push({ sender, message });
  updateChatsUI();
}

function updateChatsUI() {
  $("#chats").html("");

  for (item in chats) {
    const sndr = chats[item].sender;
    const msg = chats[item].message;

    let chatElement = $('<div class="chat-block"></div>');
    let chatTextElement = $('<p class="py-2 px-3 rounded"></p>');

    if (sndr) {
      chatTextElement.addClass("bg-light text-dark ml-auto border");
    } else {
      chatTextElement.addClass("bg-dark text-light mr-auto");
    }

    chatTextElement.text(msg);

    chatElement.append(chatTextElement);
    $("#chats").append(chatElement);
  }
}

// peer
peer.on("open", (id) => {
  // console.log(id);
  $("#id-display").text(peer.id);
});

peer.on("connection", (conn) => {
  // console.log(conn);
  handleConnection(conn);
});

// ui triggers
$("#connect-to-peer").submit((ev) => {
  ev.preventDefault();
  const peerId = $("#peer-id").val();
  let conn = peer.connect(peerId, { serialization: "json" });
  handleConnection(conn);
});

$("#send").submit((ev) => {
  ev.preventDefault();
  const message = $("#message").val();

  if (!message) return;

  connection.send(message);
  // Send messages
  pushChat(message, true);
  $("#message").val("");
});
