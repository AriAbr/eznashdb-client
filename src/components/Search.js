import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { Typography, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, 
  Button } from '@material-ui/core';
import SearchResultsTable from './SearchResultsTable';

const request = require("request");

const styles = theme => ({
  mainHeader: {

  },
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuls: [],
      isLoadingResults: false,
    };
  }

  getAllShuls(){
    this.setState({isLoadingResults: true}, () => {
      request.get(`${process.env.REACT_APP_EZNASHDB_API}shuls/getAll`, (err, res, body) => {
        if(res && res.statusCode === 200){
          var shuls = JSON.parse(res.body)
          console.log(shuls)
          this.setState({
            shuls: shuls,
            isLoadingResults: false
          })
        } else {
          this.setState({
            isLoadingResults: false,
          }, () => {
            window.alert("server error. see console for more info")
            console.log(res)
          })
        }
      });
    })
  }

  componentDidMount(){
    this.getAllShuls();
  }

  render() {
    const { classes } = this.props;

    const search = this.props.translate("search");
    
    return (
      <div>
        <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
          {search}
        </Typography>

        <SearchResultsTable 
          shuls={this.state.shuls}
          afterDelete={() => {this.getAllShuls()}}
          enableActions={true}
          isLoadingResults={this.state.isLoadingResults}
        />
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(Search));