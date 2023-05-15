const chatBox = document.getElementById("chat-box");
const chatContainer = document.getElementById("chat-container");
const systemAlerts = document.getElementById("system-alerts");

window.onload = function () {

    var darkModeEnabled = true;
    const themeBtn = $("#theme-toggle");
    const themeIcon = $("#theme-icon");


    themeBtn.click(function () {
        darkModeEnabled = !darkModeEnabled;

        $("body").toggleClass("dark");

        themeIcon.toggleClass('bi-sun', !darkModeEnabled).toggleClass('bi-moon', darkModeEnabled);

    });

    scrollChatToBottom();

};


var conn = new WebSocket('ws://localhost:8080');
console.log(conn);

conn.onopen = function (e) {
    loader.remove();

    chatContainer.append(prepareInfoText("[ Connection Success ] Welcome to the chat!"));
    console.log(e.data);
};
conn.onclose = function (e) {
    loader.remove();;
    let msg = prepareInfoText("[ Connection lost! ] There seems to be a system issue !", true);
    systemAlerts.append(msg);
    setTimeout(function () {
        msg.remove();
    }, 20000);
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
        chatContainer.append(prepareInfoText(` user ${data.id} joined chat !`));
        scrollChatToBottom();
    }
};

$('#msg').submit(function (e) {
    e.preventDefault();
    var msg = document.getElementById("message-box").value;
    if (msg == "") {
        let msg = prepareInfoText(" Message cannot be empty. ", true);
        systemAlerts.append(msg);
        setTimeout(function () {
            msg.remove();
        }, 3000);
        return;
    }

    if (conn['readyState'] == 1) {
        chatContainer.append(prepareMessage(msg, 'me', false));
        conn.send(msg);
        $(this).trigger('reset');
    } else {
        let msg = prepareInfoText(" Message could not be delivered ( Could not connect to the server ! )", true);
        systemAlerts.append(msg);
        setTimeout(function () {
            msg.remove();
        }, 3000);
    }
    scrollChatToBottom();

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

function prepareInfoText(message, system = false) {
    let msgDiv = document.createElement("div");
    msgDiv.className = "msg-info  ";
    let msgText = document.createElement("span");
    msgText.className = "msg-info-text " + (system ? 'system' : 'normal');
    msgText.innerText = message;
    msgDiv.appendChild(msgText);
    return msgDiv;
}