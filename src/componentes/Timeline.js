import React, { Component } from 'react';
import PhotoItem from './PhotoItem';
export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            photos: []
        };
    }

    componentDidMount = () => {
        fetch("http://localhost:8080/api/public/fotos/rafael")
            .then(response => response.json())
            .then(photos => this.setState({ photos: photos }))
    }

    render = () => {
        return (
            <div className="fotos container">
            {
                this.state.photos.map(photo => <PhotoItem photo={photo}/>)
            }
            </div>
        );
    }
}