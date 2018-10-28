import React from 'react'

import {Icon} from 'rmwc/Icon';
import Button from '../shared_components/BrandieButton';
import PageTitle from "../shared_components/PageTitle";
import {Link} from 'react-router-dom'
import BrandieJs from "../../../../brandie-js";

import Brand from '../page_components/Brand'


import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableBody,
    DataTableHeadCell,
    DataTableRow,
    DataTableCell
} from '@rmwc/data-table';


import ReactTable from "react-table";
import "react-table/react-table.css";

export default class Brands extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            brands: []
        };
    }

    componentWillReceiveProps() {
        if (!this.state.libInit && this.props.web3Connector) {
            this.setState({libInit: true});
            this.brandie = new BrandieJs(this.props.web3Connector.provider);
            this.initBrandsChecker();
        }
    }

    componentWillUnmount() {
        this.destroyBrandsChecker();
    }

    destroyBrandsChecker() {
        clearInterval(this.state.BrandsInfoTimer)
    }

    initBrandsChecker() {
        this.checkBrandsInfo();
        this.setState({
            BrandsInfoTimer: setInterval(() => {
                this.checkBrandsInfo()
            }, 6000),
        });
    }

    async checkBrandsInfo() {
        let accounts = await this.brandie.web3.eth.getAccounts();
        let companiesHashes = await this.brandie.platform.getCompaniesForAccount(accounts[0]);

        let companies = [];

        for (let companyHash of companiesHashes) {
            let company = await this.brandie.platform.getCompanyByNameHash(companyHash);
            companies.push(company);
        }
        this.setState({brands: companies});
    }

    render() {

        const brands = this.state.brands.map((brand, i) =>
                <Brand key={i} info={brand}/>
        );


        return (
            <div className="marg-30">
                <div className="fl-cont">
                    <div className='fl-col fl-grow fl-center-vert'>
                        <PageTitle
                            title="Brands"
                            // subtitle="Here you can review all past events for this account."
                            nopadd={true}
                        />
                    </div>
                    <div className='fl-col'>
                        <Link to='/add-brand' className="undec">
                            <Button size="md">
                                Add brand
                            </Button>
                        </Link>
                    </div>
                </div>


                <div className="new-card marg-bott-30 padd-sm marg-top-30" style={{padding: '5px'}}>
                    <DataTable style={{ width: '100%', border: 'none'}}>
                        <DataTableContent  style={{ width: '100%'}}>
                            <DataTableHead>
                                <DataTableRow>
                                    <DataTableHeadCell>Name</DataTableHeadCell>
                                    <DataTableHeadCell
                                        alignEnd
                                        sort={this.state.sortDir || null}
                                        onSortChange={sortDir => {
                                            this.setState({sortDir})
                                            console.log(sortDir)
                                        }}
                                    >
                                        Website
                                    </DataTableHeadCell>
                                    <DataTableHeadCell
                                        alignEnd
                                    >
                                        Active
                                    </DataTableHeadCell>
                                </DataTableRow>
                            </DataTableHead>
                            <DataTableBody>
                                {brands}
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                </div>
            </div>
        );
    }
}
