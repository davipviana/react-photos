export function timeline(state = [], action) {
    if(action.type === 'LIST') {
        return action.photos;
    }

    if(action.type === 'COMMENT') {
        const {photoId, newComment} = action;
        const photo = state.find(photo => photo.id === photoId);
        photo.comentarios.push(newComment);
        return state;
    }

    if(action.type === 'LIKE') {
        const {photoId, liker} = action;
        const photo = state.find(photo => photo.id === photoId);
        photo.likeada = !photo.likeada;

        const possibleLiker = photo.likers.find(currentLiker => currentLiker.login === liker.login);
        
        if(possibleLiker === undefined) {
            photo.likers.push(liker);
        } else {
            const newLikers = photo.likers.filter(currentLiker => currentLiker.login !== liker.login);
            photo.likers = newLikers;
        }
        return state;
    }

    return state;
}