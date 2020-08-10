import {action, observable} from "mobx";
import {login} from "./socket";

export class AuthStorage {

    @observable username:string;
    @observable authorized:boolean;

    constructor() {
        this.username = localStorage.getItem('username') || 'Guest';
        this.authorized = localStorage.getItem('username') !== null;
    }

    @action login = (username: string) => {
        localStorage.setItem('username', username);
        login(username);
        this.authorized = true;
        this.username = username;
    };

    @action logout = () => {
        localStorage.removeItem('username');
        this.authorized = false;
        this.username = 'Guest';
        login('Guest');
    }
}