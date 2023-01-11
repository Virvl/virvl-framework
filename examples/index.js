const Discord = require('virvl');
const client = new Discord.Client({});

client.on('ready', () => {
    console.log(`Logged in to ${client.username}!`)
})

client.login('TOKEN');