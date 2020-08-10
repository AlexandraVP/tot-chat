import React, {Component} from 'react';
import style from './auth-modal.module.css';
import {login} from "./socket";

type Props = {
    login: (username: string) => any,
    authorized: boolean
}

type State = {
    username: string
}

export class AuthModal extends Component<Props, State> {

    state = {
        username: 'Guest'
    };

    updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({username: e.target.value});
    };

    login = () => {
        this.props.login(this.state.username);
        login(this.state.username);
    };

    render() {
        if(this.props.authorized){
            return null;
        }
        return (
            <div className={style.fade}>
                <div className={style.container}>
                    <div className={style.row}>
                        <input className={style.input} placeholder='Enter username'
                               value={this.state.username}
                               onChange={this.updateUsername}/>
                        <div className={style.login} onClick={this.login}>
                            <i className="fas fa-sign-in-alt"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}