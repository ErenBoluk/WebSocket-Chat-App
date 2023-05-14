const chatBox = document.getElementById("chat-box");
const chatContainer = document.getElementById("chat-container");
const connText = document.getElementById("conn-text");

window.onload = function () {
    scrollChatToBottom();
};

var conn = new WebSocket('ws://localhost:8080');

conn.onopen = function (e) {
    connText.remove();
    chatContainer.append(prepareInfoText("[ Connection Success ] Welcome to the chat!"));
    console.log(e.data);
};
conn.onclose = function (e) {
    chatContainer.append(prepareInfoText("[ Connection lost! ] There seems to be a system issue.!"));
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
        chatContainer.append(prepareMessage(data.data, data.from, true));
        scrollChatToBottom();
    }
    if (data.type == "join") {
        chatContainer.append(prepareInfoText(` user ${data.id} joinded chat !`));
        scrollChatToBottom();
    }
};

$('#msg').submit(function (e) {
    e.preventDefault();
    var msg = document.getElementById("message-box").value;
    if (msg == "") return;
    chatContainer.append(prepareMessage(msg, 'me', false));
    scrollChatToBottom();
    $(this).trigger('reset');
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
function scrollChatToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function prepareInfoText(message) {
    let msgDiv = document.createElement("div");
    msgDiv.className = "msg-info";
    let msgText = document.createElement("span");
    msgText.className = "msg-info-text";
    msgText.innerText = message;
    msgDiv.appendChild(msgText);
    return msgDiv;
}