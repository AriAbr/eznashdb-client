import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from "react-localize-redux";
import { Container, Typography, Button, } from '@material-ui/core';
import logo from '../logo.svg';
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
    width: '100%',
    whiteSpace: 'nowrap',
    margin: 'auto'
  },
  homeButtonEng: {
    width: '180px',
    display: 'inline-block',
    margin: '0 10px'
  },
  homeButtonHeb: {
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
    var homeButtonClassName = classes.homeButtonEng;


    if (this.props.activeLanguage && this.props.activeLanguage.code === "he") {
      directionStyling = {
        direction: 'rtl',
        textAlign: 'right'
      }
      homeButtonClassName = classes.homeButtonHeb;
    }

    return (
      <div id="home-outer-div">
        <main>
          <div className={classes.heroContent} style={{direction: directionStyling.direction, fontFamily: 'Segoe UI'}}>
            <Container maxWidth="m">
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                {welcomeTo}
              </Typography>
              <Typography component="h1" variant="h1" align="center" color="textPrimary" gutterBottom>
                {appTitle}
              </Typography>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                {appSubtitle}
              </Typography>
              <div className={classes.heroButtons}>
                <Button variant="contained" color="primary" size="large" className={homeButtonClassName}>
                  <i class="fas fa-search"></i> {search}
                </Button>
                <Button variant="outlined" color="primary" size="large" className={homeButtonClassName}>
                  <i class="fas fa-plus"></i> {addShul}
                </Button>
              </div>
            </Container>
          </div>
        </main>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(Home));
