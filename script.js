let conversationHistory = [];

window.onload = () => {
    const modelSelect = document.getElementById('modelSelect');
    CONFIG.MODELS.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.text = model.name;
        modelSelect.appendChild(option);
    });
};

async function sendMessage() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const selectedModel = document.getElementById('modelSelect').value;
    const userInputField = document.getElementById('userInput');
    const userText = userInputField.value.trim();

    if (!userText) return;
    if (!apiKey) {
        alert("Por favor, cole sua OpenRouter API Key na barra lateral.");
        return;
    }

    appendMessage(userText, 'user');
    userInputField.value = '';

    if (conversationHistory.length === 0) {
        conversationHistory.push({ role: "system", content: FRANCISCO_PROMPT });
    }
    conversationHistory.push({ role: "user", content: userText });

    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'block';

    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href, 
                'X-Title': 'Francisco Agente Veiculos'
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: conversationHistory,
                temperature: 0.6,
                max_tokens: 700
            })
        });

        const data = await response.json();
        typingIndicator.style.display = 'none';

        if (data.choices && data.choices[0]) {
            const reply = data.choices[0].message.content;
            appendMessage(reply, 'agent');
            conversationHistory.push({ role: "assistant", content: reply });
        } else {
            appendMessage("Desculpe, deu um errinho na conexão. Cheque sua chave ou altere o modelo.", 'agent');
        }

    } catch (error) {
        typingIndicator.style.display = 'none';
        console.error(error);
        appendMessage("Erro de conexão com o servidor.", 'agent');
    }
}

// Modificado para renderizar o Chat Wrapper + Ícone de Avatar
function appendMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.getElementById('typingIndicator');
    
    // Wrapper principal da mensagem
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('message-wrapper', sender);
    
    // Div do ícone
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('chat-icon');
    
    // Define o ícone com base em quem envia
    if (sender === 'user') {
        iconDiv.innerHTML = '<i class="fa-solid fa-user"></i>';
    } else {
        iconDiv.innerHTML = '<i class="fa-solid fa-user-tie"></i>';
    }
    
    // Div do texto
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerText = text;
    
    // Monta a estrutura
    wrapperDiv.appendChild(iconDiv);
    wrapperDiv.appendChild(messageDiv);
    
    // Insere antes do "Francisco está pensando..."
    chatMessages.insertBefore(wrapperDiv, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}