const firebase = require("../../backend/functions/index");

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
    execute: (client, logger, interaction) => {
        let user = firebase.getUserData(interaction.member.user.id);
        for(const category in user) {
            console.log(`Topic: ${category.name}, Sentiment: ${category.sentiment}, Amount: ${sentiment.messageCount}`);

        }

        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 4, data: {content: "Hello world!"} }

        });
    }

}