import {action, observable} from "mobx";

type Message = {
    message: string,
    author: string,
    id: number
}

export class MessagesStorage {

    @observable messages: Message[] = [];

    @action appendMessage = (message: Message) => {
        this.messages.push(message);
    };

    @action unshiftMessages = (messages: Message[]) => {
        this.messages.unshift(...messages);
    };

    @action updateMessage = (id: number, text: string) => {
        const message = this.messages.find(m => m.id === id);
        if(message){
            message.message = text;
        }
    };

    @action deleteMessage = (id: number) => {
        const removeIndex = this.messages.findIndex(m => m.id === id);
        this.messages.splice(removeIndex, 1);
    }

}