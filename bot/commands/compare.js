const main = require('../index');
const compareReport = require('../embeds/compareReport');

module.exports = {

    // Data object that includes all the JSON to post to the Discord command endpoint.
    "data": {
        "name": "compare",
        "description": "Compares categories between you and another user",
        "default_permission": true,

        "type": 1,
        "options": [
            {
                "name": "user",
                "description": "The user to compare against.",
                "type": 6,
                "required": true,

            }, 
        ],
    },

    execute: async (client, logger, interaction) => {
        try {
            const targetDiscordId = interaction.data.options[0].value;
            const sourceDiscordId = interaction.member.user.id;

            const targetDiscordUser = client.users.cache.get(targetDiscordId);
            const sourceDiscordUser = interaction.member.user;

            if(!targetDiscordUser.bot) {
                const targetUserCategories = await getUserCategories(targetDiscordId);
                const sourceUserCategories = await getUserCategories(sourceDiscordId);
                const intersectingCategories = intersection(targetUserCategories, sourceUserCategories);

                const targetName = targetDiscordUser.username;
                const sourceName = sourceDiscordUser.username;

                const targetAvatar = targetDiscordUser.displayAvatarURL({ format: "png" });
                let embed = compareReport;

                embed.embed.author.icon_url = client.user.displayAvatarURL({ format: "png" });
                embed.embed.title = "Chaterest Comparison -> " + targetName + " vs " + sourceName;
                embed.embed.description = `Below is the result of the comparison between both users!`;
                embed.embed.thumbnail = { url: targetAvatar };    
                embed.embed.fields = [
                    { name: `${targetName}:`, value: targetUserCategories.toString(), },
                    { name: `${sourceName}:`, value: sourceUserCategories.toString(), },
                    { name: `Categories in Common:`, value: intersectingCategories.toString(), },

                ],

                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: { type: 4, data: {
                        embeds: [embed.embed]
                    
                    } }
                });
        
        } else {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data: {content: "Cannot get information for a bot!"} }
            
            });
        }
     
        } catch(err) {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data: {content: `No information available for that user!`} }
            
            });
        }

    }
}

async function getUserCategories(uid) {
    const docRef = main.firestore.collection('users').doc(uid);
    const userDoc = await docRef.get();
    const user = userDoc.data();

    let result = [];
    if(user) {
        Object.keys(user).forEach( key => {
            result.push(key);

        } );
    }
    return result;
}

function intersection(a, b) {
    let result = a.filter(value => b.includes(value) );
    return result ? result : [];

}