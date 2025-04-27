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
import { Seller } from "./commands/Seller";
import { handleGuildEvents } from "./handlers/guildEventHandler";
import { ProcessDeposit } from "./actions/ProcessDeposit";
import { Admin } from "./commands/Admin";
import { Event } from "./commands/Event";
import { Global } from "./commands/Global";
import "./data/itemsLoader";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

const prisma = new PrismaClient();

client.once("ready", async () => {
  await handleGuildEvents({
    client,
    prisma,
  });

  console.log(`Bot online como ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  const member = await interaction?.guild?.members.fetch(interaction.user.id);
  const isAdmin = member?.permissions.has(PermissionsBitField.Flags.Administrator);

  if (interaction.isCommand()) {
    const { commandName } = interaction;
    try {
      //comandos a serem usados apenas por administrador para configurações
      if (isAdmin) {
        const wasCommandExecuted = await Admin({
          commandName,
          interaction,
          prisma,
        });

        if (wasCommandExecuted) return;
      } else {
        // Se não for admin e tentar usar um comando restrito, retorna uma mensagem
        const adminCommands = [
          "setup",
          "atualizar-taxa-guild",
          "atualizar-taxa-vendedor",
          "depositar-guild",
          "pagar-membro",
          "sacar-guild",
          "confiscar-saldo",
          "remove-bot",
        ];
        if (adminCommands.includes(commandName)) {
          return await interaction.reply("Apenas um **Administrador** pode usar esse comando!");
        }
      }

      //comandos qualquer cargo consegue usar
      const wasCommandExecuted = await Global({
        commandName,
        interaction,
        member,
        prisma,
      });

      if (wasCommandExecuted) return;

      //comandos para evento
      const event = await prisma.event.findFirst({
        where: {
          channelID: interaction.channelId,
        },
      });

      //comandos só podem ser usados caso exista um evento no canal que foi usado o comando
      if (event) {
        if (event.status === "closed") {
          await interaction.reply("Evento já fechado, não é possivel mais usar comandos!");
          return;
        }

        const guildData = await prisma.guilds.findUnique({
          where: {
            guildID: interaction.guild?.id,
          },
        });

        const isManager = await interaction?.guild?.roles.fetch(guildData?.eventManagerRoleID ?? "");

        if (commandName === "vendedor") {
          if (!isManager && !isAdmin) {
            return interaction.reply("Apenas um Manager ou Administrador pode adicionar um vendedor ao evento!");
          }

          await Seller({
            prisma,
            interaction,
            event,
          });
          return;
        }

        if (!event.seller) {
          await interaction.reply(`Adicione um vendedor antes de usar /${commandName}!`);
          return;
        }

        const isSeller = event.seller === interaction.user.id; // Verifica se é o vendedor do evento

        if (isSeller || isAdmin || isManager) {
          return await Event({
            commandName,
            event,
            interaction,
            prisma,
          });
        } else {
          return await interaction.reply(`\n\`/${commandName}\` só pode ser usado pelo vendedor!`);
        }
      } else {
        return await interaction.reply(`\n\`/${commandName}\` só pode ser usado em um canal de eventos!`);
      }
    } catch (error) {
      console.error("Erro ao processar interação:", error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply(`Ocorreu um erro ao processar o comando: ${commandName}`);
      } else {
        console.error(`Falha ao processar comando: ${commandName}`);
      }
    }
  }

  //BOTÃO DE CRIAR EVENTO
  if (interaction.isButton()) {
    if (!interaction.guild) return; // Garante que estamos em um servidor
    //aqui tambem fazer verificação quando o cargo de criar de eventos for criado

    try {
      const guildData = await prisma.guilds.findUnique({
        where: {
          guildID: interaction.guild?.id,
        },
      });

      // const isManager = await interaction.guild.roles.fetch(guildData?.eventManagerRoleID ?? "");

      // if (!isAdmin && !isManager) {
      //   await interaction.deferUpdate();
      //   return;
      // }

      if (!guildData || interaction.channelId !== guildData?.newEventChannelID) {
        return await interaction.deferUpdate();
      }

      if (interaction.customId === "create_event") {
        await interaction.deferUpdate();
        await OpenEvent({ interaction, guildData });
      }
    } catch (error) {
      console.error("Erro ao tentar criar evento!");

      // Após deferir a interação, não é possível mais usar reply
      if (!interaction.replied && !interaction.deferred) {
        // Apenas usa reply se a interação não foi deferida nem respondida
        return await interaction.reply("Erro ao tentar criar evento!");
      } else {
        // Caso tenha sido deferido ou já respondido, apenas loga o erro.
        console.error("Falha ao tentar criar evento, interação já foi deferida ou respondida.");
      }
    }
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

    if (user.bot) return;

    const message = reaction.message;
    const embed = message.embeds[0];

    if (!embed) return;

    const channelID = message.channel.id;

    const guildData = await prisma.guilds.findUnique({
      where: {
        guildID: message.guild?.id,
      },
    });

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
        const description = embed.description;

        // Extrair o nome do evento
        const eventNameMatch = description?.match(/(Evento\s\d+)/);
        const eventName = eventNameMatch ? eventNameMatch[1] : null;

        // Extrair o valor total informado pelo usuário
        const totalValueMatch = description?.match(/informou o valor total de `([\d,\.]+)`/);
        const totalValue = totalValueMatch ? Number(totalValueMatch[1].replace(/[,.]/g, "")) : null;
        4;

        if (!eventName) {
          if (message.channel && "send" in message.channel) {
            await message.channel.send("Não foi possível identificar o evento!");
          }
          return;
        }

        if (!totalValue) {
          if (message.channel && "send" in message.channel) {
            return await message.channel.send("Não foi possível identificar o valor do depósito!");
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
            await message.channel.send("Evento não encontrado");
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
                .setTitle(`Depósito do ${event.eventName} Confirmado`)
                .setDescription(
                  `<@${user.id}> informou o valor de **${totalValue.toLocaleString(
                    "en-US"
                  )} moedas**, e ele já foi depositado e distribuído entre os participantes do **${event.eventName}**.`
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

      const eventNumberMatch = embed.title?.match(/^Evento (\d+)\b/);
      const eventNumber = eventNumberMatch?.[1] || "";
      const keyTitle = `Evento ${eventNumber}`;

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
  });
});

client.login(process.env.BOT_KEY);
