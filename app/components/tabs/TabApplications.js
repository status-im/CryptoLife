import React from 'react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import imgMock from '../blocks/0xuniverse.jpg';

class TabApplications extends React.Component {
  render() {

    console.log(this.props);

    return (<>
      <TableRow type="header">
        <TableHeader type="submitted"/>
      </TableRow>
      {this.props.data.filter(item => (item.state === 'APPLICATION' || item.state === 'EDIT')).map((item, idx) =>
        <TableRow key={idx}>
          <CellDappName icon={imgMock} name={item.ipfsData.metadata.name} desc={item.ipfsData.metadata.short_description}/>
          <CellDappStatus type="registry" item={item}/>
          <CellActions type="registry" item={item} subtype={item.state}/>
        </TableRow>
      )}
    </>);
  }
}

export default TabApplications;
