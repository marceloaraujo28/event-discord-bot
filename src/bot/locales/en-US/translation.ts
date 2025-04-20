const enUS = {
  setup: {
    noGuild: "Error fetching guild",
    categoryEventArea: "💎Event Area💎",
    categoryCreateEvent: "⛳create-event",
    embedCreateEvent: {
      title: "Create Event #Albion Event Bot V1.0",
      field1title: "Create an event",
      field1value: "React with the ⚔️ emoji to create an event",
      field2title: "Guild Fee",
      field2value: "{{guildFee}}%",
      field3title: "Seller Fee",
      field3value: "{{sellerFee}}%",
      field4title: "Bot Expiration:",
      field4value: "Indefinite time",
    },
    createEventButton: "⚔️ Create Event",
    participateEventChannel: "🎮⠀Participate Event",
    financeChannel: "💰⠀Finance",
    checkBalanceChannel: "💸⠀Check balance",
    logsChannel: "📝⠀Logs",
    waitingVoicechannel: "Waiting for content",
    startedEvents: "events started",
    endedEvents: "events ended",
    errorSearchRole: "Error fetching role {{roleId}}, in guild ${{guildId}}",
    welcomeEmbed: {
      title: "🎉 Thank you for using Albion Event Bot! 🎉",
      description:
        "Setup was successfully completed! Your server is now ready to create events and manage your community with ease.",
      field1name: "📌 Next Steps",
      field1value: "Use the `/help` command to see all available commands and learn how to set up events.",
      field2name: "💡 Tip",
      field2value: "Add the `Albion Event Manager` role to those who should manage events on the server.",
      field3name: "Support",
      field3value: "\n\n[Discord Albion Event Bot]({{discordLink}})\n",
    },
    setupFinished: "Setup completed successfully",
    setupError: "Error during setup, please contact support",
    catchError: "Error during setup, please contact support",
    catchError2:
      "⚠️ Error: The bot does not have sufficient permissions to perform this action.\n 🔧 Required permissions: `View Channels`, `Send Messages`, `Manage Channels`, `Manage Messages`, `Add Reactions`, `Read Message History`, `Connect`, `Speak`, `Send Embeds`, `Use External Emojis`.\n💡 Make sure these permissions are enabled for the bot on the server.",
    catchError3: "❌ An unexpected error occurred during setup",
    catchError4: "❌ An unexpected error occurred, and we couldn't determine the cause.",
  },
};

export default enUS;
