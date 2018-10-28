import React from 'react'
import QRCode from 'react-qr-code';
import BrandieJs from "../../../../brandie-js";
import {withRouter} from "react-router-dom";

class TokenInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };

        this.generateKeyPair = this.generateKeyPair.bind(this);
    }

    componentWillReceiveProps() {
        if (!this.state.libInit && this.props.web3Connector) {
            this.setState({libInit: true});
            this.brandie = new BrandieJs(this.props.web3Connector.provider)
        }
    }

    generateKeyPair(){

        console.log(this.props);

         let account = this.brandie.web3.eth.accounts.create();
         let qrCodeData = account.privateKey;

    }

    render() {
         console.log(this.props);
        return (
            <div>
                <QRCode value={1} />
            </div>
        );
    }
}

export default withRouter(TokenInfo);
