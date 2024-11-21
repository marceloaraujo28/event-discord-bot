require("dotenv").config();

import {
  Client,
  GatewayIntentBits,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { OpenEvent } from "./commands/OpenEvent";
import { ParticipateEvent } from "./actions/ParticipateEvent";
import { ParticipantTimesType } from "./types";
import { StartEvent } from "./actions/StartEvent";

import { PrismaClient } from "@prisma/client";
import { VoiceUpdate } from "./actions/VoiceUpdate";
import { FinishedEvent } from "./actions/FinishedEvent";

//fazer:
//criar sala participar evento, quando o usuario iniciar o evento
//mudar sala para texto
//para inciar, finalizar deixar só as pessoas como adiministrador
//quando o usuário está na sala e a sala é excluida da erro
//logica de começar o evento
//atualizar o join time de todos os usuários para Date now, que é quando começa o evento
//quando o usuário sair da sala, remover atualizar o totalTime dele no eventStore e setar o join time para null
//fazer logica de finalizar o evento, contabilizar a porcentagem de todos e atualizar o embed "@Marcelo - 100%"
//criar comando para atualizar o saldo do evento e contabilizar para cada jogador o seu valor em relação a sua porcentagem
//criar um canal de log e o bot enviar erros que podem acontecer

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const prisma = new PrismaClient();

client.once("ready", async () => {
  console.log("Bot online");

  const guild = client.guilds.cache.get("1272187120135700540");
  if (guild) {
    const commands = guild.commands;

    await commands.create(
      new SlashCommandBuilder()
        .setName("openevent")
        .setDescription("Abrir Evento")
    );
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  if (commandName === "openevent") {
    await OpenEvent({
      interaction,
    });
  }
});

client.on(
  "messageReactionAdd",
  async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {
    if (reaction.partial) {
      try {
        reaction = await reaction.fetch();
      } catch (error) {
        console.error("Erro ao buscar reação parcial", error);
      }
    }

    const message = reaction.message;
    const embed = message.embeds[0];
    const creatorNameMatch = embed.title?.match(/Criado por (.+)$/);
    const creatorName = creatorNameMatch ? creatorNameMatch[1] : null;

    const eventNumberMatch = embed.title?.match(/Evento (\d+) -/);
    const eventNumber = eventNumberMatch?.[1] || "";
    const keyTitle = `Evento ${eventNumber}`;

    //função para participar do evento
    if (reaction.emoji.name === "✅" && !user.bot) {
      await ParticipateEvent({
        reaction,
        user,
        prisma,
        message,
        embed,
        keyTitle,
        eventNumber,
      });
    }

    //função para começar o evento
    if (reaction.emoji.name === "🏌️‍♀️") {
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
    }

    //função de finalizar o evento
    if (reaction.emoji.name === "⏸") {
      if (user.bot) return;

      await FinishedEvent({
        user,
        message,
        embed,
        prisma,
        keyTitle,
      });
    }

    //excluir evento
    if (reaction.emoji.name === "🛑") {
      if (user.bot) return;
      if (creatorName === user.username) {
        await message.delete();
        await message.channel.delete();
        console.log(`${creatorName} cancelou o evento!`);
      }
    }
  }
);

//lógica para "escutar" quando o usuário sai da sala
client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.member?.user.bot) {
    return;
  }

  await VoiceUpdate({
    newState,
    oldState,
    prisma,
  });
});

client.login(process.env.BOT_KEY);
