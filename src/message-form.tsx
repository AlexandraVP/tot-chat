import React, {Component} from "react";
import style from './message-form.module.css';


type Props = {
    send: (text: string) => any
}

type State = {
    message: string
}

export class MessageForm extends Component<Props, State> {

    state = {
        message: ''
    };

    updateMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({message: e.target.value});
    };

    send = () => {
        this.props.send(this.state.message);
        this.setState({message: ''});
    };

    render(){
        return (
            <div className={style.footer}>
                <textarea className={style.textarea} value={this.state.message}
                          onChange={this.updateMessage}/>
                <div className={style.buttonsend} onClick={this.send}>Send</div>
            </div>
        )
    }
}