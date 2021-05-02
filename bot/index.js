const fs = require('fs');
const config = require('./config.json');

const logger = require('js-logger');

// Imports for Discord
const discordAdmin = require('discord.js');
const discord = new discordAdmin.Client();

// Imports for Google Cloud NLP
const languageAdmin = require('@google-cloud/language');
const language = new languageAdmin.LanguageServiceClient();

// Imports for Google Firebase and Firestore
const firebaseAdmin = require('firebase-admin');
if (process.env._ENV != 'prod') {
    const firebaseToken = require('./keys/ruhacks-2021-312420-d51b97cbf0b9.json');
    firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(firebaseToken) });
} else {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault()
      });
      
}
const firestore = firebaseAdmin.firestore();

const http = require('http');

const port = process.env.PORT || 8080

const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
    res.writeHead(200, {'Content-Type': 'text/plain'});
    // Send the response body "Hello World"
    res.end('Just for testing purposes\n');
});

server.listen(port, () => {
  console.log(`Server listening on port `, port);
});


module.exports = {
    "config": config,
    "firestore": firestore,
    "language": language,
    "discord": discord,
    "discordAdmin": discordAdmin,
    "logger": logger,

}


let commands = [];
let events = [];
let tasks = [];

/**
 * 
 * Main function that handles all calls to other parts of the bot.
 * 
 * @author Nausher Rao
 * 
 */
function main() {
    discord.once('ready', () => {

        initLogger();
        setPresence();
        registerCommands();
        registerEvents();
        registerTasks();
        handleCommands();
        fixArraysFlat();
        
        logger.info("Bot loaded!");
    });

    if (process.env._DISCORD_TOKEN) {
        discord.login(process.env._DISCORD_TOKEN);

    } else {
        const discordToken = require('./keys/discord.json');
        discord.login(discordToken.token);
        
    }
} 


function initLogger() {
    logger.useDefaults({
        defaultLevel: logger.DEBUG,

        formatter: function (messages, context) {
            messages.unshift(`[${new Date().toUTCString()}] [${context.level.name}]: `)

        }
    });
}

/**
 * 
 * Sets the initial Discord bot user presence text. 
 * This should be changed to your liking.
 * 
 * @author Nausher Rao
 *
 */
function setPresence() {
    logger.info("Setting presence!");
    discord.user.setPresence({
        status: "dnd",
        activity: {
            name: "Loading bot...",
            type: "WATCHING",
            url: null
        },

        type: "WATCHING"
    });
}

/**
 * 
 * Load all command files from the "commands" folder, and POST them to the Discord 
 * command endpoint for the specific server.
 * 
 * @author Nausher Rao
 * 
 */
function registerCommands() {
    logger.info("Loading commands!");
    let files = fs.readdirSync('./commands')
        .filter(file => file.endsWith('.js') && file != 'example.js')

    for (const file of files) {
        const command = require(`./commands/${file}`);
        commands.push(command);
        discord.api.applications(discord.user.id).guilds(config.server).commands.post(command);

        logger.info(`Loaded command from file: commands/${file}`);
    }
}

/**
 * 
 * Load all event handler files from the "events" folder, and registers them 
 * with the Discord event manager.
 * 
 * @author Nausher Rao
 * 
 */
function registerEvents() {
    logger.info("Loading event handlers!");
    let files = fs.readdirSync('./events')
        .filter(file => file.endsWith('.js') && file != 'example.js');

    for (const file of files) {
        const event = require(`./events/${file}`);
        events.push(event);

        if (event.once)
            discord.once(event.name, (...args) => event.execute(discord, logger, ...args));

        else
            discord.on(event.name, (...args) => event.execute(discord, logger, ...args));

        logger.info(`Loaded event handler from file: events/${file}`);
    }
}

/**
 * 
 * Load all repeating task files from the "tasks" folder, and registers them 
 * with the JS Window DOM.
 * 
 * @author Nausher Rao
 * 
 */
function registerTasks() {
    logger.info("Loading tasks!");
    let files = fs.readdirSync('./tasks')
        .filter(file => file.endsWith('.js') && file != 'example.js');

    for (const file of files) {
        const task = require(`./tasks/${file}`);
        tasks.push(task);
        setInterval(task.execute, task.interval, discord, logger);

        logger.info(`Loaded task from file: tasks/${file}`);
    } 

}

/**
 * 
 * Code registered directly with the web socket to execute code 
 * when a slash command ("interaction") is recorded. 
 * 
 * @author Nausher Rao
 * 
 */
function handleCommands() {
    logger.info("Registering commands with the interaction create web socket!");
    discord.ws.on('INTERACTION_CREATE', async interaction => {
        const input = interaction.data.name.toLowerCase();
        for (const command of commands) {
            if (command.data.name.toLowerCase() == input) {
                logger.info("Processing command: " + command.data.name);
                command.execute(discord, logger, interaction);
                break;

            } else
                continue;

        }
    });
}

function fixArraysFlat() {
    Object.defineProperty(Array.prototype, 'flat', {
        value: function(depth = 1) {
          return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
          }, []);
        }
    });

}

main();
