import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchResultsTable from './SearchResultsTable';
import LoadingOverlay from 'react-loading-overlay';

const request = require("request");

const styles = theme => ({
  bigSearchButton: {
    marginLeft: '10px',
  }
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuls: [],
      isLoadingResults: false,
      filterPanelIsOpen: false
    };
  }

  toggleFilterPanel(){
    this.setState({
      filterPanelIsOpen: !this.state.filterPanelIsOpen
    })
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

    const isHebrew = this.props.activeLanguage && this.props.activeLanguage.code === "he";

    const search = this.props.translate("search");
    const setFilters = this.props.translate("setFilters");
    const closedPanelOffset = isHebrew ? '95px' : '117px'
    
    return (
      <div>
        <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
          {search}
        </Typography>
        <div className="search-parameters-parent">
          <ExpansionPanel
            style={{
              width: this.state.filterPanelIsOpen ? 'calc(100%)' : `calc(100% - ${closedPanelOffset})`,
              display: 'inline-block',
              transition: '.25s'
            }}
            expanded={this.state.filterPanelIsOpen}
            onChange={(e) => {this.toggleFilterPanel(e)}}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}><i className="fas fa-filter"></i>&nbsp;&nbsp;{setFilters}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <Button variant="contained" color="primary" size="small"><i className="fas fa-search"></i>&nbsp;{search}</Button>
              </div>

            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Button variant="contained" color="primary"
            style={{
              verticalAlign: 'top',
              height: '48px',
            }}
            classes={{
              root: classes.bigSearchButton
            }}
          ><i className="fas fa-search"></i>&nbsp;{search}</Button>
        </div>


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