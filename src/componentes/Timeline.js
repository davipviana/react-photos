import React, { Component } from 'react';
import PhotoItem from './PhotoItem';
export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            photos: []
        };
    }

    loadPhotos = (props) => {
        let url;
        
        if(props.login === undefined)
            url = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        else
            url = `http://localhost:8080/api/public/fotos/${props.login}`;

        fetch(url)
            .then(response => response.json())
            .then(photos => this.setState({ photos: photos }))
    }

    componentDidMount = () => {
        this.loadPhotos(this.props);
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.login !== undefined) {
            this.loadPhotos(nextProps);
        }
    }
 
    render = () => {
        return (
            <div className="fotos container">
            {
                this.state.photos.map(photo => <PhotoItem photo={photo} key={photo.id}/>)
            }
            </div>
        );
    }
}