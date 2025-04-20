import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder } from "discord.js";
import { SetupType } from "../types";
import { useT } from "../../utils/useT";

export async function Setup({ interaction, prisma }: SetupType) {
  const guild = interaction.guild;
  const language = interaction.options.get("idioma")?.value as string;

  await interaction.deferReply({ ephemeral: true });
  const t = useT(language);

  try {
    if (!guild) {
      return await interaction.editReply(t("setup.noGuild"));
    }
    //criar categoria de canais para iniciar eventos
    const category = await guild?.channels.create({
      type: ChannelType.GuildCategory,
      name: t("setup.categoryEventArea"),
    });

    //criar a sala para criação de eventos
    const newEvent = await guild?.channels.create({
      name: t("setup.categoryCreateEvent"),
      type: ChannelType.GuildText,
      parent: category?.id,
    });

    //criar embed na sala de criar eventos
    const embed = new EmbedBuilder();

    embed.setTitle(t("setup.embedCreateEvent.title"));
    embed.setFields(
      {
        name: t("setup.embedCreateEvent.field1title"),
        value: t("setup.embedCreateEvent.field1value"),
      },
      {
        name: t("setup.embedCreateEvent.field2title"),
        value: `${t("setup.embedCreateEvent.field2value", {
          guildFee: 0,
        })}`,
      },
      {
        name: t("setup.embedCreateEvent.field3title"),
        value: `${t("setup.embedCreateEvent.field3value", {
          sellerFee: 0,
        })}`,
      },
      {
        name: t("setup.embedCreateEvent.field4title"),
        value: t("setup.embedCreateEvent.field4value"),
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
      .setLabel(t("setup.createEventButton"))
      .setStyle(ButtonStyle.Secondary);

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(createEventButton);

    await newEvent?.send({ embeds: [embed], components: [buttonRow] });

    //criar a sala para participar dos eventos
    const participationEvent = await guild?.channels.create({
      name: t("setup.participateEventChannel"),
      type: ChannelType.GuildText,
      parent: category?.id,
    });

    //criar a sala de financeiro
    const financialChannel = await guild?.channels.create({
      name: t("setup.financeChannel"),
      type: ChannelType.GuildText,
      parent: category.id,
    });

    //criar sala de verificar saldo
    const checkBalanceChannel = await guild?.channels.create({
      name: t("setup.checkBalanceChannel"),
      type: ChannelType.GuildText,
      parent: category.id,
    });

    //criar a sala para mostrar os logs
    const logsChannel = await guild?.channels.create({
      name: t("setup.logsChannel"),
      type: ChannelType.GuildText,
      parent: category?.id,
    });

    //criar sala de espera de conteudo
    const waitingVoiceChannel = await guild?.channels.create({
      name: t("setup.waitingVoicechannel"),
      type: ChannelType.GuildVoice,
      parent: category?.id,
    });

    const startedEvents = await guild?.channels.create({
      name: t("setup.startedEvents"),
      type: ChannelType.GuildCategory,
    });

    //criar categoria de canais eventos encerrados e eventos iniciados
    const endedEvents = await guild?.channels.create({
      type: ChannelType.GuildCategory,
      name: t("setup.endedEvents"),
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
        console.error(`${t("setup.errorSearchRole", { roleId, guildId: guild.id })}`);
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
          checkBalanceID: checkBalanceChannel.id,
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
          checkBalanceID: checkBalanceChannel.id,
          endedCategoryID: endedEvents?.id,
          eventManagerRoleID: managerRole.id,
          categoryID: category.id,
        },
      });

      await interaction.user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(t("setup.welcomeEmbed.title"))
            .setDescription(t("setup.welcomeEmbed.description"))
            .addFields(
              {
                name: t("setup.welcomeEmbed.field1name"),
                value: t("setup.welcomeEmbed.field1value"),
              },
              {
                name: t("setup.welcomeEmbed.field2name"),
                value: t("setup.welcomeEmbed.field2value"),
              },
              {
                name: t("setup.welcomeEmbed.field3name"),
                value: t("setup.welcomeEmbed.field3value", { discordLink: "https://discord.gg/AjGZbc5b2s" }),
              }
            )
            .setColor("Green"),
        ],
      });

      return await interaction.editReply(t("setup.setupFinished"));
    } else {
      return await interaction.editReply(t("setup.setupError"));
    }
  } catch (error: unknown) {
    console.log(t("setup.catchError"), error);

    // Verifica se o erro é um objeto e se tem a propriedade 'code'
    if (error instanceof Error) {
      const err = error as any; // Força o TypeScript a aceitar as propriedades personalizadas

      if (err.rawError?.code === 50013) {
        return await interaction.editReply(t("setup.catchError2"));
      }

      return await interaction.editReply(t("setup.catchError3"));
    }

    return await interaction.editReply(t("setup.catchError4"));
  }
}
