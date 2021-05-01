module.exports = {

    // Data object that includes all the JSON to post to the Discord command endpoint.
    "data": {
        "name": "info",
        "description": "",
        "default_permission": true,

        "permissions": [ 

            {
                "id": "ROLE_ID_1",
                "type": 1,
                "permission": true,
            },

            {
                "id": "ROLE_ID_1",
                "type": 1,
                "permission": true,
            }

        ],

        "type": 1,
        "options": [

            {
                "name": "world",
                "description": "Its world",
                "type": 1,
                "options": [],
            }, 

            {
                "name": "nausher",
                "description": "Its me",
                "type": 1,
                "options": [{
                    "name": "rao",
                    "description": "Its me x2.",
                    "type": 1,
                    "required": false,
                }],
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