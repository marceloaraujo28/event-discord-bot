import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import { SetupType } from "./types";

export async function Setup({ interaction, prisma }: SetupType) {
  const guild = interaction.guild;

  try {
    await interaction.deferReply();

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

    embed.setTitle("Criar Evento #AlbionEventOrganizer");
    embed.setFields(
      {
        name: "Criar um evento",
        value: "Reaja com o emoji ⚔️ para criar um evento",
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

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      createEventButton
    );

    await newEvent?.send({ embeds: [embed], components: [buttonRow] });

    //criar a sala para participar dos eventos
    const participationEvent = await guild?.channels.create({
      name: "🎮⠀participar do evento",
      type: ChannelType.GuildText,
      parent: category?.id,
    });

    //criar a sala para mostrar os logs
    const logsChannel = await guild?.channels.create({
      name: "📝⠀logs",
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
          waitingVoiceChannelID: waitingVoiceChannel?.id,
          startedCategoryID: startedEvents?.id,
          endedCategoryID: endedEvents?.id,
        },
        create: {
          guildID: interaction.guildId,
          newEventChannelID: newEvent?.id,
          participationChannelID: participationEvent?.id,
          logsChannelID: logsChannel?.id,
          waitingVoiceChannelID: waitingVoiceChannel?.id,
          startedCategoryID: startedEvents?.id,
          endedCategoryID: endedEvents?.id,
        },
      });
    }

    await interaction.editReply(`Setup finalizado com sucesso!!`);
  } catch (error) {
    console.log("Erro ao fazer o setup!", error);
  }
}
