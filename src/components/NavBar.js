import React, {Component} from 'react';
import { withStyles } from "@material-ui/core/styles"
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
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

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} style={{ textAlign: "left" }}>
              The Ezrat Nashim Database
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
