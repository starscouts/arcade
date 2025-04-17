const DiscordRPC = require('discord-rpc');

// Set this to your Client ID.
const clientId = '821064368535633920';

// Only needed if you want to use spectate, join, or ask to join
DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity() {
    if (!rpc) {
        return;
    }

    //const boops = await mainWindow.webContents.executeJavaScript('window.boops');

    // You'll need to have snek_large and snek_small assets uploaded to
    // https://discord.com/developers/applications/<application_id>/rich-presence/assets
    rpc.setActivity({
        details: win.ddetails,
        state: win.dstate,
        startTimestamp,
        largeImageKey: 'kartik',
        largeImageText: 'Kartik, ' + lang.game.credits.by + ' Minteck',
        smallImageKey: dimg,
        smallImageText: dchan,
        instance: false,
    });
}

rpc.on('ready', () => {
    // activity can only be set every 15 seconds
    setInterval(() => {
        setActivity();
    }, 15e3);
});

rpc.login({ clientId }).catch(console.error);