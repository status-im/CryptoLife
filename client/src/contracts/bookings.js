import { getInjectedWeb3 } from "./web3"
import bookingsAbi from "./bookings.json"
const CONTRACT_ADDRESS = "0x09661886579853756D2928438276479057f5AEA0"

export default function () {
    let web3 = getInjectedWeb3()
    return new web3.eth.Contract(bookingsAbi, CONTRACT_ADDRESS)
}
