import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from "react-localize-redux";
import { Container, Typography, Button, } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
  },
  heroTextEng: {

  },
  heroTextHeb: {
    fontFamily: 'Segoe UI',
    fontWeight: 400
  },
  heroButtons: {
    marginTop: theme.spacing(4),
    width: '100%',
    whiteSpace: 'nowrap',
    margin: 'auto'
  },
  homeButtonsEng: {
    width: '180px',
    display: 'inline-block',
    margin: '0 10px'
  },
  homeButtonsHeb: {
    fontFamily: 'Segoe UI',
    width: '180px',
    display: 'inline-block',
    margin: '0 10px'
  },
});

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {
    const { classes } = this.props;
    const welcomeTo = this.props.translate("welcomeTo");
    const appTitle = this.props.translate("appTitle");
    const appSubtitle = this.props.translate("appSubtitle");
    const search = this.props.translate("search");
    const addShul = this.props.translate("addShul");

    var directionStyling = {
      direction: 'ltr',
      textAlign: 'left'
    }
    var homeButtonsClassName = classes.homeButtonsEng;
    var heroTextClassName = classes.heroTextEng;


    if (this.props.activeLanguage && this.props.activeLanguage.code === "he") {
      directionStyling = {
        direction: 'rtl',
        textAlign: 'right'
      }
      homeButtonsClassName = classes.homeButtonsHeb;
      heroTextClassName = classes.heroTextHeb;

    }

    return (
      <div id="home-outer-div">
          <div className={classes.heroContent} style={{direction: directionStyling.direction, fontFamily: 'Segoe UI'}}>
              <Typography  className={heroTextClassName} variant="h5" align="center" color="textSecondary" paragraph>
                {welcomeTo}
              </Typography>
              <Typography className={heroTextClassName} component="h1" variant="h1" align="center" color="textPrimary" gutterBottom>
                {appTitle}
              </Typography>
              <Typography  className={heroTextClassName} variant="h5" align="center" color="textSecondary" paragraph>
                {appSubtitle}
              </Typography>
              <div className={classes.heroButtons}>
                <Button variant="contained" color="primary" size="large" className={homeButtonsClassName}>
                  <i className="fas fa-search"></i> {search}
                </Button>
                <Button variant="outlined" color="primary" size="large" className={homeButtonsClassName}>
                  <i className="fas fa-plus"></i> {addShul}
                </Button>
              </div>
          </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(Home));
