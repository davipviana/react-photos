import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './componentes/Login'
import * as serviceWorker from './serviceWorker';
import { Router, Route, browserHistory } from 'react-router';

import './css/reset.css';
import './css/timeline.css'
import './css/login.css'

function checkAuthentication(nextState, replace) {
    if(localStorage.getItem('auth-token') === null) {
        replace('/?message=você precisa estar logado para acessar o endereço');
    }
}

ReactDOM.render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={Login}/>
            <Route path="/timeline" component={App} onEnter={checkAuthentication}/>
        </Router>
    )
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
