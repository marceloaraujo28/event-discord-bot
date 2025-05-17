const ptBR = {
  setup: {
    noGuild: "Erro ao buscar guild",
    categoryEventArea: "💎Área de eventos💎",
    categoryCreateEvent: "⛳criar-evento",
    embedCreateEvent: {
      title: "Criar Evento #Albion Event Bot V1.0",
      field1title: "Criar um evento",
      field1value: "Reaja com o emoji ⚔️ para criar um evento",
      field2title: "🧾 Taxa da guild",
      field2value: "{{guildFee}}%",
      field3title: "💸 Taxa do vendedor",
      field3value: "{{sellerFee}}%",
      field4title: "⌛ Expiração do bot:",
      field4value: "O Bot expira em: tempo indeterminado",
      field5title: "🔊 Suporte",
      field5value:
        "Para entrar em contato com nossa equipe de suporte, Acesse nosso [Discord Oficial](https://discord.gg/AjGZbc5b2s)",
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
  updateGuildFee: {
    noGuild: "Erro ao atualizar a taxa, guild id não existe",
    noFee: "Digite um valor valido",
    eventChannelNotFound: "Canal de eventos não encontrado para atualização da taxa do vendedor",
    eventChannelNotFound2: "Canal de eventos não encontrado para atualização da taxa da guild",
    embedNotFound: "Erro: Não foi possível encontrar o embed de criação de eventos",
    updateSuccess: "<@{{userId}}> atualizou a taxa da guild para {{guildFee}}%",
    updateError: "Erro ao atualizar a taxa da guild no banco de dados",
  },
  updateSellerFee: {
    noGuild: "Erro ao atualizar a taxa, guild id não existe",
    noFee: "Digite um valor valido",
    eventChannelNotFound: "Canal de eventos não encontrado no banco de dados",
    eventChannelNotFound2: "Canal de eventos não encontrado para atualização da taxa do vendedor",
    embedNotFound: "Erro: Não foi possível encontrar o embed de criação de eventos",
    updateSuccess: "<@{{userId}}> atualizou a taxa do vendedor para {{sellerFee}}%",
    updateError: "Erro ao atualizar a taxa do vendedor no banco de dados",
  },
  guildDeposit: {
    invalidValue: "Campo em branco! Por favor digite um número",
    invalidValue2: "Entrada inválida. Por favor, insira um número válido ex: 1,000,000",
    updateDepositError: "Erro ao realizar o depósito",
    updateDepositSuccess:
      "<@{{userId}}> fez um depósito no valor de `{{depositValue}}` na guild, saldo atual: `{{currentValue}}`",
    successDeposit: "Depósito efetuado com sucesso! o saldo agora é de: `{{currentValue}}`",
    catchError: "Erro ao realizar o depósito, entre em contato com o suporte",
  },
  withdrawGuild: {
    invalidValue: "Campo em branco, Por favor digite um número",
    invalidValue2: "Entrada inválida. Por favor, insira um número válido ex: 1,000,000",
    withdrawInsuficient:
      "<@{{userId}}> tentou realizar um saque no valor de `{{withdrawValue}}` mas a guild não possui saldo suficiente!",
    withdrawInsuficientMessage: "O saldo da guild é insuficiente para realizar o saque",
    withdrawError: "Erro ao realizar o saque",
    withdrawSuccess:
      "<@{{userId}}> sacou um valor de `{{withdrawValue}}` do saldo da guild, saldo atual: `{{currentValue}}`",
    withdrawSuccessMessage: "Saque efetuado com sucesso. O saldo agora é de: `{{currentValue}}`",
    catchError: "Erro ao realizar o saque, entre em contato com o suporte",
  },
  payMember: {
    invalidValue: "Campo em branco. Por favor digite um número",
    invalidValue2: "Entrada inválida. Por favor, insira um número válido ex: 1,000,000",
    insufficientGuildBalance:
      "<@{{interactionUserId}}> tentou realizar um pagamento de `{{withdrawValue}}` para o jogador <@{{userId}}> mas a guild não possui saldo suficiente!",
    insufficientGuildBalanceMessage: "O saldo da guild é insuficiente para realizar o pagamento",
    insufficientUserBalance: "Valor do pagamento maior que o saldo do usuário",
    erroPayMember: "Erro ao tentar realizar pagamento para o jogador",
    successPayMember:
      "<@{{interactionUserId}}> realizou um pagamento de `{{withdrawValue}}` para o jogador <@{{userId}}>",
    successPayMemberMessage: "Pagamento para <@{{userId}}> no valor de `{{withdrawValue}}` realizado com sucesso",
    catchError: "Erro ao realizar o pagamento, entre em contato com o suporte",
  },
  confiscateBalance: {
    userNotFound: "Usuário não encontrado na base de dados",
    confiscateBalanceError: "Erro ao tentar confiscar saldo do usuário",
    confiscateBalanceSuccess: "<@{{interactionUserId}}> confiscou o saldo do jogador <@{{userId}}>",
    confiscateBalanceSuccessMessage: "Saldo do jogador <@{{userId}}> confiscado com sucesso",
    confiscateBalanceErrorMessage: "Erro no banco ao tentar confiscar saldo do jogador",
  },
  updateLanguage: {
    updateError: "Erro ao atualizar a linguagem no banco de dados, entre em contato com o suporte",
  },
  removeBot: {
    noGuild: "Não foi possível encontrar a guild",
    embed: {
      title: "Salas removidas com sucesso",
      description:
        "O bot de evento foi removido com sucesso.\n Todos os canais, cargos e eventos associados foram excluídos. Agradecemos por ter utilizado nossos serviços!\n Entre em nosso servidor do Discord, se você tiver algum feedback ou sugestão, não hesite em nos enviar",
      footer: "Até breve!",
    },
    errorRemove: "Erro ao remover o bot, entre em contato com o suporte",
  },
  simulateEvent: {
    noMessage: "Mensagens do canal do evento foram excluídas",
    noEmbed: "Evento não encontrado na sala",
    noGuildId: "Não foi possível buscar o id da guild",
    noGuild: "Guild não encontrada no banco de dados",
    emptyValue: "Campo em branco, Por favor digite um número",
    invalidValue: "Entrada inválida. Por favor, insira um número válido ex: 1,000,000",
    errorUpdateEvent: "Erro ao atualizar o valor do {{eventName}}",
    embed: {
      title: "SIMULAÇÃO DE VENDA DO {{eventName}}",
      seller: "Vendedor",
      valueTotal: "Valor total",
      guildFee: "Taxa da guild",
      sellerFee: "Taxa do vendedor",
      participants: "Participantes",
      distribuitedTotal: "Total a ser distrubuído entre os participantes com taxas aplicadas:",
      nextSteps: "Próximo passo",
      nextStepsValue:
        "Utilize o comando abaixo para depositar o valor do evento no saldo dos jogadores:\n```\n/depositar-evento {{eventValue}}\n```",
      catchError: "Erro ao simular o evento, entre em contato com o suporte",
    },
  },
  eventDeposit: {
    noFininishedEvent: "\n`Esse comando só pode ser utilizado em eventos finalizados`",
    noMessage: "Mensagens do canal do evento foram excluídas",
    noEmbed: "Evento não encontrado na sala",
    noFinancialChannel: "\n`Canal financeiro não configurado para esta guilda`",
    noFinancialChannel2: "\n`Canal financeiro não encontrado ou inválido`",
    noValue: "Campo em branco. Por favor digite um número",
    invalidValue: "Entrada inválida. Por favor, insira um número válido exemplo: 1,000,000",
    embed: {
      title: "Confirmação de Depósito",
      description:
        "<@{{userId}}> informou o valor total de `{{depositValue}}` arrecadado no **{{eventName}}**.\n\n valor a ser distribuído entre os participantes **(com taxas)**: `{{valueDistribuido}}`\n\n ✅ **Clique na reação abaixo para confirmar.**",
      successOrder: "Pedido de depósito enviado para o canal <#{{financeChannelId}}>",
      catchError: "Erro ao realizar o depósito, entre em contato com o suporte",
    },
  },
  admin: {
    noGuild: "Dados da guild não encontrados, use /setup ou entre em contato com o suporte",
  },
  updateParticipation: {
    noMessage: "Mensagens do canal do evento foram excluídas",
    noEmbed: "Evento não encontrado na sala",
    errorUpdateParticipation: "Erro ao atualizar a participação do usuário <@{{userId}}>",
    successUpdateParticipation:
      "<@{{interactionUserId}}> atualizou a participação do usuário <@{{userId}}> para {{updatedPercentage}}%",
    catchError: "Erro ao atualizar a participação do usuário, entre em contato com o suporte",
  },
  balances: {
    userNotFound: "A guild ainda não possui saldos a serem exibidos",
    noBalances: "`Nenhum saldo encontrado`",
    embed: {
      title: "SALDO ATUAL DOS JOGADORES",
      fieldName: "Nome",
      fieldBalance: "Saldo",
    },
    catchError: "Erro ao buscar saldos dos jogadores, entre em contato com o suporte",
  },
  guildBalance: {
    guildNotFound: "Guild não encontrada no banco de dados",
    guildBalance: "O saldo da guild é de: `{{currentBalance}}`",
    catchError: "Erro ao buscar o saldo da guild, entre em contato com o suporte",
  },
  myBalance: {
    userNotFound: "<@{{userId}}> não foram encontrados dados seus na base de dados",
    memberBalance: "<@{{userId}}> seu saldo atual é de: `{{currentBalance}}`",
    catchError: "Erro no banco ao tentar consultar seu saldo, entre em contato com o suporte",
  },
  transferBalance: {
    invalidValue: "Campo em branco, Por favor digite um número",
    invalidValue2: "Entrada inválida. Por favor, insira um número válido ex: 1,000,000",
    senderNotFound: "Remetente não encontrado na base de dados",
    insufficientBalance: "Seu saldo é insuficiente para realizar a transferência",
    transferError: "Erro ao tentar realizar a transferência",
    transferSuccess: "Tranferência de `{{value}}` pratas realizada com sucesso para o jogador <@{{userId}}>",
    catchError: "Erro ao realizar a transferência, entre em contato com o suporte",
  },
  memberBalance: {
    userNotFound: "Usuário não encontrado na base de dados",
    balance: "o saldo <@{{userId}}> é de: `{{currentBalance}}` pratas",
    catchError: "Erro no banco ao tentar consultar o saldo do jogador, entre em contato com o suporte",
  },
  help: {
    title: "📜 Lista de Comandos",
    description:
      "Aqui estão todos os comandos disponíveis do bot, organizados para facilitar seu uso.\n\n⚠️ **Atenção:** Não exclua nenhuma sala criada pelo bot! Caso isso aconteça, será necessário reconfigurá-lo para evitar erros.\n\n",
    field1name: "\uD83D\uDCB0 Preços Mercado\n",
    field1value:
      "`/preco` - Consulta o preço de um item no mercado. (tier,cidade e server são opcionais).\nEx: `/preco machado de guerra`, ou \n`/preco machado de guerra [tier ex: 4.3] [cidade] [server]`",
    field2name: "\u2728 Configuração Inicial Gerenciamento de Saldo",
    field2value:
      "`/lang` - Altera o idioma do bot.  **(Admin)**\n" +
      "`/setup` - Configura automaticamente as salas e permissões do bot. **(Admin)**\n" +
      "`/meu-saldo` - Consulta seu saldo atual.\n" +
      "`/saldos` - Exibe o saldo de todos os membros da guild.\n" +
      "`/saldo-membro` - Consulta o saldo de um membro específico.\n" +
      "`/saldo-guild` - Verifica o saldo da guild.",
    field3name: "\uD83D\uDCB3 Transações Financeiras",
    field3value:
      "`/depositar-guild` - Adiciona saldo ao caixa da guild. **(Admin)**\n" +
      "`/sacar-guild` - Retira saldo do caixa da guild. **(Admin)**\n" +
      "`/pagar-membro` - Envia um pagamento para um membro utilizando o saldo da guild. **(Admin)**\n" +
      "`/confiscar-saldo` - Remove o saldo de um membro e adiciona à guild. **(Admin)**\n" +
      "`/transferir-saldo` - Transfere saldo da sua conta para outro membro.",
    field4name: "\uD83C\uDF1F Eventos e Participação",
    field4value:
      "`/vendedor` - Adiciona um vendedor ao evento.\n" +
      "`/simular-evento` - Simula a divisão dos valores entre os participantes.\n" +
      "`/atualizar-participacao` - Modifica a porcentagem de participação de um jogador.\n" +
      "`/atualizar-taxa-vendedor` - Ajusta a taxa paga aos vendedores. **(Admin)**\n" +
      "`/atualizar-taxa-guild` - Ajusta a taxa paga à guild. **(Admin)**\n" +
      "`/depositar-evento` - Deposita o valor do evento no saldo dos participantes.",
    field5name: "\u2753 Ajuda",
    field5value: "\n\nSuporte: \n[Discord Albion Event Bot](https://discord.gg/AjGZbc5b2s)\n",
    footer: "Use os comandos corretamente para garantir a melhor experiência!",
  },
  price: {
    noItem: "Informe o nome de um item",
    invalidTier: "Tier inválido. Use o formato correto, exemplo: `4.0`, `5.3`, `6.1`.",
    itemNotFound: "Item não encontrado",
    itemNotFound2: "Não há dados disponíveis para este item",
    qualities: {
      normal: "Normal",
      good: "Bom",
      outstanding: "Excepcional",
      excellent: "Excelente",
      masterpiece: "Obra-prima",
    },
    embed: {
      sellOrders: "Ordens de VENDA",
      city: "Cidade (Qualidade)",
      price: "Preço",
      lastUpdate: "Última atualização",
      buyOrders: "Ordens de COMPRA",
      footer: "\n\n❗ Digite o nome do item no idioma do seu Discord ❗\n\n/help para mais informações",
    },
    catchError: "Erro ao buscar dados, entre em contato com o suporte",
  },
  deleteEvent: {
    canceledMessage: "<@{{userId}}> cancelou o evento.",
  },
  finishedEvent: {
    finishedMessage: "Canal de texto criado para o {{channelName}} finalizado",
    embed: {
      title: "{{eventTitle}} - Criado por {{username}}",
      participants: "Participantes",
      seller: "Vendedor",
      sellerValue: "Nenhum vendedor",
      totalParticipants: "Total Participantes",
      duration: "Duração",
    },
    informationEmbed: {
      title: "Oque fazer agora?",
      sellerTitle: "Vincule um vendedor para gerenciar o evento",
      sellerValue: "\n\n`/vendedor @membro`",
      simulateTitle: "Para simular o valor que cada participante recebera,utilize o comando:",
      simulateValue: "\n`/simular-evento 1,000,000`",
      updateTitle:
        "As simulações podem ser feitas várias vezes.\n\nPara ajustar a participação de um membro específico, utilize o comando:\n",
      updateValue: "\n`/atualizar-participacao @membro 100`",
    },
  },
  participateEvent: {
    messageChannel: "<@{{userId}}> você precisa estar em um canal de voz para poder participar de um evento",
    catchError: "Erro ao adicionar o participante {{userMention}} ao evento",
  },
  startEvent: {
    embed: {
      title: "Event {{eventNumber}} Criado por {{userName}} - Iniciado",
    },
  },
  voiceUpdate: {
    noPlayer: "Nenhum participante",
  },
  openEvent: {
    notInChannel: "<@{{interactionUser}}> você precisa estar em um canal de voz para poder iniciar um evento",
    embed: {
      title: "Event {{eventNumber}} Criado por {{userName}} - Não iniciado",
      description: "Entre no evento reagindo ao emoji 🚀 (Necessário estar em um canal de voz no Discord)",
      author: "Criador",
      totalPlayers: "Total Participantes",
      participants: "Participantes",
      instructionsTitle: "Passos para o Criador e Administrador do evento",
      instructionsValue:
        "🏁-Iniciar o Evento (Começa a contabilizar o tempo e a participação dos jogadores)\n\n⏸Finalizar o evento (Finaliza e mostra a porcentagem da participação dos jogadores)\n\n🛑Cancelar o evento (Exclui o evento e salas criadas por ele - Apenas em eventos não iniciados)",
    },
    eventCreated: "Event {{eventNumber}} criado com sucesso pelo jogador <@{{userId}}>",
    errorCreatedEvent: "Erro ao criar o evento",
    errorReply: "Erro ao criar evento",
  },
  index: {
    adminOnly: "Apenas um **Administrador** pode usar esse comando",
    noGuildInteraction: "Dados da guild não encontrados, use /setup ou entre em contato com o suporte",
    eventClosed: "Evento já fechado, não é possivel mais usar comandos",
    sellerOnly: "Apenas um Manager ou Administrador pode adicionar um vendedor ao evento",
    noSeller: "Adicione um vendedor antes de usar esse comando",
    noPermission: "esse comando só pode ser usado pelo vendedor",
    onlyEventChannel: "esse comando só pode ser usado em um canal de eventos",
    commandCatchError: "Ocorreu um erro ao processar o comando",
    createEventErro: "Erro ao tentar criar evento",
    notProcessedReaction: "{{user}} reação não processada porque a mensagem original foi apagada",
    waitSendMessage: "{{user}} aguarde 2 segundos antes de reagir novamente",
    eventUnidentified: "Não foi possível identificar o evento",
    depositUnidentified: "Não foi possível identificar o valor do depósito",
    eventNotFound: "Evento não encontrado",
    confirmedDepositEmbed: {
      title: "Depósito do {{eventName}} Confirmado",
      description:
        "<@{{userId}}> confirmou um depósito no valor de **{{totalValue}}** pratas, valor já depositado no saldo dos participantes do **${eventName}**",
    },
  },
};

export default ptBR;
