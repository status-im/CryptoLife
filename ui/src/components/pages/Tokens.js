import React from 'react'

import {Icon} from 'rmwc/Icon';
import Button from '../shared_components/BrandieButton';
import PageTitle from "../shared_components/PageTitle";
import {Link} from 'react-router-dom'
import BrandieJs from "../../../../brandie-js";

import Token from '../page_components/Token'


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

export default class Tokens extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tokens: []
        };
    }

    componentWillReceiveProps() {
        if (!this.state.libInit && this.props.web3Connector) {
            this.setState({libInit: true});
            this.brandie = new BrandieJs(this.props.web3Connector.provider);
            this.initTokensChecker();
        }
    }

    componentWillUnmount() {
        this.destroyTokensChecker();
    }

    destroyTokensChecker() {
        clearInterval(this.state.TokensInfoTimer)
    }

    initTokensChecker() {
        this.checkTokensInfo();
        this.setState({
            TokensInfoTimer: setInterval(() => {
                this.checkTokensInfo()
            }, 6000),
        });
    }

    async checkTokensInfo() {
        let accounts = await this.brandie.web3.eth.getAccounts();
        let companiesHashes = await this.brandie.platform.getCompaniesForAccount(accounts[0]);

        let companies = [];

        for (let companyHash of companiesHashes) {
            let company = await this.brandie.platform.getCompanyByNameHash(companyHash);
            companies.push(company);
        }

        let tokens = [];
        for (let company of companies) {
            let tokenAddresses = await this.brandie.platform.getAddressesOfTokens(company.name, accounts[0]);
            console.log(tokenAddresses);
            company['tokens'] = [];
            for (let tokenAddr of tokenAddresses) {

                console.log(tokenAddr);

                let tokenInfo =  await this.brandie.platform.getTokenInformation(company.name, tokenAddr);
                tokenInfo[4] = tokenAddr;
                company['tokens'].push(tokenInfo);

                tokens.push(tokenInfo);
            }
        }

        console.log(tokens);
        console.log('==========');
        console.log(companies);
        this.setState({tokens: tokens, companies: companies});
    }

    render() {

        const tokens = this.state.tokens.map((token, i) =>
                <Token key={i} info={token}/>
        );


        return (
            <div className="marg-30">
                <div className="fl-cont">
                    <div className='fl-col fl-grow fl-center-vert'>
                        <PageTitle
                            title="Tokens"
                            nopadd={true}
                        />
                    </div>
                    <div className='fl-col'>
                        <Link to='/issue-token' className="undec">
                            <Button size="md">
                                Issue token
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
                                        Symbol
                                    </DataTableHeadCell>
                                    <DataTableHeadCell
                                        alignEnd
                                    >
                                        Supply
                                    </DataTableHeadCell>
                                     <DataTableHeadCell
                                        alignEnd
                                    >
                                        Address
                                    </DataTableHeadCell>
                                </DataTableRow>
                            </DataTableHead>
                            <DataTableBody>
                                {tokens}
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                </div>
            </div>
        );
    }
}
