document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("userInput");
    const btn = document.getElementById("sendButton");

    if (input && btn) {
        input.disabled = false;
        btn.disabled = false;
    }

    startChat();
});


let chat;
let userName = "";
let etapa = "inicio";
let pedido = [];
let total = 0;

const menu = {
    "Strogonoff de Carne": 30,
    "Strogonoff de Frango": 25,
    "Macarrão à Bolonhesa": 18,
    "Refrigerante": 7,
    "Suco": 10
};

// Função que roda depois que a página carrega
function startChat() {
    chat = document.getElementById("chat"); // garante que o elemento existe

    addMessage(
        "Olá, me chamo <b>Nave</b> e serei seu garçom virtual.<br><br>Qual seu nome?",
        "bot"
    );

    document.getElementById("userInput").disabled = false;
    document.getElementById("sendButton").disabled = false;
}

// Adiciona mensagens
function addMessage(text, sender, buttons = []) {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    div.innerHTML = text;
    chat.appendChild(div);

    if (buttons.length > 0) {
        buttons.forEach(btn => {
            const b = document.createElement("button");
            b.classList.add("option");
            b.innerText = btn.text;
            b.onclick = () => {
                addMessage(btn.text, "user");
                btn.action();
            };
            chat.appendChild(b);
        });
    }

    chat.scrollTop = chat.scrollHeight;
}

// Quando cliente envia texto
function sendMessage() {
    const input = document.getElementById("userInput");
    const msg = input.value.trim();

    if (msg === "") return;

    addMessage(msg, "user");
    input.value = "";

    if (etapa === "inicio") {
        userName = msg;
        etapa = "menu";
        menuPrincipal();
        return;
    }

    if (etapa === "elogioTexto") {
        addMessage(
            `Obrigado pelo seu retorno, ${userName}! ❤️`,
            "bot",
            [
                { text: "Voltar ao menu", action: menuPrincipal },
                { text: "Encerrar", action: finalizar }
            ]
        );
    }
}

// MENU PRINCIPAL
function menuPrincipal() {
    etapa = "menu";

    addMessage(
        `Como posso ajudar, ${userName}?`,
        "bot",
        [
            { text: "1 - Fazer pedido", action: iniciarPedido },
            { text: "2 - Sugestão da Nave", action: sugestaoNave },
            { text: "3 - Elogio ou Sugestão", action: elogioSugestao },
            { text: "4 - Endereço", action: endereco }
        ]
    );
}

// ----- FAZER PEDIDO -----
function iniciarPedido() {
    etapa = "pedido";
    mostrarCardapio();
}

function mostrarCardapio() {
    addMessage("Escolha um item do cardápio:", "bot", [
        { text: "Strogonoff de Carne - R$30", action: () => escolherItem("Strogonoff de Carne") },
        { text: "Strogonoff de Frango - R$25", action: () => escolherItem("Strogonoff de Frango") },
        { text: "Macarrão à Bolonhesa - R$18", action: () => escolherItem("Macarrão à Bolonhesa") },
        { text: "Refrigerante - R$7", action: () => escolherItem("Refrigerante") },
        { text: "Suco - R$10", action: () => escolherItem("Suco") }
    ]);
}

function escolherItem(item) {
    pedido.push(item);
    total += menu[item];

    addMessage(
        `Você escolheu <b>${item}</b>. Confirmar?`,
        "bot",
        [
            { text: "Confirmar", action: confirmarItem },
            { text: "Cancelar", action: () => {
                pedido.pop();
                total -= menu[item];
                mostrarCardapio();
            }}
        ]
    );
}

function confirmarItem() {
    addMessage("Deseja adicionar mais itens?", "bot", [
        { text: "Sim", action: mostrarCardapio },
        { text: "Não", action: formaPagamento }
    ]);
}

function formaPagamento() {
    addMessage(
        `Seu pedido:<br>${pedido.join("<br>")}<br><br>Total: R$${total}<br><br>Forma de pagamento:`,
        "bot",
        [
            { text: "Débito", action: finalizar },
            { text: "Crédito", action: finalizar },
            { text: "PIX", action: finalizar },
            { text: "Vale Refeição", action: finalizar },
            { text: "Dinheiro", action: finalizar }
        ]
    );
}

// ----- SUGESTÃO -----
function sugestaoNave() {
    etapa = "sugestao";
    addMessage("Do que você mais gosta?", "bot", [
        { text: "Carne", action: () => sugestaoItem("Carne") },
        { text: "Frango", action: () => sugestaoItem("Frango") },
        { text: "Macarrão", action: () => sugestaoItem("Macarrão") }
    ]);
}

function sugestaoItem(tipo) {
    let item = "";

    if (tipo === "Carne") item = "Strogonoff de Carne";
    if (tipo === "Frango") item = "Strogonoff de Frango";
    if (tipo === "Macarrão") item = "Macarrão à Bolonhesa";

    pedido = [item];
    total = menu[item];

    addMessage(
        `Sugiro: <b>${item}</b> - R$${menu[item]}<br><br>Deseja bebida?`,
        "bot",
        [
            { text: "Sim", action: bebidasSugestao },
            { text: "Não", action: finalizarSugestao }
        ]
    );
}

function bebidasSugestao() {
    addMessage("Escolha a bebida:", "bot", [
        { text: "Refrigerante - R$7", action: () => bebidaEscolhida("Refrigerante") },
        { text: "Suco - R$10", action: () => bebidaEscolhida("Suco") }
    ]);
}

function bebidaEscolhida(bebida) {
    pedido.push(bebida);
    total += menu[bebida];
    finalizarSugestao();
}

function finalizarSugestao() {
    addMessage(
        `Pedido finalizado:<br>${pedido.join("<br>")}<br><br>Total: R$${total}<br><br>Nossos funcionários já estão preparando tudo!`,
        "bot"
    );
}

// ----- ELOGIO OU SUGESTÃO -----
function elogioSugestao() {
    etapa = "elogioEscolha";

    addMessage("Deseja enviar:", "bot", [
        { text: "Elogio", action: elogioTexto },
        { text: "Sugestão", action: elogioTexto }
    ]);
}

function elogioTexto() {
    etapa = "elogioTexto";

    addMessage("Digite sua mensagem:", "bot");
}

// ----- ENDEREÇO -----
function endereco() {
    addMessage(
        "📍 Nosso endereço:<br><b>Rua Nossa Senhora Auxiliadora, 25</b>",
        "bot",
        [
            { text: "Voltar ao menu", action: menuPrincipal }
        ]
    );
}

// ----- FINALIZA -----
function finalizar() {
    addMessage(
        `Obrigado, ${userName}! 🙌<br>Seu pedido está sendo preparado.`,
        "bot"
    );
}
