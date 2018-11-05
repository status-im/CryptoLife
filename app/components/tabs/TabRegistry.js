import React from 'react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import axios from 'axios';
const uploadEndpoint = 'https://ipfs.dapplist-hackathon.curation.network';
import imgMock from '../blocks/0xuniverse.jpg';

import { Contract, afterInit } from '../../helpers/eth';


class TabRegistry extends React.Component {

  render() {
		// let dapps_ids = contract.list();
		// let dapps = [];
		// for (let dapp_id in dapps_ids) {
		// 	let info = contract.get_info(dapp_id);
    //
		// 	dapps.push({
		// 		id: dapp_id,
		// 		state: info[0],
		// 		is_challenged: info[1],
		// 		can_be_updated: info[2],
		// 		current_ipfs_hash: info[3],
		// 		challenged_edit_ipfs_hash: info[4]
		// 	});
		// }

		console.log(this.props.data);

    return (<>
      <TableRow type="header">
        <TableHeader type="registry"/>
      </TableRow>
      {this.props.data.filter(item => item.state === 'EXISTS').map((item, idx) =>
        <TableRow key={idx}>
          <CellDappName icon={imgMock} name={item.ipfsData.metadata.name} desc={item.ipfsData.metadata.short_description}/>
          <CellDappStatus type="registry"/>
          <CellActions type="registry" item={item}/>
        </TableRow>
			)}
    </>);
  }
}

export default TabRegistry;
