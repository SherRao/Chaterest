const main = require('../index');
const profileEmbed = require('../embeds/profile');

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

    execute: async (client, logger, interaction) => {77
        const discordUserId = interaction.data.options[0].value;
        const discordUser = client.users.cache.get(discordUserId);
        const channel = client.channels.cache.get(interaction.channel_id);

        if(discordUser.bot || typeof(discordUser.bot) == "undefined") {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data: {content: "Cannot get information for a bot!"} }
            
            });

        } else {
            const docRef = main.firestore.collection('users').doc(discordUserId);
            const userDoc = await docRef.get()
            const user = userDoc.data();

            let fields = [];
            Object.keys(user).forEach( (key) => {
                fields.push({
                    name:`${key.substring(1)}`,
                    value: `${user[key]} (10% of total)`,
                    inline: true,

                } );

            } );

            let avatar = discordUser.displayAvatarURL({ format: "png" })

            let embed = profileEmbed;
            embed.embed.title = "Chaterest Profile -> " + discordUser.username;
            embed.embed.description = `This is all the information I could pull for ${discordUser.username}!`;
            embed.embed.fields = fields;
            embed.embed.thumbnail = { url: avatar };
            
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data: {
                    embeds: [embed.embed]
                
                } }
            });
    
        }
    }

}