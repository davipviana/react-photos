import {actionList, actionLike, actionComment} from '../actions/actionCreator';

export default class TimelineApi {
    static loadPhotos = (url) => {
        return dispatch => {
            fetch(url)
                .then(response => response.json())
                .then(photos => {
                    dispatch(actionList(photos));
                    return photos;
                })
        }
    }

    static likePhoto = (photoId) => {
        return dispatch => {
            fetch(`http://localhost:8080/api/fotos/${photoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    throw new Error('não foi possível realizar o like da foto');
                }
            })
            .then(liker => {
                dispatch(actionLike(photoId, liker));
                return liker;
            });
        }
    }

    static commentPhoto = (photoId, comment) => {
        return dispatch => {
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
                    dispatch(actionComment(photoId, newComment));
                    return newComment;
                });
        }
    }
}