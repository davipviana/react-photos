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

        PubSub.subscribe("update-liker", (topic, likerInfo) => {
            const photo = this.state.photos.find(photo => photo.id === likerInfo.photoId);
            photo.likeada = !photo.likeada;

            const liker = photo.likers.find(liker => liker.login === likerInfo.liker.login);
            
            if(liker === undefined) {
                photo.likers.push(likerInfo.liker);
            } else {
                const newLikers = photo.likers.filter(liker => liker.login !== likerInfo.liker.login);
                photo.likers = newLikers;
            }
            this.setState({photos: this.state.photos});
        });

        PubSub.subscribe("new-comments", (topic, newCommentInfo) => {
            const photo = this.state.photos.find(photo => photo.id === newCommentInfo.photoId);
            
            photo.comentarios.push(newCommentInfo.newComment);
            this.setState({photos: this.state.photos});
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

    commentPhoto = (photoId, comment) => {
        const requestInfo = {
            method: "POST",
            body: JSON.stringify({texto: comment}),
            headers: new Headers({
                'Content-type':'application/json'
            })
        };
        fetch(`http://localhost:8080/api/fotos/${photoId}/comment?X-AUTH-TOKEN=${localStorage.getItem("auth-token")}`, requestInfo)
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    throw new Error("não foi possível comentar");
                }
            })
            .then(newComment => {
                PubSub.publish('new-comments',{photoId, newComment});
            });
    }
 
    render = () => {
        return (
            <div className="fotos container">
            {
                this.state.photos.map(photo => <PhotoItem photo={photo} key={photo.id} likePhoto={this.likePhoto} commentPhoto={this.commentPhoto}/>)
            }
            </div>
        );
    }
}