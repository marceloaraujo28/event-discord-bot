import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

interface ProcessDepositType {
  eventId: number;
  totalValue: number;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}

export async function ProcessDeposit({ eventId, prisma, totalValue }: ProcessDepositType) {
  try {
    //buscar eventos
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        Participant: true,
      },
    });

    if (!event) {
      console.error("Evento não encontrado!");
      return;
    }

    const participants = event.Participant;

    if (participants.length === 0) {
      console.error("Nenhum participante encontrado!");
      return;
    }

    //buscar informações da guilda
    const guild = await prisma.guilds.findUnique({
      where: {
        guildID: event.guildId,
      },
    });

    if (!guild) {
      console.error("Guild não encontrada!");
      return;
    }

    const taxaGuild = guild.guildFee / 100;
    const taxaSeller = guild.sellerFee / 100;

    const valueTaxaGuild = totalValue * taxaGuild;
    const valueTaxaVendedor = totalValue * taxaSeller;
    const valueDistribuido = totalValue - valueTaxaGuild - valueTaxaVendedor;

    const valueTaxaGuildRounded = Math.round(valueTaxaGuild);
    const valueTaxaVendedorRounded = Math.round(valueTaxaVendedor);
    const valueDistribuidoRounded = Math.round(valueDistribuido);

    //atualizar saldo da guild
    await prisma.guilds.update({
      where: {
        guildID: event.guildId,
      },
      data: {
        totalBalance: {
          increment: valueTaxaGuildRounded,
        },
      },
    });

    //atualizar saldo do vendedor
    if (event.seller) {
      await prisma.user.update({
        where: {
          userId_guildID: {
            guildID: event.guildId,
            userId: event.seller,
          },
        },
        data: {
          currentBalance: {
            increment: valueTaxaVendedorRounded,
          },
          totalEarned: {
            increment: valueTaxaVendedorRounded,
          },
        },
      });
    }
    // 1. Somar todas as porcentagens dos participantes (igual ao código antigo)
    const totalPercentage = participants.reduce((sum, p) => sum + p.percentage, 0);

    // 2. Distribuir os valores proporcionalmente
    let participantValues = participants.map((participant) => ({
      userId: participant.userId,
      percentage: participant.percentage,
      rawValue: (valueDistribuidoRounded * participant.percentage) / totalPercentage,
      roundedValue: Math.floor((valueDistribuidoRounded * participant.percentage) / totalPercentage), // Arredondar para baixo inicialmente
    }));

    // 3. Ajustar a soma para garantir que o total seja exato
    const distributedTotal = participantValues.reduce((sum, p) => sum + p.roundedValue, 0);
    const diff = valueDistribuidoRounded - distributedTotal;

    // 4. Distribuir a diferença ajustando o valor de alguns participantes
    for (let i = 0; i < diff; i++) {
      participantValues[i % participantValues.length].roundedValue += 1;
    }

    // 5. Atualizar os valores no banco de dados
    for (const participant of participantValues) {
      await prisma.user.update({
        where: {
          userId_guildID: { userId: participant.userId, guildID: event.guildId },
        },
        data: {
          currentBalance: { increment: participant.roundedValue },
          totalEarned: { increment: participant.roundedValue },
        },
      });

      // 6. Atualizar o valor recebido pelo participante no evento
      await prisma.participant.update({
        where: {
          userId_eventId: { userId: participant.userId, eventId: event.id },
        },
        data: {
          valueEvent: participant.roundedValue,
        },
      });
    }
  } catch (error) {
    console.error("Erro ao processar o depósito", error);
  }
}
