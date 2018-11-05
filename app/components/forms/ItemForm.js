import React from 'react';
import axios from 'axios';
import Form from "react-jsonschema-form";

import {Contract, web3} from '../../helpers/eth';

import IPFSUploadWebGatewayWidget from './IPFSUploadWebGateway.jsx'
const main_schema = require('../../../schema/main-spec-v0.1.0.json');
const uploadEndpoint = 'https://ipfs.dapplist-hackathon.curation.network';


let module_schemas = {};

// SKIP additional modules for hackathon
// module_schemas['contact'] = require('../../../schema/module-contact-spec-v0.1.0.json');
// module_schemas['ontology'] = require('../../../schema/module-ontology-spec-v0.1.0.json');
// module_schemas['standard'] = require('../../../schema/module-standard-spec-v0.1.0.json');


class ItemForm extends React.Component {
  
  render() {

	// MERGING SCHEMAS
	for (module in module_schemas) {
		for (let k in module_schemas[module]) {
			if (k == 'definitions') {
				for (let kk in module_schemas[module]['definitions']) {
					if (kk in main_schema['definitions']) {
						console.log("Error, key '" + k + "' already exists in main_schema.definitions");
						continue;
					}
					main_schema['definitions'][kk] = module_schemas[module]['definitions'][kk];
				}
				delete module_schemas[module]['definitions'];
			}
			main_schema['properties'][module] = module_schemas[module];
		}
	}

	let uploadedIPFSHash = null;

    const onSubmit = ({formData}) => {
		axios.post(uploadEndpoint + '/ipfs/', JSON.stringify(formData)).then(resp => {
			uploadedIPFSHash = resp.headers['ipfs-hash'];
			let bytesHash = '0x' + Buffer.from(uploadedIPFSHash).toString('hex');

			Contract('Registry').send('apply', [bytesHash])
				.then(res => {
					console.log(`tx hash: ${res}`);
				})
				.catch(console.error);
		});

	};

	const widgets = {
        ipfsUploadWidget: IPFSUploadWebGatewayWidget
    };

	let uiSchema = {
		"metadata": {
			"logo" : { "ui:widget": "ipfsUploadWidget" },
			"images": {
				"items": {
					"ui:widget": "ipfsUploadWidget"
				}
			}
		}
	};
	main_schema.properties.spec_version['default'] = '0.1.0';
	main_schema.properties.metadata.properties.name['default'] = 'Default Name';
	main_schema.properties.prev_meta['default'] = '';

    return (<div>
      <Form schema={main_schema} uiSchema={uiSchema} widgets={widgets} onSubmit={onSubmit} />
    </div>);
  }
}

export default ItemForm;
