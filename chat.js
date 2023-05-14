var chatBox = document.getElementById("chat-box");

var conn = new WebSocket('ws://localhost:8080');

conn.onopen = function (e) {
    console.log("Connection established!");
    console.log(e.data);
};
conn.onclose = function (e) {
    console.log("Connection closed!");
};
conn.onmessage = function (e) {
    let data = JSON.parse(e.data);
    console.log(data);
    if (data.type == "connection") {
        console.log(data.id);
        document.getElementById("conn-id").innerHTML = data.id;
        document.getElementById("conn-ip").innerHTML = data.ip;
    }
    if (data.type == "message") {
        console.log(data.data);
        document.getElementById("chat-box").append(prepareMessage(data.data, data.from, true));
    }
};

$('#msg').submit(function (e) {
    e.preventDefault();
    var msg = document.getElementById("message-box").value;
    document.getElementById("chat-box").append(prepareMessage(msg, 'me', false));
    conn.send(msg);
});

function prepareMessage(message, author, type) {
    type = type ? "incoming" : 'outcoming';
    let msgDiv = document.createElement("div");
    msgDiv.className = "message " + type;
    let msgAuthor = document.createElement("span");
    msgAuthor.className = "msg-author";
    msgAuthor.innerText = author;
    let msgText = document.createElement("span");
    msgText.className = "msg-text";
    msgText.innerText = message;
    msgDiv.appendChild(msgAuthor);
    msgDiv.appendChild(msgText);
    return msgDiv;
}
