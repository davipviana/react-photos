import React, { Component } from 'react';
import TimelineApi from '../repository/TimelineApi';

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {msg: ''};
    }

    componentDidMount = () => {
        this.props.store.subscribe(() => {
            this.setState({msg:this.props.store.getState().notification});
        });
    }

    search = (event) => {
        event.preventDefault();

        if(this.searchInput.value === "")
            return;

        this.props.store.dispatch(TimelineApi.search(this.searchInput.value));
    }

    render = () => {
    return (
        <div>
            <header className="header container">
                <h1 className="header-logo">ReactPhotos</h1>

                <form lpformnum="1" className="header-busca" onSubmit={this.search.bind(this)}>
                <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.searchInput = input}/>
                <input type="submit" value="Buscar" className="header-busca-submit" />
                </form>

                <nav>
                <ul className="header-nav">
                    <li className="header-nav-item">
                        <span>{this.state.msg}</span>
                    </li>
                </ul>
                </nav>
            </header>
        </div>
    );
  }
}