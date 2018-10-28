import React from 'react';

import Block from '../tabs/BlockTabs';
import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import imgMock from './0xuniverse.jpg';

class BlockRegistry extends React.Component {
  render() {
    return (<Block name="Dapps in Registry" type="registry">
      <TableRow type="header">
        <TableHeader type="registry"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="registry"/>
        <CellActions type="registry"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="registry" challenges={['update']}/>
        <CellActions type="registry" challenges={['update']}/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="registry" challenges={['remove']}/>
        <CellActions type="registry" challenges={['remove']}/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="registry" challenges={['update', 'remove']}/>
        <CellActions type="registry" challenges={['update', 'remove']}/>
      </TableRow>
    </Block>);
  }
}

export default BlockRegistry;
