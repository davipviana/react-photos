import React, { Component } from 'react';
import {Link} from 'react-router';
import PubSub from 'pubsub-js';

class PhotoUpdates extends Component {

    constructor(props) {
        super(props);

        this.state = { liked: this.props.photo.likeada }
    }

    likePhoto = (event) => {
        event.preventDefault();

        this.setState({liked: !this.state.liked});
        this.props.likePhoto(this.props.photo.id);
    }

    commentPhoto = (event) => {
        event.preventDefault();
        
        this.props.commentPhoto(this.props.photo.id, this.commentInput.value);
        this.commentInput.value='';
    }

    render = () => {
        return (
            <section className="fotoAtualizacoes">
                <Link onClick={this.likePhoto.bind(this)} className={this.state.liked ? "fotoAtualizacoes-like-ativo" : "fotoAtualizacoes-like"}>Likar</Link>
                <form className="fotoAtualizacoes-form" onSubmit={this.commentPhoto.bind(this)}>
                    <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input=> this.commentInput = input}/>
                    <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
                </form>

            </section>
        );
    }
}

class PhotoInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {likers: this.props.photo.likers, comments: this.props.photo.comentarios};
    }

    componentWillMount = () => {
        PubSub.subscribe("update-liker", (topic, likerInfo) => {
            if(likerInfo.photoId === this.props.photo.id) {
                const liker = this.state.likers.find(liker => liker.login === likerInfo.liker.login);
                
                if(liker === undefined) {
                    const newLikers = this.state.likers.concat(likerInfo.liker);
                    this.setState({likers: newLikers});
                } else {
                    const newLikers = this.state.likers.filter(liker => liker.login !== likerInfo.liker.login);
                    this.setState({likers: newLikers});
                }
            }
        });

        PubSub.subscribe("new-comments", (topic, newCommentInfo) => {
            if(newCommentInfo.photoId === this.props.photo.id) {
                const newComments = this.state.comments.concat(newCommentInfo.newComment);
                this.setState({comments: newComments});
            }
        });
    }

    render = () => {
        return (
            
            <div className="foto-info">
                <div className="foto-info-likes">
                    {
                        this.state.likers.map(liker => {
                            return (<Link key={liker.login} to={`/timeline/${liker.login}`}>{liker.login}</Link>);
                        })
                    }
                    curtiram
                </div>

                <p className="foto-info-legenda">
                    <Link to={`/timeline/${this.props.photo.loginUsuario}`} className="foto-info-autor">autor </Link>
                    {this.props.photo.comentario}
                </p>

                <ul className="foto-info-comentarios">
                    {
                        this.state.comments.map(comment => {
                            return (
                                <li className="comentario" key={comment.id}>
                                <Link to={`/timeline/${comment.login}`} className="foto-info-autor">{comment.login}</Link>
                                    {comment.texto}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

class PhotoHeader extends Component {
    render = () => {
        return (
            <header className="foto-header">
                <figure className="foto-usuario">
                <img src={this.props.photo.urlPerfil} alt="foto do usuario" />
                <figcaption className="foto-usuario">
                    <Link to={`/timeline/${this.props.photo.loginUsuario}`}>
                    {this.props.photo.loginUsuario}
                    </Link>  
                </figcaption>
                </figure>
                <time className="foto-data">{this.props.photo.horario}</time>
            </header>
        );
    }
}

export default class PhotoItem extends Component {
    render = () => {
        return (
            <div className="foto">
                <PhotoHeader photo={this.props.photo}/>
                <img alt="foto" className="foto-src" src={this.props.photo.urlFoto} />
                <PhotoInfo photo={this.props.photo} />
                <PhotoUpdates photo={this.props.photo} likePhoto={this.props.likePhoto} commentPhoto={this.props.commentPhoto}/>
            </div>
        );
    }
}