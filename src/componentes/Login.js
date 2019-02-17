import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { message: '' };
    }

    render = () => {
        return (
            <div className="login-box">
                <h1 className="header-logo">ReactPhotos</h1>
                <span>{this.state.message}</span>
                <form onSubmit={this.send}>
                    <input type="text" ref={input => this.login = input}/>
                    <input type="password" ref={input => this.password = input}/>
                    <input type="submit" value="login" />
                </form>
            </div>
        );
    }

    send = (event) => {
        event.preventDefault();
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ login: this.login.value, senha: this.password.value }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch('http://localhost:8080/api/public/login', requestInfo)
            .then(response => {
                if(response.ok)
                    return response.text();
                else
                    throw new Error('Não foi possível fazer login');
            })
            .then(token => {
                localStorage.setItem('auth-token', token);
                browserHistory.push('/timeline');
            })
            .catch(error => this.setState({ message: error.message }))
    }
}