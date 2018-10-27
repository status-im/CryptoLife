const initialState = []

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case "SET":
			if (action.accounts) return action.accounts
			else return state

		default:
			return state
	}
}
