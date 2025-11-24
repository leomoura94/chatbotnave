const chat = document.getElementById("chat");

const menu = {
    "strogonoff carne": 30,
    "strogonoff de frango": 25,
    "macarrão bolonhesa": 18,
    "refrigerante lata": 7,
    "suco": 10
};

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function botResponse(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("cardápio") || msg.includes("menu")) {
        let menuText = "Aqui está o nosso cardápio:\n\n";
        for (let item in menu) {
            menuText += `• ${item} - R$ ${menu[item]}\n`;
        }
        return menuText;
    }

    for (let item in menu) {
        if (msg.includes(item)) {
            return `Ótima escolha! O *${item}* custa *R$ ${menu[item]}*. Quer fazer o pedido?`;
        }
    }

    if (msg.includes("oi") || msg.includes("olá")) {
        return "Olá! Sou o atendente virtual. Como posso ajudar hoje?";
    }

    if (msg.includes("pedido")) {
        return "Claro! O que você gostaria de pedir do nosso cardápio?";
    }

    return "Desculpe, não entendi muito bem. Quer ver o cardápio?";
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const msg = input.value.trim();

    if (msg === "") return;

    addMessage(msg, "user");

    setTimeout(() => {
        addMessage(botResponse(msg), "bot");
    }, 500);

    input.value = "";
}
