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

        const listaFixa = [{"urlPerfil":"https://instagram.fcgh9-1.fna.fbcdn.net/vp/960227fa1524bee9e36610f8da71889c/5B6F42E1/t51.2885-19/11199408_569104449895751_1837574990_a.jpg","loginUsuario":"alots","horario":"17/02/2019 11:01","urlFoto":"https://instagram.fcgh10-1.fna.fbcdn.net/t51.2885-15/e35/14482111_1635089460122802_8984023070045896704_n.jpg?ig_cache_key=MTM1MzEzNjM4NzAxMjIwODUyMw%3D%3D.2","id":1,"likeada":false,"likers":[],"comentarios":[],"comentario":"comentario da foto"},{"urlPerfil":"https://instagram.fcgh9-1.fna.fbcdn.net/vp/960227fa1524bee9e36610f8da71889c/5B6F42E1/t51.2885-19/11199408_569104449895751_1837574990_a.jpg","loginUsuario":"alots","horario":"17/02/2019 11:01","urlFoto":"https://instagram.fcgh9-1.fna.fbcdn.net/t51.2885-15/e35/15276770_381074615568085_8052939980646907904_n.jpg?ig_cache_key=MTM5ODY4MDMyNjYyMDA1MDE4OQ%3D%3D.2","id":2,"likeada":false,"likers":[],"comentarios":[],"comentario":"comentario da foto"}];

        this.props.store.dispatch({type:'LIST', photos:listaFixa});

        //this.props.store.loadPhotos(url);
    }
    
    likePhoto = (photoId) => {
        this.props.store.likePhoto(photoId);
    }

    commentPhoto = (photoId, comment) => {
        this.props.store.commentPhoto(photoId, comment);
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