import { EmbedBuilder } from "discord.js";
import { ParticipateEventType } from "./types";

export const ParticipateEvent = async ({
  reaction,
  user,
  eventStore,
}: ParticipateEventType) => {
  const message = reaction.message;
  const guild = message.guild;
  const member = await guild?.members.fetch(user.id);
  const eventVoiceChannel = guild?.channels.cache.get(message.channelId);
  const embed = message.embeds[0];
  const userMention = `<@${user.id}>`;

  const eventNumberMatch = embed.title?.match(/Evento (\d+) -/);
  const eventNumber = eventNumberMatch?.[1] || "";
  const keyTitle = `Evento ${eventNumber}`;

  if (embed) {
    await reaction.users.remove(user.id);

    //verifica se o usuário está em algum canal de voz
    if (!member?.voice.channel) {
      return console.error(
        "O usuário não está conectado a nenhum canal de voz."
      );
    }

    const currentParticipants =
      embed.fields.find((field) => field.name === "Participantes")?.value ||
      "Nenhum";

    if (!currentParticipants.includes(user.id)) {
      //adiciona o usuário no array que controla entrada e saída, apenas se o participante não estiver ainda adicionado no array
      if (!eventStore[keyTitle][user.id]) {
        eventStore[keyTitle][user.id] = {
          totalTime: 0,
          joinTime:
            embed.description === "Evento não iniciado" ? null : Date.now(),
        };
      } else {
        eventStore[keyTitle][user.id].joinTime =
          embed.description === "Evento não iniciado" ? null : Date.now();
      }

      //se não tiver nenhum participante ele apenas adiciona no campo, se não, ele pega todos os outros e adiciona mais esse
      const updateParticipants =
        currentParticipants === "Nenhum participante"
          ? userMention
          : `${currentParticipants}\n${userMention}`;

      const updatedEmbed = new EmbedBuilder()
        .setTitle(embed.title)
        .addFields(
          embed.fields.map((field) => {
            if (field.name === "Participantes") {
              return {
                ...field,
                value: updateParticipants,
              };
            }

            return field;
          })
        )
        .setDescription(embed.description)
        .setColor(embed.color);

      await message.edit({ embeds: [updatedEmbed] });

      //puxar o usuário para a sala do evento caso ele não esteja na sala ainda
      //isso evita de o usuário estar participando do evento a partir de outra sala
      if (eventVoiceChannel && eventVoiceChannel.isVoiceBased()) {
        await member?.voice.setChannel(eventVoiceChannel);
      }
    }
  }
};
