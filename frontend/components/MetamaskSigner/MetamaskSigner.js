import React, { Component } from "react";
import Web3 from "web3";
import IPFS from "ipfs-mini";

class MetamaskSigner extends Component {
  constructor(props) {
    super(props);
    this.state = { account: null };
    this.signData = this.signData.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setTitle = this.setTitle.bind(this);

    this.ipfs = new IPFS({
      host: "ipfs.web3.party",
      port: 5001,
      protocol: "https"
    });
  }

  componentDidMount() {
    /*eslint-disable no-undef*/
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          web3.eth.getAccounts().then(a => {
            console.log(a);
            this.setState({ account: a[0] });
          });

          web3.currentProvider.publicConfigStore.on("update", res => {
            console.log("web3 updated..", res);
            this.setState({ account: res.selectedAddress });
          });

          // web3.eth.sendTransaction({/* ... */});
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.getAccounts().then(a => {
          console.log(a);
          this.setState({ account: a[0] });
        });

        web3.currentProvider.publicConfigStore.on("update", res => {
          console.log("web3 updated..", res);
          this.setState({ account: res.selectedAddress });
        });
      }
      // Non-dapp browsers...
      else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    });
    /*eslint-enable no-undef*/
  }

  signData() {
    const msgParams = [
      {
        type: "string",
        name: "Claimed Address",
        value: this.state.account
      },
      {
        type: "string",
        name: "Title",
        value: this.state.title
      },
      {
        type: "string",
        name: "Description",
        value: this.state.description
      }
    ];

    this.signMsg(msgParams, this.state.account).then(res => {
      const msg = {
        payload: msgParams,
        signature: res
      };

      this.ipfs.addJSON(msg, (err, result) => {
        console.log(err, result);
      });
    });
  }

  setDescription(e) {
    this.setState({ description: e.target.value });
  }

  setTitle(e) {
    this.setState({ title: e.target.value });
  }

  signMsg(msgParams, from) {
    /*eslint-disable no-undef*/
    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync(
        {
          method: "eth_signTypedData",
          params: [msgParams, from],
          from: from
        },
        function(err, result) {
          if (err) return console.error(err);
          if (result.error) {
            return console.error(result.error.message);
          }
          return resolve(result.result);
          //   const recovered = sigUtil.recoverTypedSignature({
          //     data: msgParams,
          //     sig: result.result
          //   })
          //   if (recovered === from ) {
          //     alert('Recovered signer: ' + from)
          //   } else {
          //     alert('Failed to verify signer, got: ' + result)
          //   }
        }
      );
    });
    /*eslint-enable no-undef*/
  }

  render() {
    return (
      <div>
        {this.state.account && (
          <div>
            <div>
              <span>Signer for {this.state.account}</span>
            </div>
            <div>
              <span>Title for this address</span>
              <input type="text" onChange={this.setTitle} />
            </div>
            <div>
              <span>Description for this address</span>
              <input type="text" onChange={this.setDescription} />
            </div>
            <div>
              <button onClick={this.signData} type="button">
                SIGN THAT
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MetamaskSigner;
