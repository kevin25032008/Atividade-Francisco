let conversationHistory = [];
let userApiKey = ""; // A chave fica guardada aqui apenas enquanto a aba estiver aberta

window.onload = () => {
    // Pop-up seguro para pedir a chave ao carregar a página
    userApiKey = prompt("Por favor, insira sua OpenRouter API Key para iniciar o atendimento:");
    
    if (!userApiKey) {
        alert("A chave de API é necessária para conversar com o Francisco. Atualize a página e insira a chave.");
    }

    // Inicializa o select de modelos
    const modelSelect = document.getElementById('modelSelect');
    CONFIG.MODELS.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.text = model.name;
        modelSelect.appendChild(option);
    });
};

// Dentro da sua função sendMessage(), mude a leitura da chave para:
// const apiKey = userApiKey;
