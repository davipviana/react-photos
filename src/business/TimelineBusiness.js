import PubSub from 'pubsub-js';

export default class TimelineBusiness {
    constructor(photos) {
        this.photos = photos;
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
}