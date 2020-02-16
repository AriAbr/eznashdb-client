import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import SearchResultsTable from './SearchResultsTable';
import LoadingOverlay from 'react-loading-overlay';

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
        <div className="search-results-container">
          <LoadingOverlay
            active={this.state.isLoadingResults}
            spinner
            text={null}
            style={{ }}
          >
            <SearchResultsTable 
              shuls={this.state.shuls}
              afterDelete={() => {this.getAllShuls()}}
              enableActions={true}
              isStickyHeader={true}
            />
          </LoadingOverlay>
        </div>
        
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(Search));