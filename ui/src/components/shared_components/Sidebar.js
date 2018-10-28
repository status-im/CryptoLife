import React from 'react'
import {Link} from 'react-router-dom'

import {Icon} from 'rmwc/Icon';
import {
  Drawer,
  DrawerHeader,
  DrawerContent
} from 'rmwc/Drawer';

import {
  ListItem,
  ListItemText
} from 'rmwc/List';

import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle,
  ToolbarMenuIcon,
  ToolbarIcon
} from 'rmwc/Toolbar';

import logo from '../../images/logo.png';

export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      persistentOpen: true
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar(){
    this.setState({persistentOpen: !this.state.persistentOpen})
  }

  isItemSelected(url) {
    return window.location.pathname === url;
  }

  tokensPage() {
    return this.isItemSelected('/tokens') || this.isItemSelected('/issue-token')
  }

  companyPage() {
    return this.isItemSelected('/brands') || this.isItemSelected('/add-brand') || this.isItemSelected('/')
  }

  render() {
    return (
      <Drawer className="sidebar" persistent open={this.state.persistentOpen}>
        <DrawerContent className="padd-top-30">
           <Link to='/brands' className="undec">
              <ListItem className={"fl-cont fl-center-vert sidebar-item "+ (this.companyPage() ? 'selected-item' : '')}>
                  <div className="fl-wrap gx-icon ">
                      <Icon strategy="ligature" className="gray-icon">business</Icon>
                  </div>
                  <ListItemText className="fl-wrap padd-left-md">
                      Brands
                  </ListItemText>
              </ListItem>
          </Link>
          <Link to='/tokens' className="undec">
              <ListItem className={"fl-cont fl-center-vert sidebar-item "+ (this.tokensPage() ? 'selected-item' : '')}>
                  <div className="fl-wrap gx-icon ">
                      <Icon strategy="ligature" className="gray-icon">account_balance_wallet</Icon>
                  </div>
                  <ListItemText className="fl-wrap padd-left-md">
                      Tokens
                  </ListItemText>
              </ListItem>
          </Link>



        </DrawerContent>
      </Drawer>
    )
  }
}




