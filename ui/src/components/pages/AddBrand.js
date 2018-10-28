import React from 'react'
import {withRouter} from 'react-router-dom';

import PageTitle from "../shared_components/PageTitle";
import CardTitle from "../shared_components/CardTitle";

import {Input, Container, Tooltip} from 'reactstrap';
import {Button} from 'rmwc/Button';

import BrandieJs from '../../../../brandie-js/index.js'

 class AddBrand extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            brandWebsite: '',
            brandName: ''
        };
        this.addBrand = this.addBrand.bind(this);
    }

    componentWillReceiveProps() {
        if (!this.state.libInit && this.props.web3Connector) {
            this.setState({libInit: true});
            this.brandie = new BrandieJs(this.props.web3Connector.provider)
        }
    }

    async addBrand() {
        let accounts = await this.brandie.web3.eth.getAccounts();
        this.brandie.platform.createCompany(this.state.brandName, this.state.brandWebsite, accounts[0]);
        this.props.history.push('/brands');
    }

    render() {
        return (
            <div className="marg-30">
                <div className="fl-cont">
                    <div className='fl-col fl-grow'>
                        <PageTitle
                            title="Add brand"
                            nopadd={true}
                        />
                    </div>
                </div>

                <div className="brandie-cadrd mardg-bott-30">
                    <div className="new-card marg-bott-30 padd-30 marg-top-30">
                        <CardTitle icon="settings" text="Set brand info"/>

                        <div className="card-content">
                            <div className="form-wrap" style={{maxWidth: "850px"}}>

                                <h6 className="fs-2 g-4 fw-4">Name</h6>
                                <div className="fl-col fl-grow">
                                    <Input className="new-input" id="brandName" type="text"
                                           placeholder="Enter brand name"
                                           onChange={(num) =>
                                               this.setState({brandName: num.target.value})}
                                           value={this.state.brandName}/>
                                    <br/>
                                </div>

                                <h6 className="fs-2 g-4 fw-4">Official Website</h6>
                                <div className="fl-col fl-grow">
                                    <Input className="new-input" id="brandWebsite" type="text"
                                           placeholder="Enter brand website URL"
                                           onChange={(num) =>
                                               this.setState({brandWebsite: num.target.value})}
                                           value={this.state.brandWebsite}/>
                                    <br/>
                                </div>

                                <Button raised onClick={this.addBrand}
                                        style={{borderRadiusd: '30px', marginTop: '10px'}}>Add brand</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AddBrand);

