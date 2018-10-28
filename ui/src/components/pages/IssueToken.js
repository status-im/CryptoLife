import React from 'react'
import {withRouter} from 'react-router-dom';

import PageTitle from "../shared_components/PageTitle";
import CardTitle from "../shared_components/CardTitle";

import {Input, Container, Tooltip} from 'reactstrap';
import {Button} from 'rmwc/Button';

import BrandieJs from '../../../../brandie-js/index.js'

class IssueToken extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            companyName: '',
            tokenName: '',
            tokenSymbol: '',
            tokenSupply: '',
            tokenTime: ''
        };
        this.issueToken = this.issueToken.bind(this);
    }

    async componentWillReceiveProps() {
        if (!this.state.libInit && this.props.web3Connector) {
            this.brandie = new BrandieJs(this.props.web3Connector.provider);

            let accounts = await this.brandie.web3.eth.getAccounts();
            let companies = await this.brandie.platform.getCompaniesForAccount(accounts[0]);

            this.setState({libInit: true, companies: companies});
        }
    }

    async issueToken() {
        let accounts = await this.brandie.web3.eth.getAccounts();
        this.brandie.platform.issueToken(this.state.companyName, this.state.tokenName, this.state.tokenSymbol, this.state.tokenSupply, this.state.tokenTime, accounts[0]);
        this.props.history.push('/tokens');
    }

    render() {
        return (
            <div className="marg-30">
                <div className="fl-cont">
                    <div className='fl-col fl-grow'>
                        <PageTitle
                            title="Issue a token"
                            nopadd={true}
                        />
                    </div>
                </div>

                <div className="brandie-cadrd mardg-bott-30">
                    <div className="new-card marg-bott-30 padd-30 marg-top-30">
                        <CardTitle icon="settings" text="Configure your brand token"/>

                        <div className="card-content">
                            <div className="form-wrap" style={{maxWidth: "850px"}}>

                                <h6 className="fs-2 g-4 fw-4">Company</h6>
                                <div className="fl-col fl-grow">
                                    <Input className="new-input" id="companyName" type="text"
                                           placeholder="Enter company name"
                                           onChange={(num) =>
                                               this.setState({companyName: num.target.value})}
                                           value={this.state.companyName}/>
                                    <br/>
                                </div>

                                <h6 className="fs-2 g-4 fw-4">Token name</h6>
                                <div className="fl-col fl-grow">
                                    <Input className="new-input" id="tokenName" type="text"
                                           placeholder="Enter your token name here"
                                           onChange={(num) =>
                                               this.setState({tokenName: num.target.value})}
                                           value={this.state.tokenName}/>
                                    <br/>
                                </div>

                                <h6 className="fs-2 g-4 fw-4">Token symbol</h6>
                                <div className="fl-col fl-grow">
                                    <Input className="new-input" id="tokenSymbol" type="text"
                                           placeholder="Enter your token symbol here"
                                           onChange={(num) =>
                                               this.setState({tokenSymbol: num.target.value})}
                                           value={this.state.tokenSymbol}/>
                                    <br/>
                                </div>

                                <h6 className="fs-2 g-4 fw-4">Token supply</h6>
                                <div className="fl-col fl-grow">
                                    <Input className="new-input" id="tokenSupply" type="text"
                                           placeholder="Enter your token supply here"
                                           onChange={(num) =>
                                               this.setState({tokenSupply: num.target.value})}
                                           value={this.state.tokenSupply}/>
                                    <br/>
                                </div>

                                <h6 className="fs-2 g-4 fw-4">Token time</h6>
                                <div className="fl-col fl-grow">
                                    <Input className="new-input" id="tokenTime" type="text"
                                           placeholder="Enter your token time here"
                                           onChange={(num) =>
                                               this.setState({tokenTime: num.target.value})}
                                           value={this.state.tokenTime}/>
                                    <br/>
                                </div>


                                <Button raised onClick={this.issueToken}
                                        style={{borderRadiusd: '30px', marginTop: '10px'}}>Create token</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(IssueToken);
