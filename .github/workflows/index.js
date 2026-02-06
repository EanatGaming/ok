const mineflayer = require('mineflayer');
const autoeat = require('mineflayer-auto-eat').plugin;
const express = require('express');
const config = require('./config.json');

const app = express();
app.get('/', (req, res) => res.send('Bot is Running!'));
app.listen(3000);

function createBot() {
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version
    });

    bot.loadPlugin(autoeat);

    bot.on('spawn', () => {
        console.log("✔ Bot Joined!");
        setInterval(() => {
            const actions = ['forward', 'back', 'left', 'right', 'jump'];
            bot.setControlState(actions[Math.floor(Math.random() * actions.length)], true);
            setTimeout(() => bot.clearControlStates(), 500);
            bot.look(bot.entity.yaw + 0.5, 0);
        }, config.movement_interval);
    });

    bot.on('end', () => setTimeout(createBot, config.reconnect_delay));
    bot.on('error', (err) => console.log(err));
}

createBot();