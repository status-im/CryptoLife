import React, { Component, PureComponent } from 'react';
import axios from 'axios';

export default class IPFSUploadWebGatewayWidget extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      msg: '',
      url: null,
	  uploadEndpoint: 'https://ipfs.dapplist-hackathon.curation.network',
    }
	this.onChange = this.onChange.bind(this);
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.onerror = event => reject(event.target.error);
      reader.onloadstart = event => this.setState({ msg: 'Reading...' });
      reader.readAsText(file);
    });
  }

  uploadIpfs(data) {
    return axios.post(this.state.uploadEndpoint + '/ipfs/', data);
  }

  onChange(event) {
    const { onChange } = this.props;
    const file = event.target.files[0];

    if (!file) {
      this.setState({ msg: null }, onChange(null));
    } else {
      this.readFile(file)
        .then(data => {
          this.data = data;
          this.setState({ msg: 'Uploading to IPFS...' });
          return this.uploadIpfs(data)
        })
        .then(resp => {
		  //this.inputRef.type="text";
		  this.setState({ipfs_hash: resp.headers['ipfs-hash']});
          let url = this.state.uploadEndpoint + resp.headers.location;
          this.setState({ msg: url }, onChange(this.state.ipfs_hash));
        });
    }
  };

  render() {

    return (
      <div>
        <p>
          <input
            ref={ ref => { this.inputRef = ref }}
            type="file"
            multiple={false}
            className={"form-control"}
            onChange={this.onChange}
          />
        </p>
        {this.state.url ? (<p>{this.state.url}</p>) : null}
        <p>{this.state.msg}</p>
      </div>
    );
  }
};

