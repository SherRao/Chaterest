const firebase = require("../../backend/functions/index");

module.exports = {

    name: "message",
    
    once: false,

    execute: (client, logger, message) => {
        let server = message.guild;
        let author = message.author.id;

        let text = message.content;
        let images = message.attachments
            .filter(message => message.name.endsWith(".png")) //Grabs all attachments of type PNG
            .map(message => message.url);                     //The URL for each image

        firebase.updateUserText(author.id, text);
        for(const image of images)
            firebase.updateUserImage(author.id, image);

    }

}