import React, {Component, Fragment} from 'react';
import style from "./message.module.css";

type Props = {
    message: string,
    editMessage: Function,
    deleteMessage: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    author: string,
    personal: boolean
}

type State = {
    edit: boolean,
    message: string
}

export class Message extends Component<Props, State> {

    state = {
        edit: false,
        message: ''
    };

    editMessage = () => {
        this.setState({edit: true, message: this.props.message});
    };

    cancelEdit = () => {
        this.setState({edit: false});
    };

    updateMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({message: e.target.value});
    };

    applyChanges = () => {
        this.props.editMessage(this.state.message);
        this.setState({edit: false});
    };

    render() {
        const {message, deleteMessage, author} = this.props;
        return (
            <Fragment>
                <div className={style.author + (this.props.personal ? ' ' + style.personal : '')}>{author}:</div>
                <div className={style.messageblock}>
                    <div>
                        {this.state.edit
                            ? <textarea className={style.textarea} value={this.state.message}
                                        onChange={this.updateMessage}/>
                            : message}
                    </div>
                    {this.props.personal &&
                    (<div className={style.chatOption}>
                        {
                            this.state.edit
                                ? (
                                    <Fragment>
                                        <div className={style.edit} onClick={this.applyChanges}>
                                            <i className="fas fa-check"/>
                                        </div>
                                        <div className={style.delete} onClick={this.cancelEdit}>
                                            <i className="fas fa-times"/>
                                        </div>
                                    </Fragment>
                                )
                                : (
                                    <Fragment>
                                        <div className={style.edit} onClick={this.editMessage}>
                                            <i className="fas fa-edit"/>
                                        </div>
                                        <div className={style.delete} onClick={deleteMessage}>
                                            <i className="fas fa-trash-alt"/>
                                        </div>
                                    </Fragment>
                                )
                        }
                    </div>)
                    }
                </div>
            </Fragment>)
    }
}