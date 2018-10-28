import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'rmwc/Button';

import {Icon} from 'rmwc/Icon';
import {
    Toolbar,
    ToolbarRow,
    ToolbarSection,
    ToolbarTitle,
    ToolbarMenuIcon,
    ToolbarIcon
} from 'rmwc/Toolbar';

import logo from '../../images/logo.png';
import logoJpg from '../../images/logo.jpg';
import logoJpg1 from '../../images/logo1.jpg';


export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            walletConnector: {},
        };
    }

    componentWillReceiveProps(){
        if (this.props.walletConnector){
            this.setState({walletConnector: this.props.walletConnector})
        }
    }

    render() {
        return (
            <Toolbar className="brandie-header">
                <ToolbarRow>
                    <ToolbarSection alignStart>
                        <ToolbarTitle className="no-padd no-marg">
                            <Link to='/' className="undec">
                                <img src={logoJpg1} className="header-logo"/>
                            </Link>
                        </ToolbarTitle>
                    </ToolbarSection>
                    <ToolbarSection alignEnd>


                        <div className="fl-cont fl-center-vert">
                            <div className="fl-wrap gx-icon">
                                <Icon strategy="ligature" className="gray-icon">help</Icon>

                            </div>

                            <div className="fl-wrap marg-ri-10 marg-left-10">
                                {this.props.avatarData ? <img width={35} height={35} style={{borderRadius: "10px"}}
                                                              src={"data:image/png;base64," + this.props.avatarData}/> : null}
                            </div>
                        </div>


                    </ToolbarSection>
                </ToolbarRow>
            </Toolbar>
        );
    }
}
