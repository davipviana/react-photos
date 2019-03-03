import PubSub from 'pubsub-js';

export default class TimelineStore {
    constructor(photos) {
        this.photos = photos;
    }

    loadPhotos = (url) => {
        fetch(url)
            .then(response => response.json())
            .then(photos => {
                this.photos = photos;
                PubSub.publish('timeline', this.photos);
            })
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
                const photo = this.photos.find(photo => photo.id === photoId);
                photo.likeada = !photo.likeada;

                const possibleLiker = photo.likers.find(currentLiker => currentLiker.login === liker.login);
                
                if(possibleLiker === undefined) {
                    photo.likers.push(liker);
                } else {
                    const newLikers = photo.likers.filter(currentLiker => currentLiker.login !== liker.login);
                    photo.likers = newLikers;
                }
                PubSub.publish('timeline', this.photos);
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
                const photo = this.photos.find(photo => photo.id === photoId);
                photo.comentarios.push(newComment);
                PubSub.publish('timeline', this.photos);
            });
    }

    subscribe = (callback) => {
        PubSub.subscribe('timeline', (topic, photos) => {
            callback(photos);
        })
    }
}