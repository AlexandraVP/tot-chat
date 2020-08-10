import SockJS from "sockjs-client";

const chat = new SockJS(`http://${window.location.hostname}:9999/chat`);

type Data = {
    channel: string,
    author: string,
    message: string
}

const subscribers = new Map<string,Function[]>();

chat.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if(data.type === 'CHANNELS_DATA'){
        for(const channel in data.channels){
            if(subscribers.has(channel)){
                //@ts-ignore
                subscribers.get(channel).forEach(handler => handler(data));
            }
        }
    }else if(data.type === 'REAL_TIME_MESSAGE' || data.type === 'CHAT_MESSAGE_EDIT' || data.type === 'CHAT_MESSAGE_DELETE'){
        if(subscribers.has(data.data.channel)){
            //@ts-ignore
            subscribers.get(data.data.channel).forEach(handler => handler(data));
        }
    }
};

export function subscribeChannel(channel: string, handler: Function){
    if(!subscribers.has(channel)){
        subscribers.set(channel, []);
    }
    //@ts-ignore
    subscribers.get(channel).push(handler);
}

export function login(name: string){
    chat.send(JSON.stringify({type: "LOGIN", name}))
}

export function sendMessage(channel: string, message: string){
    chat.send(JSON.stringify({type: "CHAT_MESSAGE",channel, message}));
}

export function editMessage(channel: string, id: number, message: string){
    chat.send(JSON.stringify({type: "CHAT_MESSAGE_EDIT", data: {channel, id, message}}))
}

export function deleteMessage(channel: string, id: number){
    chat.send(JSON.stringify({type: "CHAT_MESSAGE_DELETE", data: {channel, id}}))
}