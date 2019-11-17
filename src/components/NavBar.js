import React, {Component} from 'react';
import { withStyles } from "@material-ui/core/styles"
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LanguageControls from './LanguageControls';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButtonEng: {
    marginRight: theme.spacing(2),
  },
  menuButtonHeb: {
    marginLeft: theme.spacing(2),
  },
  navButtonEng: {

  },
  navButtonHeb: {
    fontFamily: 'Segoe UI',
  },
  title: {
    flexGrow: 1,
  },
});

class NavBar extends Component {
  constructor(props) {
      super(props);
      this.state = {
        apiResponse: ""
      };
  }

  callAPI() {
    fetch(process.env.REACT_APP_EZNASHDB_API + "testAPI")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }))
          .catch((e) => {this.setState({ apiResponse: "API response not recieved: " + e})});
  }

  componentWillMount() {
      this.callAPI();
  }

  render() {
    const { classes } = this.props;
    const logIn = this.props.translate("logIn")
    var directionStyling = {
      direction: 'ltr',
      textAlign: 'left'
    }
    var menuButtonClassName = classes.menuButtonEng;
    var navButtonClassName = classes.navButtonEng;

    if (this.props.activeLanguage && this.props.activeLanguage.code === "he") {
      directionStyling = {
        direction: 'rtl',
        textAlign: 'right'
      }
      menuButtonClassName = classes.menuButtonHeb;
      navButtonClassName = classes.navButtonHeb;
    }

    return (
      <div className={classes.root}>
        <AppBar position="fixed" style={{direction: directionStyling.direction}}>
          <Toolbar>
            <IconButton edge="start" className={menuButtonClassName} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} style={{ textAlign: directionStyling.textAlign }}>
              <Translate id="appTitle" />
            </Typography>
            <LanguageControls />

            <Button color="inherit" className={navButtonClassName}>{logIn}</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(NavBar));
