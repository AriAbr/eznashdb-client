import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles"
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, ListItem, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import LanguageControls from './LanguageControls';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButtonEng: {
    marginLeft: theme.spacing(2),
  },
  menuButtonHeb: {
    marginRight: theme.spacing(2),
  },
  navButtonEng: {
    
  },
  navButtonHeb: {
    fontFamily: 'Segoe UI',
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: '200px'
  }
});

class NavBar extends Component {
  constructor(props) {
      super(props);
      this.state = {
        drawerIsOpen: false,
      };
  }

  toggleDrawer(e, side, open){
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }

    this.setState({ drawerIsOpen: open });
  }

  onDrawerSelection(){
    this.setState({
      drawerIsOpen: false,
    })
  }

  render() {
    const { classes } = this.props;
    const logIn = this.props.translate("logIn");
    const home = this.props.translate("home");

    var directionStyling = {
      direction: 'ltr',
      textAlign: 'left'
    }
    var menuButtonClassName = classes.menuButtonEng;
    var navButtonClassName = classes.navButtonEng;
    var drawerSide = 'right';

    if (this.props.activeLanguage && this.props.activeLanguage.code === "he") {
      directionStyling = {
        direction: 'rtl',
        textAlign: 'right'
      }
      menuButtonClassName = classes.menuButtonHeb;
      navButtonClassName = classes.navButtonHeb;
      drawerSide = 'left'
    }

    menuButtonClassName += " menu-button";

    return (
      <div className={classes.root}>
        <AppBar position="fixed" style={{direction: directionStyling.direction}}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} style={{ textAlign: directionStyling.textAlign }}>
              <Translate id="appTitle" />
            </Typography>

            <div className="navbar-controls">
              <LanguageControls />

              <Link to={`/`} className="navbar-link">
                <Button color="inherit" className={navButtonClassName}>{home}</Button>
              </Link>

              <Link to={`/api`} className="navbar-link">
                <Button color="inherit" className={navButtonClassName}>API</Button>
              </Link>

              <Button color="inherit" className={navButtonClassName}>{logIn}</Button>
            </div>

            <IconButton edge="start" className={menuButtonClassName} color="inherit" aria-label="menu"
              onClick={(e) => {this.toggleDrawer(e, 'right', true)}}
            >
              <MenuIcon />
            </IconButton>

          </Toolbar>
        </AppBar>

        <Drawer
          anchor={drawerSide}
          open={this.state.drawerIsOpen}
          variant='temporary'
          onClose={(e) => {this.toggleDrawer(e, 'right', false)}}
          style={{
            direction: directionStyling.direction,
          }}
          classes={{
            paper: classes.drawer,
          }}
        >

          <Link to={`/`} className={"drawer-link " + navButtonClassName + " drawer-link"} onClick={() => {this.onDrawerSelection()}}>
            <ListItem button>
              {home.toUpperCase()}
            </ListItem>
          </Link>
          <Link to={`/api`} className={"drawer-link " + navButtonClassName + " drawer-link"} onClick={() => {this.onDrawerSelection()}}>
            <ListItem button>
              API
            </ListItem>
          </Link>
          <ListItem button className={"drawer-link " + navButtonClassName + " drawer-link"} onClick={() => {this.onDrawerSelection()}} style={{color: '#757575'}}>
            {logIn.toUpperCase()}
          </ListItem>
          <Divider />
          <ListItem style={{display: 'block', textAlign: directionStyling.textAlign }}>
            <LanguageControls style={{margin: "auto", color: "black !important"}} parent='drawer' />
          </ListItem>

        </Drawer>

      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(NavBar));
