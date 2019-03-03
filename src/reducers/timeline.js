import {List} from 'immutable';

function updatePhoto(photoList, photoId, getNewProperties) {
    const photo = photoList.find(photo => photo.id === photoId);
    
    const newProperties = getNewProperties(photo);

    const newPhoto = Object.assign({}, photo, newProperties);
    const index = photoList.findIndex(photo => photo.id === photoId);
    
    return photoList.set(index, newPhoto);
}

export function timeline(state = new List(), action) {
    if(action.type === 'LIST') {
        return new List(action.photos);
    }

    if(action.type === 'COMMENT') {
        const {photoId, newComment} = action;
        
        return updatePhoto(state, photoId, photo => {
            const newComments = photo.comentarios.concat(newComment);
            return {comentarios:newComments}
        })
    }

    if(action.type === 'LIKE') {
        const {photoId, liker} = action;

        return updatePhoto(state, photoId, photo => {
            const newLikeada = !photo.likeada;

            const possibleLiker = photo.likers.find(currentLiker => currentLiker.login === liker.login);
        
            let newLikers;
            if(possibleLiker === undefined)
                newLikers = photo.likers.concat(liker);
            else
                newLikers = photo.likers.filter(currentLiker => currentLiker.login !== liker.login);

            return {likers: newLikers, likeada: newLikeada}
        });
    }

    return state;
}