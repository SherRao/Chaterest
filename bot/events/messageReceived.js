//const firebase = require("../../backend/functions/index");

const { auth } = require("firebase-admin");
const main = require("../index");
const language = main.language;
const firestore = main.firestore;
const config = main.config;

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
            let category = await getCategory(message);

            if (category && category.categories) {
                const mainCategory = category.categories[0].name;
                let sentiment = await getSentiment(message);

                if (sentiment && sentiment.score > 0) {
                    console.log("Updating sentiment for user", author, "in category ", mainCategory)
                    const userDoc = await docRef.get();
                    const user = userDoc.data();
                    console.log(user)
                    const categorySentiment = user[mainCategory];
                    await docRef.set({
                        ...user,
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

async function getUser(uid) {
    const docRef = firestore.collection('users').doc(uid);
    const userDocument = await docRef.get();
    const user = userDocument.data();
    console.log("Retrieved user:", user)
    return user ? user : null;
}

async function getUserSentiment(uid, category) {
    const user = await getUser(uid);

    if (user[category]) {
        return user[category];
    }

    else return null;
}

/**
 * 
 * Looks at the channel the message was sent in and checks if the channel is the correct topic channel.
 * Takes a single category
 * Consider changing this so several messages in a row must be sent pertaining to the same 
 * topic before sending the "consider changing channels" message
 */
function suggestTopicChannel(message, category) {
    const categoryName = category.name;
    const channel = message.channel;
    const destinationChannel = config.CategoriesChannelMap[filterSubCategories(category)]

    if (channel.name != destinationChannel.name) {
        channel.send(destinationChannel.suggestionMessage)
    }
}

/**
 * maps subcategories to the larger category
 * example: /Computers & Electronics/Hardware/etc -> /Computers & Electronics
 * example: /Science/Computer Science -> /Science/Computer Science
 * if it is not a subcategory, returns itself
 * @param {*} category 
 * @returns a string that is the key to a CategoriesChannelMap
 */
function filterSubCategories(category) {
    const ChannelMap = config.CategoriesChannelMap;
    return Object.keys(ChannelMap).filter((name) => { return name.includes(category.name) })[0]
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