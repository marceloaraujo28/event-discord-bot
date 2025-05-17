require("dotenv").config();

import {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  PermissionsBitField,
  User,
} from "discord.js";
import { OpenEvent } from "./commands/OpenEvent";
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
      await reaction.users.remove(user.id);
      const channel = reaction.message.channel;
      if ("send" in channel && typeof channel.send === "function") {
        try {
          const msg = await channel.send(t("index.waitSendMessage", user));
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
    const isManager = await member?.guild.roles.fetch(guildData?.eventManagerRoleID ?? "");

    //reações do canal financeiro
    if (channelID === financeChannelID) {
      if (reaction.emoji.name === "✅") {
        await reaction.users.remove(user.id);
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
      const creatorNameMatch = embed.title?.match(/Criado por ([^-]+)/);
      const creatorName = creatorNameMatch ? creatorNameMatch[1].trim() : null;

      const eventNumberMatch = embed.title?.match(/^Event (\d+)\b/);
      const eventNumber = eventNumberMatch?.[1] || "";
      const keyTitle = `Event ${eventNumber}`;

      const eventCreator = creatorName === user.username;

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
          creatorName,
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
          creatorName,
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
