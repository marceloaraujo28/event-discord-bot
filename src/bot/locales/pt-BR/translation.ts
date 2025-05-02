import { error } from "console";

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
  updateParticipation: {
    noMessage: "Mensagens do canal do evento foram excluídas",
    noEmbed: "Evento não encontrado na sala",
    errorUpdateParticipation: "Erro ao atualizar a participação do usuário <@{{userId}}>",
    successUpdateParticipation:
      "<@{{interactionUserId}}> atualizou a participação do usuário <@{{userId}}> para {{updatedPercentage}}%",
    catchError: "Erro ao atualizar a participação do usuário, entre em contato com o suporte",
  },
};

export default ptBR;
