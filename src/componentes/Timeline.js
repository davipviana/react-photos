import React, { Component } from 'react';
import PhotoItem from './PhotoItem';

import TimelineApi from '../repository/TimelineApi'

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
        this.props.store.subscribe(() => {
            this.setState({photos:this.props.store.getState()});
        })
    }

    loadPhotos = (props) => {
        let url;
        
        if(props.login === undefined)
            url = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        else
            url = `http://localhost:8080/api/public/fotos/${props.login}`;

        this.props.store.dispatch(TimelineApi.loadPhotos(url));
    }
    
    likePhoto = (photoId) => {
        this.props.store.dispatch(TimelineApi.likePhoto(photoId));
    }

    commentPhoto = (photoId, comment) => {
        this.props.store.dispatch(TimelineApi.commentPhoto(photoId, comment));
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