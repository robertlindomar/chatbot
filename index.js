const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Cria o cliente com autenticação local (guarda sessão localmente)
const client = new Client({
    authStrategy: new LocalAuth()
});

// Objeto para armazenar a sessão de cada usuário
const sessions = {};

let botInitialized = false;

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code gerado. Escaneie com o WhatsApp do seu smartphone.');
});

client.on('ready', () => {
    console.log('Cliente está pronto e conectado!');
});

client.on('message', (message) => {
    const user = message.from; // Identificador do usuário
    const text = message.body.trim().toLowerCase();

    if (!botInitialized) {
        if (text === 'teste') {
            botInitialized = true;
            // message.reply('Bot inicializado. Como posso ajudar?');
        } else {
            // message.reply('Envie "TESTE" para inicializar o bot.');
        }
        return;
    }

    // Se não houver sessão iniciada para o usuário, apresenta o menu principal
    if (!sessions[user]) {
        sessions[user] = { stage: 'main' };
        message.reply(
            `Olá, seja bem-vindo ao nosso atendimento!
Escolha uma das opções:
1. Suporte técnico
2. Informações de produto
3. Falar com um atendente`
        );
        return;
    }

    const session = sessions[user];

    // Menu principal: usuário deve escolher 1, 2 ou 3
    if (session.stage === 'main') {
        if (text === '1') {
            session.stage = 'suporte';
            message.reply(
                `Você escolheu Suporte Técnico. Escolha uma das opções:
1. Problemas de conexão
2. Problemas de hardware
3. Problemas de software`
            );
        } else if (text === '2') {
            session.stage = 'informacoes';
            message.reply(
                `Você escolheu Informações de Produto. Escolha uma das opções:
1. Novidades
2. Preços
3. Garantia`
            );
        } else if (text === '3') {
            session.stage = 'atendente';
            message.reply(
                `Você escolheu Falar com um atendente. Escolha uma das opções:
1. Solicitar contato
2. Horário de atendimento
3. Outras dúvidas`
            );
        } else {
            message.reply(
                `Opção inválida.
Por favor, escolha uma das opções:
1. Suporte técnico
2. Informações de produto
3. Falar com um atendente`
            );
        }
    }
    // Submenu para Suporte Técnico
    else if (session.stage === 'suporte') {
        if (text === '1') {
            message.reply("Você selecionou Problemas de conexão. Por favor, descreva seu problema de conexão.");
        } else if (text === '2') {
            message.reply("Você selecionou Problemas de hardware. Por favor, descreva seu problema de hardware.");
        } else if (text === '3') {
            message.reply("Você selecionou Problemas de software. Por favor, descreva seu problema de software.");
        } else {
            message.reply(
                `Opção inválida para Suporte Técnico.
Escolha uma das opções:
1. Problemas de conexão
2. Problemas de hardware
3. Problemas de software`
            );
            return; // Mantém o usuário na mesma etapa para corrigir a escolha
        }
        // Finaliza a sessão após a escolha
        delete sessions[user];
    }
    // Submenu para Informações de Produto
    else if (session.stage === 'informacoes') {
        if (text === '1') {
            message.reply("Você selecionou Novidades. Aqui estão as últimas novidades: [inserir novidades].");
        } else if (text === '2') {
            message.reply("Você selecionou Preços. Nossos preços são: [inserir preços].");
        } else if (text === '3') {
            message.reply("Você selecionou Garantia. Informações sobre garantia: [inserir informações].");
        } else {
            message.reply(
                `Opção inválida para Informações de Produto.
Escolha uma das opções:
1. Novidades
2. Preços
3. Garantia`
            );
            return;
        }
        delete sessions[user];
    }
    // Submenu para Falar com um Atendente
    else if (session.stage === 'atendente') {
        if (text === '1') {
            message.reply("Você selecionou Solicitar contato. Um atendente entrará em contato em breve.");
        } else if (text === '2') {
            message.reply("Você selecionou Horário de atendimento. Nosso horário é de 9h às 18h.");
        } else if (text === '3') {
            message.reply("Você selecionou Outras dúvidas. Por favor, descreva sua dúvida e um atendente entrará em contato.");
        } else {
            message.reply(
                `Opção inválida para Falar com um atendente.
Escolha uma das opções:
1. Solicitar contato
2. Horário de atendimento
3. Outras dúvidas`
            );
            return;
        }
        delete sessions[user];
    }
});

client.initialize();
