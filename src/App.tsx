import React from 'react';
import {observer} from "mobx-react-lite";
import style from './App.module.css';
import {MessageForm} from "./message-form";
import {ChannelsStorage} from "./channels-storage";
import {Message} from "./message";
import {AuthModal} from "./auth-modal";
import {AuthStorage} from "./auth-storage";

const channelsStorage = new ChannelsStorage();
const authStorage = new AuthStorage();

function App() {
    return (
        <div className={style.root}>
            <AuthModal authorized={authStorage.authorized} login={authStorage.login}/>
            <div className={style.layout}>
                <div className={style.header}>
                    <div className={channelsStorage.activeChat === 'work' ? style.channelActive : style.channel}
                         onClick={() => channelsStorage.setActiveChannel('work')}>
                        Work
                    </div>
                    <div className={channelsStorage.activeChat === 'flood' ? style.channelActive : style.channel}
                         onClick={() => channelsStorage.setActiveChannel('flood')}>
                        Flood
                    </div>
                    <div className={style.settings} onClick={authStorage.logout}>
                        <div className={style.username}>
                            {authStorage.username}
                        </div>
                        <div className={style.logout}>
                            <i className="fas fa-sign-out-alt"/>
                        </div>
                    </div>
                </div>
                <div className={style.navbar}>
                </div>

                <div className={style.main}>
                    <div className={style.body}>
                        {channelsStorage.messages.map((({id, message, author}) => (
                            <Message key={id} message={message}
                                     author={author}
                                     personal={author === authStorage.username}
                                     editMessage={(text: string) => channelsStorage.editMessage(id, text)}
                                     deleteMessage={() => channelsStorage.deleteMessage(id)}/>
                        )))}
                    </div>
                </div>
                <MessageForm send={channelsStorage.sendMessage}/>
            </div>
        </div>
    );
}

export default observer(App);
