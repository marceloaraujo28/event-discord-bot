import { CacheType, CommandInteraction, PermissionsBitField } from "discord.js";
import { Event } from "../commands/Event";
import { Admin } from "../commands/Admin";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { useT } from "../utils/useT";
import { Global } from "../commands/Global";
import { Seller } from "../commands/Seller";
import { Help } from "../commands/GlobalCommands/Help";
import { Price } from "../commands/GlobalCommands/Price";

export async function handleCommandInteraction(
  interaction: CommandInteraction<CacheType>,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) {
  const member = await interaction?.guild?.members.fetch(interaction.user.id);
  const isAdmin = member?.permissions.has(PermissionsBitField.Flags.Administrator);
  const { commandName } = interaction;

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

    if (commandName === "help") {
      const embed = Help({ interaction });
      await interaction.reply({ embeds: [embed] });
      return true;
    }

    if (commandName === "preco") {
      await Price({
        interaction,
        prisma,
      });
      return true;
    }

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
        "remover-bot",
      ];

      if (adminCommands.includes(commandName)) {
        return await interaction.reply(t("index.adminOnly"));
      }
    }

    if (!guildData) {
      const b = useT(interaction.locale);
      await interaction.reply(b("index.noGuildInteraction"));
      return;
    }

    //comandos qualquer cargo consegue usar
    const wasCommandExecuted = await Global({
      commandName,
      interaction,
      member,
      prisma,
      guildData,
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
        await interaction.reply(t("index.eventClosed"));
        return;
      }

      const isManager = await interaction?.guild?.roles.fetch(guildData?.eventManagerRoleID ?? "");

      if (commandName === "vendedor") {
        if (!isManager && !isAdmin) {
          return interaction.reply(t("index.sellerOnly"));
        }

        await Seller({
          prisma,
          interaction,
          event,
        });
        return;
      }

      if (!event.seller) {
        console.log(language);

        await interaction.reply(
          t("index.noSeller", {
            commandName,
          })
        );
        return;
      }

      const isSeller = event.seller === interaction.user.id; // Verifica se é o vendedor do evento

      if (isSeller || isAdmin || isManager) {
        return await Event({
          commandName,
          event,
          interaction,
          prisma,
          guildData,
        });
      } else {
        return await interaction.reply(t("index.noPermission", { commandName }));
      }
    } else {
      return await interaction.reply(t("index.onlyEventChannel", { commandName }));
    }
  } catch (error) {
    console.error("Erro ao processar interação:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply(t("index.commandCatchError", { commandName }));
    } else {
      console.error(`Falha ao processar comando: ${commandName}`);
    }
  }
}
