const initialState = {
    loading: true,
    unsupported: false,
    connected: false,
    networkId: null
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'SET_UNSUPPORTED':
            return Object.assign({}, state, { unsupported: true, loading: false })

        case 'SET_CONNECTED':
            return Object.assign({}, state, { connected: true, loading: false })

        case 'SET_DISCONNECTED':
            return Object.assign({}, state, { connected: false, loading: false })

        case 'SET_NETWORK_ID':
            return Object.assign({}, state, { networkId: action.networkId })

        default:
            return state
    }
}