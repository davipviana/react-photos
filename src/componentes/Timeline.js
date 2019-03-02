import React, { Component } from 'react';
import PhotoItem from './PhotoItem';

import PubSub from 'pubsub-js';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            photos: []
        };
    }

    componentDidMount = () => {
        this.loadPhotos(this.props);
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.login !== undefined) {
            this.loadPhotos(nextProps);
        }
    }

    componentWillMount = () => {
        PubSub.subscribe('timeline', (topic, photos) => {
            this.setState({photos: photos});
        });
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
    
    likePhoto = (photoId) => {
        fetch(`http://localhost:8080/api/fotos/${photoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    throw new Error('não foi possível realizar o like da foto');
                }
            })
            .then(liker => {
                PubSub.publish("update-liker", {photoId, liker});
            });
    }
 
    render = () => {
        return (
            <div className="fotos container">
            {
                this.state.photos.map(photo => <PhotoItem photo={photo} key={photo.id} likePhoto={this.likePhoto}/>)
            }
            </div>
        );
    }
}