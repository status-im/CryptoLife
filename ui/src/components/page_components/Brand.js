import React from 'react'

import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableBody,
    DataTableHeadCell,
    DataTableRow,
    DataTableCell
} from '@rmwc/data-table';

export default class Brand extends React.Component {
    render() {
        return (
            <DataTableRow>
                <DataTableCell>{this.props.info.name}</DataTableCell>
                <DataTableCell alignEnd>{this.props.info.website}</DataTableCell>
                <DataTableCell alignEnd>{this.props.info.active.toString()}</DataTableCell>
            </DataTableRow>
        );
    }
}
