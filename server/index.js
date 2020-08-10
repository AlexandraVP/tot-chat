const http = require('http');
const sockjs = require('sockjs');

const users = new Map();
const messages = new Map();

const sockets = new Set();

let i = 0;
function getId(){
    return ++i;
}

function broadcast(data) {
    [...sockets].forEach(conn => conn.write(data));
}

const chat = sockjs.createServer();
chat.on('connection', function(conn) {
    users.set(conn, 'Guest');
    sockets.add(conn);
    conn.on('close', () => {
        sockets.delete(conn);
    });
    conn.write(JSON.stringify({type: 'CHANNELS_DATA', channels: Object.fromEntries(messages)}));
    conn.on('data', function(socketMessage) {
        const data = JSON.parse(socketMessage);
        if(data.type === 'LOGIN'){
            users.set(conn, data.name);
        }else if(data.type === 'CHAT_MESSAGE') {
            const {channel, message} = data;
            const author = users.get(conn);
            const messageData = {channel, message, author, id: getId()};
            if(!messages.has(channel)){
                messages.set(channel, []);
            }
            messages.get(channel).push(messageData);
            broadcast(JSON.stringify({type: 'REAL_TIME_MESSAGE', data: messageData}));
        } else if(data.type === 'CHAT_MESSAGE_EDIT'){
            const {id, channel, message} = data.data;
            const channelMessages = messages.get(channel);
            const messageItem = channelMessages.find(d => d.id === id);
            messageItem.message = message;
            broadcast(JSON.stringify({type: 'CHAT_MESSAGE_EDIT', data: {id, channel, message}}));
        } else if(data.type === 'CHAT_MESSAGE_DELETE'){
            const {id, channel} = data.data;
            const channelMessages = messages.get(channel);
            const removeIndex = channelMessages.findIndex(d => d.id === id);
            channelMessages.splice(removeIndex, 1);
            broadcast(JSON.stringify({type: 'CHAT_MESSAGE_DELETE', data: {id, channel}}));
        }
    });
});

const server = http.createServer();
chat.installHandlers(server, {prefix:'/chat'});
server.listen(9999, '0.0.0.0');