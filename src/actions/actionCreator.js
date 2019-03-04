export function actionList(photos) {
    return {type: 'LIST', photos};
}

export function actionLike(photoId, liker) {
    return {type: 'LIKE', photoId, liker};
}

export function actionComment(photoId, newComment) {
    return {type:'COMMENT', photoId, newComment};
}