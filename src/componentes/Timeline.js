import React, { Component } from 'react';
import PhotoItem from './PhotoItem';

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
        this.timelineBusiness.subscribe(photos => {
            this.setState({photos});
        })
    }

    loadPhotos = (props) => {
        let url;
        
        if(props.login === undefined)
            url = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        else
            url = `http://localhost:8080/api/public/fotos/${props.login}`;

        this.timelineBusiness.loadPhotos(url);
    }
    
    likePhoto = (photoId) => {
        this.timelineBusiness.likePhoto(photoId);
    }

    commentPhoto = (photoId, comment) => {
        this.timelineBusiness.commentPhoto(photoId, comment);
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