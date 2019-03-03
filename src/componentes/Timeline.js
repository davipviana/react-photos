import React, { Component } from 'react';
import PhotoItem from './PhotoItem';

import PubSub from 'pubsub-js';

import TimelineBusiness from '../business/TimelineBusiness';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            photos: []
        };
        this.timelineBusiness = new TimelineBusiness([]);
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
            .then(photos => {
                this.setState({ photos: photos })
                this.timelineBusiness = new TimelineBusiness(photos);
            })
    }
    
    likePhoto = (photoId) => {
        this.timelineBusiness.likePhoto(photoId);
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