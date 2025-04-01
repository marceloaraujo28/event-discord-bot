import { REST, Routes } from "discord.js";
import { commands } from "./commands";
import dotenv from "dotenv";

dotenv.config();

export async function registerCommands() {
  if (!process.env.BOT_KEY || !process.env.APPLICATION_ID || !process.env.GUILD_ID_DEVELOPMENT) {
    return;
  }
  const rest = new REST().setToken(process.env.BOT_KEY);

  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`Registrando comandos no servidor de teste...`);

      const guildId = process.env.GUILD_ID_DEVELOPMENT;
      const applicationId = process.env.APPLICATION_ID;

      await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
        body: commands,
      });

      console.log("Comandos registrados no servidor de teste!");
    }

    if (process.env.NODE_ENV === "production") {
      const applicationId = process.env.APPLICATION_ID;
      console.log("Registrando comandos globais...");
      await rest.put(Routes.applicationCommands(applicationId), {
        body: commands,
      });
      console.log("Comandos globais registrados!");
    }
  } catch (error) {
    console.log(error);
  }
}

registerCommands().catch((error) => console.error("Erro ao registrar comandos..", error));
