const ptBR = {
  setup: {
    noGuild: "Erro ao buscar guild",
    categoryEventArea: "💎Área de eventos💎",
    categoryCreateEvent: "⛳criar-evento",
    embedCreateEvent: {
      title: "Criar Evento #Albion Event Bot V1.0",
      field1title: "Criar um evento",
      field1value: "Reaja com o emoji ⚔️ para criar um evento",
      field2title: "Taxa da guild",
      field2value: "{{guildFee}}%",
      field3title: "Taxa do vendedor",
      field3value: "{{sellerFee}}%",
      field4title: "Expiração do bot:",
      field4value: "Tempo indeterminado",
    },
    createEventButton: "⚔️ Criar Evento",
    participateEventChannel: "🎮⠀Participar evento",
    financeChannel: "💰⠀Financeiro",
    checkBalanceChannel: "💸⠀Verificar-saldo",
    logsChannel: "📝⠀Logs",
    waitingVoicechannel: "Aguardando conteúdo",
    startedEvents: "eventos iniciados",
    endedEvents: "eventos finalizados",
    errorSearchRole: "Erro ao buscar cargo {{roleId}}, na guild ${{guild.id}}",
    welcomeEmbed: {
      title: "🎉 Obrigado por usar o Albion Event Bot! 🎉",
      description:
        "O setup foi concluído com sucesso! Agora seu servidor está pronto para criar eventos e gerenciar sua comunidade com facilidade.",
      field1name: "📌 Próximos Passos",
      field1value:
        "Use o comando `/help` para ver todos os comandos disponíveis e aprender como configurar os eventos.",
      field2name: "💡 Dica",
      field2value: "Adicione o cargo `Albion Event Manager` a quem deve gerenciar os eventos no servidor.",
      field3name: "Suporte",
      field3value: "\n\n[Discord Albion Event Bot]({{discordLink}})\n",
    },
    setupFinished: "Setup concluído com sucesso",
    setupError: "Erro ao fazer o setup, entre em contato com o suporte",
    catchError: "Erro ao fazer o setup, entre em contato com o suporte",
    catchError2:
      "⚠️ Erro: O bot não tem permissões suficientes para executar essa ação.\n 🔧 Permissões necessárias: `Ver canais`, `Enviar mensagens`, `Gerenciar canais`, `Gerenciar mensagens`, `Adicionar reações`, `Ler histórico de mensagens`, `Conectar`, `Falar`, `Enviar embeds`, `Usar emojis externos`.\n💡 Verifique se essas permissões estão habilitadas para o bot no servidor.",
    catchError3: "❌ Ocorreu um erro inesperado ao fazer o setup",
    catchError4: "❌ Ocorreu um erro inesperado e não conseguimos determinar a causa.",
  },
};

export default ptBR;
