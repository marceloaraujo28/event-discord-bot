import { SlashCommandBuilder } from "discord.js";

export const commands = [
  new SlashCommandBuilder()
    .setName("openevent")
    .setDescription("Abrir Evento")
    .toJSON(),
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("criar salas iniciais!")
    .toJSON(),
];
