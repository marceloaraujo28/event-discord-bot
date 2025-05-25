require("dotenv").config();

import {
  ChannelType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  PermissionFlagsBits,
  PermissionsBitField,
  User,
} from "discord.js";
import { ParticipateEvent } from "./actions/ParticipateEvent";
import { StartEvent } from "./actions/StartEvent";

import { PrismaClient } from "@prisma/client";
import { VoiceUpdate } from "./actions/VoiceUpdate";
import { FinishedEvent } from "./actions/FinishedEvent";
import { DeleteEvent } from "./actions/DeleteEvent";
import { handleGuildEvents } from "./handlers/guildEventHandler";
import { ProcessDeposit } from "./actions/ProcessDeposit";
import "./data/itemsLoader";
import { initI18n } from "./locales/initI18n";
import { isInCooldown, setCooldown } from "./utils/cooldown";
import { useT } from "./utils/useT";
import { handleCommandInteraction } from "./handlers/handleCommandInteraction";
import { handleButtonInteraction } from "./handlers/handleButtonInteraction";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const prisma = new PrismaClient();

client.once("ready", async () => {
  await handleGuildEvents({
    client,
    prisma,
  });

  await initI18n();

  console.log(`Bot online como ${client.user?.tag}`);
});

client.on("guildCreate", async (guild) => {
  try {
    // Buscar idioma padrão (exemplo: pt), ou defina como fallback
    const language = "en-US";
    const t = useT(language);

    // Buscar o dono do servidor
    const owner = await guild.fetchOwner();

    // Criar o embed
    const embedChannel = new EmbedBuilder()
      .setTitle(t("setup.welcomeEmbed.title"))
      .setDescription(t("setup.welcomeEmbed.description"))
      .addFields(
        {
          name: t("setup.welcomeEmbed.field1name"),
          value: t("setup.welcomeEmbed.field1value"),
        },
        {
          name: t("setup.welcomeEmbed.field3name"),
          value: t("setup.welcomeEmbed.field3value", { discordLink: "https://discord.gg/AjGZbc5b2s" }),
        }
      )
      .setColor("DarkOrange")
      .setThumbnail("https://cdn.discordapp.com/avatars/1272188978765893714/dadee0975ad1b9c9cf65c51290dabaa6.png");

    const adminEmbed = new EmbedBuilder()
      .setTitle("Thank you for using Albion Event Bot on your server!")
      .setDescription(
        "Our main goal is to simplify loot split management and help you track market prices in Albion Online.\nMake sure the bot has the necessary **permissions** to ensure full functionality."
      )
      .setFields(
        {
          name: "Join our Discord to ask questions or share suggestions",
          value: "[Albion Event Bot Discord](https://discord.gg/AjGZbc5b2s)",
        },
        {
          name: "See all bot features using the command:",
          value: "`/help`",
        }
      )
      .setFooter({
        text: "Have fun and make the most out of the Albion Event Bot.",
      })
      .setTimestamp()
      .setColor("DarkOrange")
      .setThumbnail("https://cdn.discordapp.com/avatars/1272188978765893714/dadee0975ad1b9c9cf65c51290dabaa6.png");

    // Tentar enviar uma DM para o dono do servidor
    await owner.send({ embeds: [adminEmbed] });

    // Achar o primeiro canal de texto onde o bot pode enviar mensagens
    const channel = guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildText && c.permissionsFor(guild.members.me!)?.has(PermissionFlagsBits.SendMessages)
    );

    if (channel?.isTextBased()) {
      await channel.send({ embeds: [embedChannel] });
    }
  } catch (error) {
    console.error("Erro ao enviar embed no guildCreate:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  //comandos de barra
  if (interaction.isCommand()) {
    await handleCommandInteraction(interaction, prisma);
  }

  //comandos de botão
  if (interaction.isButton()) {
    await handleButtonInteraction(interaction, prisma);
  }
});

client.on(
  "messageReactionAdd",
  async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (reaction.partial) {
      try {
        reaction = await reaction.fetch();
      } catch (error) {
        console.error("Erro ao buscar reação parcial", error);
      }
    }

    if (user.partial) {
      try {
        user = await user.fetch();
      } catch (error) {
        console.error("Erro ao buscar usuário parcial", error);
        return;
      }
    }

    if (user.bot) return;

    const message = reaction.message;

    if (!message) {
      console.warn("Mensagem não encontrada na reação.");

      const channel = reaction.message?.channel;

      if ("send" in channel && typeof channel.send === "function") {
        try {
          await channel.send(`${user} reaction message not found`);
        } catch (err) {
          console.warn("Erro ao enviar mensagem no canal:", err);
        }
      }

      return;
    }

    if (message.author?.id !== client.user?.id) return;


    const guildData = await prisma.guilds.findUnique({
      where: {
        guildID: message.guild?.id,
      },
    });

    if (!guildData) {
      console.log(
        `configurações da guild: ${reaction.message.guild?.name}[${reaction.message.guildId}] não encontradas!`
      );
      return;
    }

    const t = useT(guildData.language);

    //verificação de tempo de reação
    if (isInCooldown(user.id)) {
      try {
        await reaction.users.remove(user.id);
      } catch (err: any) {
        if (err.code === 10008) {
          console.warn("Mensagem já deletada, não foi possível remover a reação.");
          return;
        } else {
          console.error("Erro ao remover reação:", err);
        }
      }
      const channel = reaction.message.channel;
      if ("send" in channel && typeof channel.send === "function") {
        try {
          const msg = await channel.send(t("index.waitSendMessage", { user }));
          setTimeout(() => msg.delete().catch(() => {}), 3000);
        } catch (err) {
          console.warn("Erro ao enviar mensagem de cooldown:", err);
        }
      }
      return;
    }

    setCooldown(user.id);

    const embed = message.embeds[0];

    if (!embed) return;

    const channelID = message.channel.id;

    const financeChannelID = guildData?.financialChannelID;
    const participationChannelID = guildData?.participationChannelID;

    // Obtém o membro e verifica se ele tem o cargo de admin
    const member = await message.guild?.members.fetch(user.id);
    const isAdmin = member?.permissions.has(PermissionsBitField.Flags.Administrator);
    const managerRole = await member?.guild.roles.fetch(guildData?.eventManagerRoleID ?? "");
    const isManager = managerRole && member?.roles.cache.has(managerRole.id);

    //reações do canal financeiro
    if (channelID === financeChannelID) {
      await reaction.users.remove(user.id);
      if (reaction.emoji.name === "✅" && isAdmin) {
        const footerText = embed.footer?.text;

        // Extrair o nome do evento
        const eventNameMatch = footerText?.match(/ID:(Event\s\d+)/);
        const eventName = eventNameMatch ? eventNameMatch[1] : null;

        // Extrair o valor total informado
        const totalValueMatch = footerText?.match(/v:\s*([\d,.]+)/);
        const totalValue = totalValueMatch ? Number(totalValueMatch[1].replace(/[,.]/g, "")) : null;

        if (!eventName) {
          if (message.channel && "send" in message.channel) {
            await message.channel.send(t("index.eventUnidentified"));
          }
          return;
        }

        if (!totalValue) {
          if (message.channel && "send" in message.channel) {
            return await message.channel.send(t("index.depositUnidentified"));
          }

          return;
        }

        const event = await prisma.event.findFirst({
          where: {
            eventName,
          },
        });

        if (!event) {
          if (message.channel && "send" in message.channel) {
            await message.channel.send(t("index.eventNotFound"));
          }

          return;
        }
        if (event.status === "closed") {
          return;
        }

        try {
          await ProcessDeposit({
            eventId: event.id,
            prisma,
            totalValue,
          });

          await prisma.event.update({
            where: {
              id: event.id,
            },
            data: {
              status: "closed",
            },
          });

          //atualizar o embed com deposito confirmado
          const guildData = await prisma.guilds.findUnique({
            where: {
              guildID: event.guildId,
            },
          });

          //alterar mensagem caso o deposito tenha dado certo
          const financeChannel = await message.guild?.channels.fetch(guildData?.financialChannelID || "");

          if (!financeChannel) {
            console.log("Canal financeiro não encontrado!");
            return;
          }

          //atualizar embed cada o deposito tenha sido concluido
          if (financeChannel?.isTextBased()) {
            const confirmationMessage = await financeChannel.messages.fetch(event.confirmationMessageID ?? "");

            if (confirmationMessage) {
              const updatedEmbed = new EmbedBuilder()
                .setTitle(
                  t("index.confirmedDepositEmbed.title", {
                    eventName: event.eventName,
                  })
                )
                .setDescription(
                  t("index.confirmedDepositEmbed.description", {
                    userId: user.id,
                    totalValue: totalValue.toLocaleString("en-US"),
                    eventName: event.eventName,
                  })
                )
                .setColor("Green");

              await confirmationMessage.edit({ embeds: [updatedEmbed] });
              await confirmationMessage.reactions.removeAll();
            }
          }
        } catch (error) {
          console.error(`Erro ao processar depóstio do ${event.eventName}`, error);
        }
      }
    }

    //reações de gerenciamento do evento
    if (channelID === participationChannelID) {
      const eventNumberMatch = embed.title?.match(/^Event (\d+)\b/);
      const eventNumber = eventNumberMatch?.[1] || "";
      const keyTitle = `Event ${eventNumber}`;

      const event = await prisma.event.findFirst({
        where: {
          eventName: keyTitle,
        },
      });

      const eventCreator = event?.creatorId === user.id;

      //função para participar do evento
      if (reaction.emoji.name === "🚀") {
        await ParticipateEvent({
          reaction,
          user,
          prisma,
          message,
          embed,
          keyTitle,
          eventNumber,
          guildData,
        });

        return;
      }

      if (!isAdmin && !isManager && !eventCreator) {
        await reaction.users.remove(user.id);
        return;
      }

      //função para começar o evento
      if (reaction.emoji.name === "🏁") {
        await StartEvent({
          user,
          reaction,
          message,
          embed,
          prisma,
          keyTitle,
          eventNumber,
          guildData,
        });

        return;
      }

      //função de finalizar o evento
      if (reaction.emoji.name === "⏸") {
        await FinishedEvent({
          user,
          message,
          embed,
          prisma,
          keyTitle,
          reaction,
          guildData,
        });

        return;
      }

      //excluir evento
      if (reaction.emoji.name === "🛑") {
        await DeleteEvent({
          keyTitle,
          message,
          prisma,
          reaction,
          user,
          guildData,
        });

        return;
      }
    }
  }
);
//1337200529624928286
//lógica para "escutar" quando o usuário sai da sala
client.on("voiceStateUpdate", async (oldState, newState) => {
  // Ignorar bots
  if (oldState.member?.user.bot || newState.member?.user.bot) {
    return;
  }

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: oldState.guild?.id,
    },
  });

  if (!guildData) {
    return console.log("Guild não encontrada, servidor", oldState.guild.name);
  }

  const event = await prisma.event.findFirst({
    where: {
      channelID: oldState.channelId,
    },
  });

  if (event?.status === "finished") {
    return;
  }

  await VoiceUpdate({
    newState,
    oldState,
    prisma,
    guildData,
  });
});

client.login(process.env.BOT_KEY);
