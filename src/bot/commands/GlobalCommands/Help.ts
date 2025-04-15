import { EmbedBuilder } from "discord.js";

export function Help() {
  return new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("📜 Lista de Comandos")
    .setDescription(
      "Aqui estão todos os comandos disponíveis do bot, organizados para facilitar seu uso.\n\n⚠️ **Atenção:** Não exclua nenhuma sala criada pelo bot! Caso isso aconteça, será necessário reconfigurá-lo para evitar erros.\n\n"
    )
    .addFields(
      {
        name: "\uD83D\uDCB0 Preços Mercado\n",
        value: "`/preco` - consulta o preço de um item no mercado - (Opcional a busca por tier e cidade).\n",
      },
      {
        name: "\u2728 Configuração Inicial Gerenciamento de Saldo",
        value:
          "`/setup` - Configura automaticamente as salas e permissões do bot. **(Admin)**\n" +
          "`/meu-saldo` - Consulta seu saldo atual.\n" +
          "`/saldos` - Exibe o saldo de todos os membros da guild.\n" +
          "`/saldo-membro` - Consulta o saldo de um membro específico.\n" +
          "`/saldo-guild` - Verifica o saldo da guild.",
      },
      {
        name: "\uD83D\uDCB3 Transações Financeiras",
        value:
          "`/depositar-guild` - Adiciona saldo ao caixa da guild. **(Admin)**\n" +
          "`/sacar-guild` - Retira saldo do caixa da guild. **(Admin)**\n" +
          "`/pagar-membro` - Envia um pagamento para um membro utilizando o saldo da guild. **(Admin)**\n" +
          "`/confiscar-saldo` - Remove o saldo de um membro e adiciona à guild. **(Admin)**\n" +
          "`/transferir-saldo` - Transfere saldo da sua conta para outro membro.",
      },
      {
        name: "\uD83C\uDF1F Eventos e Participação",
        value:
          "`/vendedor` - Adiciona um vendedor ao evento.\n" +
          "`/simular-evento` - Simula a divisão dos valores entre os participantes.\n" +
          "`/atualizar-participacao` - Modifica a porcentagem de participação de um jogador.\n" +
          "`/atualizar-taxa-vendedor` - Ajusta a taxa paga aos vendedores. **(Admin)**\n" +
          "`/atualizar-taxa-guild` - Ajusta a taxa paga à guild. **(Admin)**\n" +
          "`/depositar-evento` - Deposita um valor arrecadado no evento no saldo da guild.",
      },
      {
        name: "\u2753 Ajuda",
        value: "\n\nSuporte: \n[Discord Albion Event Bot](https://discord.gg/AjGZbc5b2s)\n",
      }
    )
    .setFooter({ text: "Use os comandos corretamente para garantir a melhor experiência!" });
}
