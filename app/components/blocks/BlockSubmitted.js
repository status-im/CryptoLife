import React from 'react';

import Block from './Block';
import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import imgMock from './0xuniverse.jpg';

class BlockSubmitted extends React.Component {
  render() {
    return (<Block name="Submitted dapps" icon="plus-square">
      <TableRow type="header">
        <TableHeader type="submitted"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="submitted" passedPercent={35}/>
        <CellActions type="challenge"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" stage="commit" passedPercent={64}/>
        <CellActions type="commit"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" stage="reveal" passedPercent={87}/>
        <CellActions type="reveal"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" stage="in-registry"/>
        <CellActions type="get-reward"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="challenged" stage="rejected"/>
        <CellActions type="loose"/>
      </TableRow>
    </Block>);
  }
}

export default BlockSubmitted;
