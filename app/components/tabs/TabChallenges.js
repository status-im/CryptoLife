import React from 'react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import imgMock from '../blocks/0xuniverse.jpg';

class TabChallenges extends React.Component {
  render() {
    return (<>
      <TableRow type="header">
        <TableHeader type="submitted"/>
      </TableRow>
      {this.props.data.filter(item => item.isChallenged).map((item, idx) => {

        let actionType = item.challengeStatus.phase;

        return(
        <TableRow key={idx}>
          <CellDappName icon={imgMock} name={item.ipfsData.metadata.name}
                        desc={item.ipfsData.metadata.short_description}/>
          <CellDappStatus type="challenged" item={item}/>
          <CellActions type={actionType} item={item}/>
        </TableRow>);
      })}
    </>);
  }
}

export default TabChallenges;
