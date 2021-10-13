let peer = new Peer();
let connection = null;
const chats = [];

/* sample chat item
{
  sender: boolean
  message: string
} */

// initialized peer
peer.on("open", (id) => {
  // console.log(id);
  $("#id-display").text(peer.id);
});

function handleConnection(conn) {
  connection = conn;
  console.log(conn);
  conn.on("open", () => {
    // Receive messages
    conn.on("data", (data) => {
      console.log(data);
      updateChats(data, false);
    });
  });
}

peer.on("connection", (conn) => {
  console.log(conn);
  handleConnection(conn);
});

$("#connect-to-peer").submit((ev) => {
  ev.preventDefault();
  const peerId = $("#peer-id").val();
  let conn = peer.connect(peerId, { serialization: "json" });
  handleConnection(conn);
});

function updateChats(message, sender) {
  chats.push({ sender, message });

  // clear content
  $("#chats").html("");

  for (item in chats) {
    const sndr = chats[item].sender;
    const msg = chats[item].message;

    $("#chats").append(`
      <div class="row">
        <div class="col d-block">
          <p class="p-3 me-auto bg-${
            sndr ? "dark" : "primary"
          } text-light rounded" style="margin-${
      sndr ? "left" : "right"
    }: 70px">${msg}</p>
        </div>
      </div>
    `);
  }
}

$("#send").click(() => {
  const message = $("#message").val();

  if (!message) return;

  connection.send(message);
  // Send messages
  updateChats(message, true);
  $("#message").val("");
});
