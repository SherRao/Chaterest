//const firebase = require("../../backend/functions/index");

const main = require("../index");
const language = main.language;
const firestore = main.firestore;

// Mapping from google cloud category to channel and role in the discord server
let categoryData = {
    "Arts & Entertainment": {
        "channel": "movies",
        "role": "cinephile",

    },

    "tech": {
        "channel": "projects n tech help",
        "role": "techie",
    },
};

/**
 * Executes on message sent in the discord
 */
module.exports = {
    name: "message",
    once: false,
    execute: async (client, logger, message) => {
        try {
            const server = message.guild;
            const author = message.author.id;
            if (author.bot)
                return;

            const docRef = firestore.collection('users').doc(author);
            let sentiment = await getSentiment(message);
            let category = await getCategory(message);

            if (category && category.categories) {
                const mainCategory = category.categories[0].name;
                if (sentiment && sentiment.score > 0) {
                    console.log("Updating sentiment for user", author, "in category ", mainCategory)
                    const categorySentiment = await getUserSentiment(author, mainCategory);
                    console.log("Previous sentiment: ", categorySentiment)
                    await docRef.set({
                        [mainCategory]: categorySentiment ? categorySentiment + 1 : 1
                    });

                } else {
                    console.log("Not high enough sentiment", sentiment);
                }
            } else {
                console.log("No categories found for message: ", message)
            }
            
        } catch (error) {
            console.error(error);
        }

    },
}


/**
 * 
 * Looks at the message sent and updates the category for other functions to use.
 * 
 */
async function getCategory(message) {
    const document = {
        content: message.content,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [classification] = await language.classifyText({ document });
    console.log('Categories:');
    classification.categories.forEach(category => {
        console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
    });

    return classification
}

/**
 * 
 * Looks at the message sent and updates the sentiment for other functions to use.
 * 
 */
async function getSentiment(message) {
    const document = {
        content: message.content,
        type: 'PLAIN_TEXT',
    };

    const [result] = await language.analyzeSentiment({ document: document });
    const sentiment = result.documentSentiment;

    console.log(`Text: ${message}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

    return sentiment;
}

async function getUserSentiment(uid, category) {
    const docRef = firestore.collection('users').doc(uid);

    const userDocument = await docRef.get();
    const user = userDocument.data();
    console.log("Retrieved user:", user)

    if (user[category]) {
        return user[category];
    }

    else return null;
}

/**
 * 
 * Looks at the channel the message was sent in and checks if the channel is the correct topic channel.
 * 
 */
function suggestTopicChannel(message, category, sentiment) {


}

/**
 * 
 * Notifies discord users with the role associated with the category
 * 
 */
function notifyPassionateUsers(message, category, sentiment) {


}

/**
 * Set role based on user sentiment
 * on message, when sentiment exceeds threshold, automatically set role
 */

function setUserRoleForPassion() {

}