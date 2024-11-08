require("dotenv").config();

import {
  Client,
  GatewayIntentBits,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
  SlashCommandBuilder,
} from "discord.js";
import { OpenEvent } from "./commands/OpenEvent";
import { ParticipateEvent } from "./actions/ParticipateEvent";
import { ParticipantTimesType } from "./types";
import { StartEvent } from "./actions/StartEvent";

//fazer:
//adicionar projeto no github
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

let eventCounter = 0;
const eventStore: Record<string, Record<string, ParticipantTimesType>> = {};

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
    eventCounter++;
    await OpenEvent({
      eventCounter,
      interaction,
      eventStore,
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

    //está redundante, dentro de ParticipateEvent tem as mesmas variaveis
    const message = reaction.message;
    const embed = message.embeds[0];
    const creatorNameMatch = embed.title?.match(/Criado por (.+)$/);
    const creatorName = creatorNameMatch ? creatorNameMatch[1] : null;

    //função para participar do evento
    if (reaction.emoji.name === "✅" && !user.bot) {
      await ParticipateEvent({
        reaction,
        user,
        eventCounter,
        eventStore,
      });

      console.log(eventStore);
    }

    //função para começar o evento
    if (reaction.emoji.name === "🏌️‍♀️") {
      await StartEvent({
        user,
        reaction,
        creatorName,
        eventStore,
        message,
        eventCounter,
        embed,
      });
    }

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

  const messages = await oldState.channel?.fetch();
  const embed = await messages?.messages.fetch();

  //logica para verificar se o usuario saiu da sala
  //quando o usuario sair da sala o oldState.channelId ira existir e será diferente do newState.channelId
  if (oldState.channelId && oldState.channelId !== newState.channelId) {
    console.log(eventStore, embed?.size);
    // para tirar o usuário do evento, preciso zerar o join time dele null
    // preciso atualizar o total time dele
    // preciso atualizar o embed para retirar o nome do participante
  }
});

client.login(process.env.BOT_KEY);
