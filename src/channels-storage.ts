import {action, computed, observable} from "mobx";
import {MessagesStorage} from "./messages-storage";
import {subscribeChannel, sendMessage, editMessage, deleteMessage} from "./socket";


type Message = {
    message: string,
    author: string,
    channel: string,
    id: number
}

type ChatType = 'work' | 'flood';

type ChannelAction = {
    type: 'CHANNELS_DATA',
    channels: {
        [key: string]: Message[]
    }
}

type MessageAction = {
    type: 'REAL_TIME_MESSAGE',
    data: Message
}

type MessageUpdate = {
    type: 'CHAT_MESSAGE_EDIT',
    data: {
        id: number,
        channel: string,
        message: string
    }
}

type MessageDelete = {
    type: 'CHAT_MESSAGE_DELETE',
    data: {
        id: number,
        channel: string
    }
}

export class ChannelsStorage {

    @observable activeChat: ChatType = 'work';

    private initialized = false;

    private messageStorages: {
        work: MessagesStorage,
        flood: MessagesStorage
    };

    constructor() {
        this.messageStorages = {
            work: new MessagesStorage(),
            flood: new MessagesStorage()
        };
        this.activeChat = 'work';
        subscribeChannel('work', this.onServerData);
        subscribeChannel('flood', this.onServerData);
    }

    @computed get messages() {
        return this.messageStorages[this.activeChat].messages;
    }

    @action setActiveChannel = (channel: ChatType) => {
        this.activeChat = channel;
    };

    private onServerData = (data: MessageAction | ChannelAction | MessageDelete | MessageUpdate) => {
        if(data.type === 'CHANNELS_DATA' && !this.initialized){
            this.initialized = true;
            this.messageStorages.work.unshiftMessages(data.channels.work || []);
            this.messageStorages.flood.unshiftMessages(data.channels.flood || []);
        }else if(data.type === 'REAL_TIME_MESSAGE') {
            if(data.data.channel === 'flood' || data.data.channel === 'work'){
                this.messageStorages[data.data.channel].appendMessage(data.data);
            }
        }else if(data.type === 'CHAT_MESSAGE_EDIT'){
            if(data.data.channel === 'flood' || data.data.channel === 'work'){
                this.messageStorages[data.data.channel].updateMessage(data.data.id, data.data.message);
            }
        }else if(data.type === 'CHAT_MESSAGE_DELETE'){
            if(data.data.channel === 'flood' || data.data.channel === 'work'){
                this.messageStorages[data.data.channel].deleteMessage(data.data.id);
            }
        }
    };

    sendMessage = (text: string) => {
        sendMessage(this.activeChat, text);
    };

    editMessage = (id: number, message: string) => {
        editMessage(this.activeChat, id, message);
    };

    deleteMessage = (id: number) => {
        deleteMessage(this.activeChat, id);
    }
}