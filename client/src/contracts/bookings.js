import { getInjectedWeb3 } from "./web3"
import bookingsAbi from "./bookings.json"
import config from "../config.json"

export default function () {
    let web3 = getInjectedWeb3()
    return new web3.eth.Contract(bookingsAbi, config.BOOKINGS_CONTRACT_ADDRESS)
}
