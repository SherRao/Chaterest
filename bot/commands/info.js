module.exports = {

    // Data object that includes all the JSON to post to the Discord command endpoint.
    "data": {
        "name": "info",
        "description": "Henlo.",
        "default_permission": true, //By default, nobody has permission if set to false

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
        

        
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 4, data: {content: "Hello world!"} }

        });
    }

}