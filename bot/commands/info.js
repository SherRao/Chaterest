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
        const user = interaction.data.options[0];
        const channel = client.channels.cache.get(interaction.channel_id);
        const categories = main.firestore.collection('users').doc(user.id);

        let message = "";
        Object.keys(firebaseUser).forEach( (key) => {
            message += `${key} : ${firebaseUser[key]}\n`;

        } );

        channel.send(message);
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 4, data: {content: message} }

        });
    }

}