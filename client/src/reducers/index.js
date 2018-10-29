import { combineReducers } from "redux"

import accounts from "./accounts"
import status from "./status"

export default combineReducers({
	accounts,
	status
})
