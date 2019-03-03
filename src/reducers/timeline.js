export function timeline(state = [], action) {
    if(action.type === 'LIST') {
        return action.photos;
    }

    return state;
}