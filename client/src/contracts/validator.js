import { getWeb3 } from "./web3"
import validatorAbi from "./validator.json"
import config from "../config.json"

export default function () {
    let web3 = getWeb3()
    return new web3.eth.Contract(validatorAbi, config.VALIDATOR_CONTRACT_ADDRESS)
}
