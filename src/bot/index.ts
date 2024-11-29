require("dotenv").config();

import {
  Client,
  GatewayIntentBits,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { OpenEvent } from "./commands/OpenEvent";
import { ParticipateEvent } from "./actions/ParticipateEvent";
import { StartEvent } from "./actions/StartEvent";

import { PrismaClient } from "@prisma/client";
import { VoiceUpdate } from "./actions/VoiceUpdate";
import { FinishedEvent } from "./actions/FinishedEvent";
import { Setup } from "./commands/Setup";
import { DeleteEvent } from "./actions/DeleteEvent";

//fazer:
//alterar embed quando finaliza evento e criar comandos de adicionar vendedor no evento
//quando entrar e sair do discord add no banco de dados para usar no site
//para inciar, finalizar deixar só as pessoas como adiministrador
//criar comando para atualizar o saldo do evento e contabilizar para cada jogador o seu valor em relação a sua porcentagem
//adicionar todos erros no log

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const prisma = new PrismaClient();

client.once("ready", async () => {
  console.log("Bot Online!!!!");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const { commandName } = interaction;

    if (commandName === "setup") {
      await Setup({
        interaction,
        prisma,
      });
    }
  }

  if (interaction.isButton()) {
    switch (interaction.customId) {
      case "create_event":
        await interaction.deferUpdate();
        await OpenEvent({ interaction });
        break;
    }
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
      await DeleteEvent({
        keyTitle,
        message,
        prisma,
        reaction,
        user,
        creatorName,
      });
    }
  }
);

//lógica para "escutar" quando o usuário sai da sala
client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.member?.user.bot) {
    return;
  }

  if (oldState && !oldState.guild.channels.cache.has(oldState.id)) {
    return;
  }

  await VoiceUpdate({
    newState,
    oldState,
    prisma,
  });
});

client.login(process.env.BOT_KEY);
