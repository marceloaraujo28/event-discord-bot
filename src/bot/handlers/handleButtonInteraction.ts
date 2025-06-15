import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { ButtonInteraction, CacheType, CommandInteraction } from "discord.js";
import { OpenEvent } from "../commands/OpenEvent";
import { useT } from "../utils/useT";

export async function handleButtonInteraction(
  interaction: ButtonInteraction<CacheType>,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: "Este comando só pode ser usado em servidores.",
      ephemeral: true,
    });
    return;
  }

  if (!interaction.guild) return; // Garante que estamos em um servidor
  //aqui tambem fazer verificação quando o cargo de criar de eventos for criado

  let guildData = null;
  let language = "pt-BR"; // Defina o idioma padrão como "pt-BR" se não houver dados da guilda
  let t: (key: string, options?: any) => string = () => "";

  try {
    guildData = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guild?.id,
      },
    });

    if (guildData?.language) {
      language = guildData.language;
    }

    t = useT(language);

    if (!guildData || interaction.channelId !== guildData?.newEventChannelID) {
      return await interaction.deferUpdate();
    }

    if (interaction.customId === "create_event") {
      await interaction.deferUpdate();
      await OpenEvent({ interaction, guildData, prisma });
    }
  } catch (error) {
    console.error("Erro ao tentar criar evento!");

    // Após deferir a interação, não é possível mais usar reply
    if (!interaction.replied && !interaction.deferred) {
      // Apenas usa reply se a interação não foi deferida nem respondida
      return await interaction.reply(t("index.createEventErro"));
    } else {
      // Caso tenha sido deferido ou já respondido, apenas loga o erro.
      console.error("Falha ao tentar criar evento, interação já foi deferida ou respondida.");
    }
  }
}
