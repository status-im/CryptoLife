import React from 'react'
import {Link} from 'react-router-dom'

import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableBody,
    DataTableHeadCell,
    DataTableRow,
    DataTableCell
} from '@rmwc/data-table';
import TokenInfo from "../pages/TokenInfo";

export default class Token extends React.Component {
    render() {

        console.log(this.props);

        return (
            <DataTableRow>
                <DataTableCell>
                    <Link to={"/token-info/"+this.props.info[4]}>
                        {this.props.info[0]}
                    </Link>
                </DataTableCell>
                <DataTableCell alignEnd>{this.props.info[1]}</DataTableCell>
                <DataTableCell alignEnd>{this.props.info[2]}</DataTableCell>
                <DataTableCell alignEnd>{this.props.info[4]}</DataTableCell>
            </DataTableRow>
        );
    }
}
