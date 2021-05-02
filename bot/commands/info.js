const main = require('../index');

module.exports = {

    "data": {
        "name": "info",
        "description": "Allows to check information about a user, such as toxicity, topics most interested in, etc...",
        "default_permission": true, 

        "type": 1,
        "options": [

            {
                "name": "user",
                "description": "The user who's data to check",
                "type": 6,
                "required": true,
            }, 
            
        ],
    },

    // Code executed when this slash command is used by a valid user.
    execute: async (client, logger, interaction) => {
        const discordUser = interaction.data.options[0];
        const channel = client.channels.cache.get(interaction.channel_id);
        console.log(discordUser);
        const docRef = main.firestore.collection('users').doc(discordUser.value);
        const userDoc = await docRef.get()
        const user = userDoc.data();
        console.log("user data:", user)

        let message = "";
        Object.keys(user).forEach( (key) => {
            message += `${key} : ${user[key]}\n`;
        } );

        channel.send(message);
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 4, data: {content: message} }
        });
    }

}