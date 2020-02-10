import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withLocalize } from "react-localize-redux";
import { Typography, Button } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  heroContent: {
    backgroundColor: '#fafafa',
  },
  heroText: {
    fontWeight: 400,
  },
  heroButtons: {
    marginTop: theme.spacing(4),
    width: '100%',
    whiteSpace: 'normal',
    margin: 'auto'
  },
  homeButtons: {
    width: '200px',
    display: 'inline-block',
    margin: '10px'
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

    return (
      <div id="home-outer-div">
          <div className={classes.heroContent} style={{fontFamily: 'Segoe UI'}}>
              <Typography  className={classes.heroText + " subtitle-text"} variant="h5" align="center" color="textSecondary" paragraph>
                {welcomeTo}
              </Typography>
              <Typography className={classes.heroText + " title-text"} variant="h2" component="h2" align="center" color="textPrimary" gutterBottom>
                {appTitle}
              </Typography>
              <Typography  className={classes.heroText + " subtitle-text"} variant="h5" align="center" color="textSecondary" paragraph>
                {appSubtitle}
              </Typography>
              <div className={classes.heroButtons}>

                <Link to={`/search`} className="navbar-link">
                  <Button variant="contained" color="primary" size="large" className={classes.homeButtons}>
                    <i className="fas fa-search"></i> {search}
                  </Button>
                </Link>

                <Link to={`/add-shul`} className="navbar-link">
                  <Button variant="outlined" color="primary" size="large" className={classes.homeButtons}>
                    <i className="fas fa-plus"></i> {addShul}
                  </Button>
                </Link>

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
