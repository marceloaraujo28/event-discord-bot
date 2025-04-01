import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder } from "discord.js";
import { SetupType } from "../types";

export async function Setup({ interaction, prisma }: SetupType) {
  const guild = interaction.guild;

  await interaction.deferReply({ ephemeral: true });

  if (!guild) {
    return await interaction.editReply(`Erro ao buscar a guild!!`);
  }

  try {
    const guildInfo = await prisma.guilds.findUnique({
      where: {
        guildID: guild.id,
      },
    });

    //criar categoria de canais para iniciar eventos
    const category = await guild?.channels.create({
      type: ChannelType.GuildCategory,
      name: "💎Área de eventos💎",
    });

    //criar a sala para criação de eventos
    const newEvent = await guild?.channels.create({
      name: "⛳⠀criar-evento",
      type: ChannelType.GuildText,
      parent: category?.id,
    });

    //criar embed na sala de criar eventos
    const embed = new EmbedBuilder();

    embed.setTitle("Criar Evento #Albion Event Bot V1.0");
    embed.setFields(
      {
        name: "Criar um evento",
        value: "Reaja com o emoji ⚔️ para criar um evento",
      },
      {
        name: "Taxa da guild",
        value: `${guildInfo?.guildFee || 0}%`,
      },
      {
        name: "Taxa do vendedor",
        value: `${guildInfo?.sellerFee || 0}%`,
      },
      {
        name: "Expiração do bot:",
        value: "indeterminado",
      }
    );
    embed.setImage(
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjsXB9gZc8duaDrwqTOuqZ7Xub-jh25dVi693APA29or1khco4eg876DGsBj7zy2ilsoFyJeuO3gwNfaH_jIHULCa7g_D6fqWu26S08AM5-Jg80pTEwLXUwo2gE9AuUnX-znKEfeYsbaXk/s800/Albion.jpeg"
    );

    embed.setColor("Orange");

    //!------------->EMBED QUANDO NÃO TIVER PAGO<------------!
    // embed.setTitle("Ativar Albion Event Organizer");
    // embed.setDescription(
    //   "Para renovar sua assinatura e ativar o Albion Event Organizer, acesse o link abaixo:"
    // );
    // embed.setFields({
    //   name: "Link",
    //   value: "http://google.com.br",
    // });
    // embed.setColor("Red");

    const createEventButton = new ButtonBuilder()
      .setCustomId("create_event")
      .setLabel("⚔️ Criar Evento")
      .setStyle(ButtonStyle.Secondary);

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(createEventButton);

    await newEvent?.send({ embeds: [embed], components: [buttonRow] });

    //criar a sala para participar dos eventos
    const participationEvent = await guild?.channels.create({
      name: "🎮⠀Participar evento",
      type: ChannelType.GuildText,
      parent: category?.id,
    });

    //criar a sala de financeiro
    const financialChannel = await guild?.channels.create({
      name: "💰⠀Financeiro",
      type: ChannelType.GuildText,
      parent: category.id,
    });

    //criar a sala para mostrar os logs
    const logsChannel = await guild?.channels.create({
      name: "📝⠀Logs",
      type: ChannelType.GuildText,
      parent: category?.id,
    });

    //criar sala de espera de conteudo
    const waitingVoiceChannel = await guild?.channels.create({
      name: "Aguardando conteúdo",
      type: ChannelType.GuildVoice,
      parent: category?.id,
    });

    const startedEvents = await guild?.channels.create({
      name: "eventos iniciados",
      type: ChannelType.GuildCategory,
    });

    //criar categoria de canais eventos encerrados e eventos iniciados
    const endedEvents = await guild?.channels.create({
      type: ChannelType.GuildCategory,
      name: "eventos finalizados",
    });

    const findRole = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    const roleId = findRole?.eventManagerRoleID ?? "";
    let roles = interaction.guild.roles.cache.get(roleId) || null;

    if (!roles && roleId) {
      try {
        roles = await interaction.guild.roles.fetch(roleId);
      } catch (error) {
        console.error(`Erro ao buscar cargo ${roleId}, na guild ${guild.id}`);
      }
    }

    let managerRole = roles;

    if (!managerRole) {
      managerRole = await guild.roles.create({
        name: "Albion Event Bot Manager",
        color: "Red",
        hoist: true,
        mentionable: true,
        permissions: [
          "ViewChannel", // Ver canais
          "CreateGuildExpressions", // Criar expressões
          "CreateInstantInvite", // Criar convite
          "ChangeNickname", // Alterar apelido
          "SendMessages", // Enviar mensagens
          "SendMessagesInThreads", // Enviar mensagens em tópicos
          "CreatePublicThreads", // Criar tópicos públicos
          "CreatePrivateThreads", // Criar tópicos privados
          "EmbedLinks", // Inserir links
          "AttachFiles", // Anexar arquivos
          "AddReactions", // Adicionar reações
          "UseExternalEmojis", // Usar emojis externos
          "MentionEveryone", // Mencionar @everyone, @here e todos os cargos
          "ReadMessageHistory", // Ver histórico de mensagens
          "SendTTSMessages", // Enviar mensagens de texto-para-voz
          "SendVoiceMessages", // Enviar mensagens de voz
          "SendPolls", // Criar enquetes
          "Connect", // Conectar
          "Speak", // Falar
          "Stream", // Vídeo
          "UseSoundboard", // Usar efeitos sonoros
          "UseExternalSounds", // Usar sons externos
          "UseVAD", // Usar detecção de voz
          "RequestToSpeak", // Definir status no canal de voz
          "UseApplicationCommands", // Usar comandos de aplicativo
          "UseEmbeddedActivities", // Usar atividades
          "UseApplicationCommands", // Utilizar aplicativos externos
          "CreateEvents", // Criar eventos
        ],
      });
    }

    //registrando id dos canais no banco

    if (interaction.guildId) {
      await prisma.guilds.upsert({
        where: {
          guildID: interaction.guildId,
        },
        update: {
          newEventChannelID: newEvent?.id,
          participationChannelID: participationEvent?.id,
          logsChannelID: logsChannel?.id,
          financialChannelID: financialChannel.id,
          waitingVoiceChannelID: waitingVoiceChannel?.id,
          startedCategoryID: startedEvents?.id,
          endedCategoryID: endedEvents?.id,
          eventManagerRoleID: managerRole.id,
          categoryID: category.id,
        },
        create: {
          guildID: interaction.guildId,
          newEventChannelID: newEvent?.id,
          participationChannelID: participationEvent?.id,
          logsChannelID: logsChannel?.id,
          financialChannelID: financialChannel.id,
          waitingVoiceChannelID: waitingVoiceChannel?.id,
          startedCategoryID: startedEvents?.id,
          endedCategoryID: endedEvents?.id,
          eventManagerRoleID: managerRole.id,
          categoryID: category.id,
        },
      });

      await interaction.user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎉 Obrigado por usar o Albion Event Bot! 🎉")
            .setDescription(
              "O setup foi concluído com sucesso! Agora seu servidor está pronto para criar eventos e gerenciar sua comunidade com facilidade."
            )
            .addFields(
              {
                name: "📌 Próximos Passos",
                value:
                  "Use o comando `/help` para ver todos os comandos disponíveis e aprender como configurar os eventos.",
              },
              {
                name: "💡 Dica",
                value: "Adicione o cargo `Albion Event Manager` a quem deve gerenciar os eventos no servidor.",
              }
            )
            .setColor("Green")
            .setFooter({ text: "Estamos à disposição para qualquer dúvida! 🚀" }),
        ],
      });

      return await interaction.editReply(`Setup finalizado com sucesso!!`);
    } else {
      return await interaction.editReply(`Erro ao fazer o setup!`);
    }
  } catch (error) {
    console.log("Erro ao fazer o setup!", error);
    return;
  }
}
