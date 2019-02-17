import React, { Component } from 'react';

export default class Header extends Component {

    render = () => {
    return (
        <div>
            <header className="header container">
                <h1 className="header-logo">ReactPhotos</h1>

                <form lpformnum="1" className="header-busca">
                <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo"/>
                <input type="submit" value="Buscar" className="header-busca-submit" />
                </form>

                <nav>
                <ul className="header-nav">
                    <li className="header-nav-item">
                    </li>
                </ul>
                </nav>
            </header>
        </div>
    );
  }
}