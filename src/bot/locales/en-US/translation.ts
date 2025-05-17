const enUS = {
  setup: {
    noGuild: "Error fetching guild",
    categoryEventArea: "💎Event Area💎",
    categoryCreateEvent: "⛳create-event",
    embedCreateEvent: {
      title: "Create Event #Albion Event Bot V1.0",
      field1title: "Create an event",
      field1value: "React with the ⚔️ emoji to create an event",
      field2title: "🧾 Guild Fee",
      field2value: "{{guildFee}}%",
      field3title: "💸 Seller Fee",
      field3value: "{{sellerFee}}%",
      field4title: "⌛ Bot Expiration:",
      field4value: "The Bot expires in: indefinite time",
      field5title: "🔊 Support",
      field5value: "To contact our support team, visit our [Official Discord](https://discord.gg/AjGZbc5b2s)",
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
  updateGuildFee: {
    noGuild: "Error updating fee, guild id does not exist",
    noFee: "Please enter a valid value",
    eventChannelNotFound: "Event channel not found for updating seller fee",
    eventChannelNotFound2: "Event channel not found for updating guild fee",
    embedNotFound: "Error: Unable to find the event creation embed",
    updateSuccess: "<@{{userId}}> updated the guild fee to {{guildFee}}%",
    updateError: "Error updating guild fee in the database",
  },
  updateSellerFee: {
    noGuild: "Error updating fee, guild id does not exist",
    noFee: "Please enter a valid value",
    eventChannelNotFound: "Event channel not found in the database",
    eventChannelNotFound2: "Event channel not found for updating seller fee",
    embedNotFound: "Error: Unable to find the event creation embed",
    updateSuccess: "<@{{userId}}> updated the seller fee to {{sellerFee}}%",
    updateError: "Error updating seller fee in the database",
  },
  guildDeposit: {
    invalidValue: "This field is blank. Please enter a number.",
    invalidValue2: "Invalid input. Please enter a valid number, e.g., 1,000,000.",
    updateDepositError: "Error processing the deposit.",
    updateDepositSuccess:
      "<@{{userId}}> made a deposit of `{{depositValue}}` to the guild. Current balance: `{{currentValue}}`.",
    successDeposit: "Deposit completed successfully! The balance is now: `{{currentValue}}`.",
    catchError: "There was an error processing the deposit. Please contact support.",
  },
  withdrawGuild: {
    invalidValue: "Field is blank, please enter a number",
    invalidValue2: "Invalid input. Please enter a valid number, example: 1,000,000",
    withdrawInsuficient:
      "<@{{userId}}> attempted to withdraw `{{withdrawValue}}` but the guild does not have enough balance!",
    withdrawInsuficientMessage: "The guild's balance is insufficient to complete the withdrawal",
    withdrawError: "Error processing the withdrawal",
    withdrawSuccess:
      "<@{{userId}}> withdrew `{{withdrawValue}}` from the guild's balance, current balance: `{{currentValue}}`",
    withdrawSuccessMessage: "Withdrawal completed successfully. The balance is now: `{{currentValue}}`",
    catchError: "Error processing the withdrawal, please contact support",
  },
  payMember: {
    invalidValue: "Field is blank. Please enter a number",
    invalidValue2: "Invalid input. Please enter a valid number, example: 1,000,000",
    insufficientGuildBalance:
      "<@{{interactionUserId}}> attempted to make a payment of `{{withdrawValue}}` to the player <@{{userId}}>, but the guild does not have enough balance!",
    insufficientGuildBalanceMessage: "The guild's balance is insufficient to complete the payment",
    insufficientUserBalance: "Payment amount exceeds the user's balance",
    erroPayMember: "Error attempting to make a payment to the player",
    successPayMember: "<@{{interactionUserId}}> made a payment of `{{withdrawValue}}` to the player <@{{userId}}>",
    successPayMemberMessage: "Payment to <@{{userId}}> of `{{withdrawValue}}` was successfully completed",
    catchError: "Error processing the payment, please contact support",
  },
  confiscateBalance: {
    userNotFound: "User not found in the database",
    confiscateBalanceError: "Error attempting to confiscate user balance",
    confiscateBalanceSuccess: "<@{{interactionUserId}}> confiscated the balance of player <@{{userId}}>",
    confiscateBalanceSuccessMessage: "The balance of player <@{{userId}}> was successfully confiscated",
    confiscateBalanceErrorMessage: "Error in the database while attempting to confiscate the player's balance",
  },
  updateLanguage: {
    updateError: "Error updating the language in the database, please contact support",
  },
  removeBot: {
    noGuild: "Unable to find the guild",
    embed: {
      title: "Rooms successfully removed",
      description:
        "The event bot has been successfully removed.\n All associated channels, roles, and events have been deleted. Thank you for using our services!\n Join our Discord server if you have any feedback or suggestions, feel free to share them with us.",
      footer: "See you soon!",
    },
    errorRemove: "Error removing the bot, please contact support",
  },
  simulateEvent: {
    noMessage: "Event channel messages have been deleted",
    noEmbed: "Event not found in the room",
    noGuildId: "Unable to fetch the guild ID",
    noGuild: "Guild not found in the database",
    emptyValue: "Field is blank, please enter a number",
    invalidValue: "Invalid input. Please enter a valid number, example: 1,000,000",
    errorUpdateEvent: "Error updating the value of {{eventName}}",
    embed: {
      title: "SALE SIMULATION OF {{eventName}}",
      seller: "Seller",
      valueTotal: "Total value",
      guildFee: "Guild fee",
      sellerFee: "Seller fee",
      participants: "Participants",
      distribuitedTotal: "Total to be distributed among participants with applied fees:",
      nextSteps: "Next step",
      nextStepsValue:
        "Use the command below to deposit the event value into the players' balance:\n```\n/deposit-event {{eventValue}}\n```",
      catchError: "Error simulating the event, please contact support",
    },
  },
  eventDeposit: {
    noFininishedEvent: "\n`This command can only be used for finished events`",
    noMessage: "Event channel messages have been deleted",
    noEmbed: "Event not found in the room",
    noFinancialChannel: "\n`Financial channel not configured for this guild`",
    noFinancialChannel2: "\n`Financial channel not found or invalid`",
    noValue: "Field is blank. Please enter a number",
    invalidValue: "Invalid input. Please enter a valid number, example: 1,000,000",
    embed: {
      title: "Deposit Confirmation",
      description:
        "<@{{userId}}> reported the total value of `{{depositValue}}` collected in **{{eventName}}**.\n\n Value to be distributed among participants **(with fees applied)**: `{{valueDistribuido}}`\n\n ✅ **Click the reaction below to confirm.**",
      successOrder: "Deposit request sent to the channel <#{{financeChannelId}}>.",
      catchError: "Error processing the deposit, please contact support",
    },
  },
  admin: {
    noGuild: "Guild data not found. Use /setup or contact support",
  },
  updateParticipation: {
    noMessage: "Event channel messages have been deleted",
    noEmbed: "Event not found in the room",
    errorUpdateParticipation: "Error updating the participation of user <@{{userId}}>",
    successUpdateParticipation:
      "<@{{interactionUserId}}> updated the participation of user <@{{userId}}> to {{updatedPercentage}}%",
    catchError: "Error updating the user's participation, please contact support",
  },
  balances: {
    userNotFound: "The guild does not have any balances to display yet",
    noBalances: "`No balances found`",
    embed: {
      title: "CURRENT PLAYER BALANCES",
      fieldName: "Name",
      fieldBalance: "Balance",
    },
    catchError: "Error fetching player balances, please contact support",
  },
  guildBalance: {
    guildNotFound: "Guild not found in the database",
    guildBalance: "The guild's balance is: `{{currentBalance}}`",
    catchError: "Error fetching the guild's balance, please contact support",
  },
  myBalance: {
    userNotFound: "<@{{userId}}> no data found for you in the database",
    memberBalance: "<@{{userId}}> your current balance is: `{{currentBalance}}`",
    catchError: "Error querying your balance in the database, please contact support",
  },
  transferBalance: {
    invalidValue: "Field is blank, please enter a number",
    invalidValue2: "Invalid input. Please enter a valid number, example: 1,000,000",
    senderNotFound: "Sender not found in the database",
    insufficientBalance: "Your balance is insufficient to complete the transfer",
    transferError: "Error attempting to process the transfer",
    transferSuccess: "Transfer of `{{value}}` silver successfully completed to player <@{{userId}}>",
    catchError: "Error processing the transfer, please contact support",
  },
  memberBalance: {
    userNotFound: "User not found in the database",
    balance: "The balance of <@{{userId}}> is: `{{currentBalance}}` silver",
    catchError: "Error querying the player's balance in the database, please contact support",
  },
  help: {
    title: "📜 Command List",
    description:
      "Here are all the commands available for the bot, organized for easy use.\n\n⚠️ **Attention:** Do not delete any room created by the bot! If this happens, reconfiguration will be required to avoid errors.\n\n",
    field1name: "\uD83D\uDCB0 Market Prices\n",
    field1value:
      "`/price` - Checks the price of an item in the market. (tier, city, and server are optional).\nEx: `/price greataxe`, or \n`/price greataxe [tier example: 4.3] [city] [server]`",
    field2name: "\u2728 Initial Setup for Balance Management",
    field2value:
      "`/lang` - Changes the bot's language.  **(Admin)**\n" +
      "`/setup` - Automatically configures the bot's rooms and permissions. **(Admin)**\n" +
      "`/my-balance` - Checks your current balance.\n" +
      "`/balances` - Shows the balance of all guild members.\n" +
      "`/member-balance` - Checks the balance of a specific member.\n" +
      "`/guild-balance` - Verifies the guild's balance.",
    field3name: "\uD83D\uDCB3 Financial Transactions",
    field3value:
      "`/deposit-guild` - Adds balance to the guild's treasury. **(Admin)**\n" +
      "`/withdraw-guild` - Withdraws balance from the guild's treasury. **(Admin)**\n" +
      "`/pay-member` - Sends a payment to a member using the guild's balance. **(Admin)**\n" +
      "`/confiscate-balance` - Removes a member's balance and adds it to the guild. **(Admin)**\n" +
      "`/transfer-balance` - Transfers balance from your account to another member.",
    field4name: "\uD83C\uDF1F Events and Participation",
    field4value:
      "`/seller` - Adds a seller to the event.\n" +
      "`/simulate-event` - Simulates the distribution of values among participants.\n" +
      "`/update-participation` - Modifies a player's participation percentage.\n" +
      "`/update-seller-fee` - Adjusts the fee paid to sellers. **(Admin)**\n" +
      "`/update-guild-fee` - Adjusts the fee paid to the guild. **(Admin)**\n" +
      "`/deposit-event` - Deposits the event funds into the participants' balances.",
    field5name: "\u2753 Help",
    field5value: "\n\nSupport: \n[Discord Albion Event Bot](https://discord.gg/AjGZbc5b2s)\n",
    footer: "Use the commands correctly to ensure the best experience!",
  },
  price: {
    noItem: "Please enter the name of an item",
    invalidTier: "Invalid tier. Use the correct format, example: `4.0`, `5.3`, `6.1`.",
    itemNotFound: "Item not found",
    itemNotFound2: "No data available for this item",
    qualities: {
      normal: "Normal",
      good: "Good",
      outstanding: "Outstanding",
      excellent: "Excellent",
      masterpiece: "Masterpiece",
    },
    embed: {
      sellOrders: "SELL Orders",
      city: "City (Quality)",
      price: "Price",
      lastUpdate: "Last update",
      buyOrders: "BUY Orders",
      footer: "\n\n❗ Make sure to type the item name in the same language as your Discord ❗\n\nNeed help? Use /help",
    },
    catchError: "Error retrieving data, please contact support",
  },
  deleteEvent: {
    canceledMessage: "<@{{userId}}> has canceled the event.",
  },
  finishedEvent: {
    finishedMessage: "Text channel created for {{channelName}} has been finalized",
    embed: {
      title: "{{eventTitle}} - Created by {{username}}",
      participants: "Players",
      seller: "Seller",
      sellerValue: "No seller",
      totalParticipants: "Total Players",
      duration: "Duration",
    },
    informationEmbed: {
      title: "What to do now?",
      sellerTitle: "Link a seller to manage the event",
      sellerValue: "\n\n`/seller @member`",
      simulateTitle: "To simulate the amount each participant will receive, use the command:",
      simulateValue: "\n`/simulate-event 1,000,000`",
      updateTitle:
        "Simulations can be done multiple times.\n\nTo adjust the participation of a specific member, use the command:\n",
      updateValue: "\n`/update-participation @member 100`",
    },
  },
  participateEvent: {
    messageChannel: "<@{{userId}}> you need to be in a voice channel to participate in an event",
    catchError: "Error adding participant {{userMention}} to the event",
  },
  startEvent: {
    embed: {
      title: "Event {{eventNumber}} Created by {{userName}} - Started",
    },
  },
  voiceUpdate: {
    noPlayer: "No Player",
  },
  openEvent: {
    notInChannel: "<@{{interactionUser}}> you need to be in a voice channel to start an event",
    embed: {
      title: "Event {{eventNumber}} Created by {{userName}} - Not Started",
      description: "Join the event by reacting with the 🚀 emoji (You must be in a Discord voice channel)",
      author: "Creator",
      totalPlayers: "Total Participants",
      participants: "Participants",
      instructionsTitle: "Steps for the Event Creator and Administrator",
      instructionsValue:
        "🏁-Start the Event (Begins tracking time and player participation)\n\n⏸End the Event (Ends and shows the percentage of player participation)\n\n🛑Cancel the Event (Deletes the event and its created channels - Only for non-started events)",
    },
    eventCreated: "Event {{eventNumber}} successfully created by player <@{{userId}}>",
    errorCreatedEvent: "Error creating the event",
    errorReply: "Error creating event",
  },
  index: {
    adminOnly: "Only an **Administrator** can use this command",
    noGuildInteraction: "Guild data not found. Use /setup or contact support",
    eventClosed: "Event already closed, commands can no longer be used",
    sellerOnly: "Only a Manager or Administrator can add a seller to the event",
    noSeller: "Please add a seller before using this command",
    noPermission: "This command can only be used by the assigned seller",
    onlyEventChannel: "This command can only be used in an event channel",
    commandCatchError: "An error occurred while processing the command",
    createEventErro: "Error while trying to create event",
    notProcessedReaction: "{{user}} reaction not processed because the original message was deleted",
    waitSendMessage: "{{user}} please wait 2 seconds before reacting again",
    eventUnidentified: "Could not identify the event",
    depositUnidentified: "Could not identify the deposit amount",
    eventNotFound: "Event not found",
    confirmedDepositEmbed: {
      title: "{{eventName}} Deposit Confirmed",
      description:
        "<@{{userId}}> confirmed a deposit of **{{totalValue}}** silver, amount already deposited into the participants' balance of **${eventName}**",
    },
  },
};

export default enUS;
