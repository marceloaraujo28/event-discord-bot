import { SlashCommandBuilder } from "discord.js";

export const commands = [
  new SlashCommandBuilder().setName("setup").setDescription("criar salas iniciais!").toJSON(),
  new SlashCommandBuilder()
    .setName("vendedor")
    .setDescription("Atribui o papel de vendedor a um membro")
    .addUserOption((option) =>
      option.setName("membro").setDescription("Selecione o membro ex: @membro").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("simular-evento")
    .setDescription("Simular quantos cada participante receberá de acordo com sua participação e o valor total")
    .addStringOption((input) =>
      input.setName("valor").setDescription("Digite o valor arrecadado no evento ex: 1,000,000").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("atualizar-participacao")
    .setDescription("Atualizar o valor da participação de um membro")
    .addUserOption((option) =>
      option.setName("membro").setDescription("Digite o nome do membro ex: @membro").setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("participacao")
        .setDescription("atualizar porcentagem da participação (de 0 a 100) ex: 80")
        .setRequired(true)
        .setMaxValue(100)
    ),
  new SlashCommandBuilder()
    .setName("atualizar-taxa-vendedor")
    .setDescription("Atualizar a taxa do vendedor")
    .addNumberOption((option) =>
      option
        .setName("taxa")
        .setDescription("Valor da nova taxa do vendedor (0 a 100) exemplo:50")
        .setMaxValue(100)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("atualizar-taxa-guild")
    .setDescription("Atualizar a taxa da guild")
    .addNumberOption((option) =>
      option
        .setName("taxa")
        .setDescription("Valor da nova taxa da guild (0 a 100) exemplo:50")
        .setMaxValue(100)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("depositar-evento")
    .setDescription("Depositar o valor do evento no saldo da guild")
    .addStringOption((input) =>
      input.setName("valor").setDescription("Valor a ser depositado ex: 1,000,000").setRequired(true)
    ),
  new SlashCommandBuilder().setName("meu-saldo").setDescription("Consultar seu saldo atual"),
  new SlashCommandBuilder().setName("saldos").setDescription("Consultar o saldo de todos os membros"),
  new SlashCommandBuilder()
    .setName("saldo-membro")
    .setDescription("Consultar o saldo de um membro")
    .addUserOption((option) =>
      option.setName("membro").setDescription("Membro a ter o saldo consultado").setRequired(true)
    ),
  new SlashCommandBuilder().setName("saldo-guild").setDescription("Consultar o saldo atual da guild"),
  new SlashCommandBuilder()
    .setName("depositar-guild")
    .setDescription("Depositar saldo na guild")
    .addStringOption((option) =>
      option
        .setName("valor")
        .setDescription("Valor a ser depositado no saldo da guild, ex: 1,000,000")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("sacar-guild")
    .setDescription("Retirar valor do saldo da guild")
    .addStringOption((option) =>
      option.setName("valor").setDescription("Valor a ser retirado do saldo da guild, ex: 1,000,000").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("pagar-membro")
    .setDescription("Pagar um membro com o saldo da guild")
    .addUserOption((option) =>
      option.setName("membro").setDescription("Membro que irá receber o pagamento").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("valor").setDescription("Valor a ser pago ao membro, ex: 100,000").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("confiscar-saldo")
    .setDescription("Confiscar o saldo de um membro e transferir para o saldo da guild")
    .addUserOption((option) =>
      option.setName("membro").setDescription("Membro que tera seu saldo confiscado").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("transferir-saldo")
    .setDescription("Tranfere saldo da sua conta para outro membro")
    .addUserOption((option) =>
      option
        .setName("membro")
        .setDescription("Membro que receberá o valor a ser transferido, ex: @membro")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("valor").setDescription("Valor que será transferido").setRequired(true)
    ),
  new SlashCommandBuilder().setName("help").setDescription("Para ver comandos disponíveis e entender os fluxos!"),
  new SlashCommandBuilder().setName("remove-bot").setDescription("Remove todas as salas e canais criados pelo bot"),
];
