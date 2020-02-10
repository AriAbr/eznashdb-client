import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
const request = require("request");

const styles = theme => ({

});

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuls: [],
    };
  }



  getAllShuls(){
    request.get(`${process.env.REACT_APP_EZNASHDB_API}shuls/getAll`, (err, res, body) => {
      if(res && res.statusCode === 200){
        var shuls = JSON.parse(res.body)
        console.log(shuls)
        this.setState({
          shuls: shuls
        })
      } else {
        window.alert("server error. see console for more info")
        console.log(res)
      }
    });
  }

  deleteShul(shulId){
    const options = {
      url: `${process.env.REACT_APP_EZNASHDB_API}shuls/destroy`,
      form: {
        id: shulId,
      }
    };

    request.post(options, (err, res, body) => {
      this.getAllShuls()
    })
  }

  getIconsFromNumbers(num){
    var icon = num;

    if(num === 0){
      icon = <i className="fas fa-question"></i>;
    } else if (num === 1){
      icon = <i className="fas fa-check"></i>
    } else if (num === 2){
      icon = <i className="fas fa-times"></i>
    } else if (num === 3){
      icon = <i className="fas fa-star-of-life" style={{fontSize: "10px"}}></i>
    }
    
    return icon;
  }

  componentDidMount(){
    this.getAllShuls();
  }

  render() {
    const { classes } = this.props;

    const search = this.props.translate("search");
    const country = this.props.translate("country");
    const stateOrRegion = this.props.translate("stateOrRegion");
    const city = this.props.translate("city");
    const shulName = this.props.translate("shulName");
    const nussach = this.props.translate("nussach");
    const denomination = this.props.translate("denomination");
    const femaleLeadership = this.props.translate("femaleLeadership");
    const kaddishWithMen = this.props.translate("kaddishWithMen");
    const kaddishAlone = this.props.translate("kaddishAlone");
    const childcare = this.props.translate("childcare");

    return (
      <div>

          <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
            {search}
          </Typography>
          <table style={{margin: "auto"}} className="search-results-table">
            <thead>
            <tr>
              <th>

              </th>
              <th>
                {shulName}
              </th>
              <th>
                {nussach}
              </th>
              <th>
                {denomination}
              </th>
              <th>
                {country}
              </th>
              <th>
                {stateOrRegion}
              </th>
              <th>
                {city}
              </th>
              <th>
                {femaleLeadership}
              </th>
              <th>
                {kaddishWithMen}
              </th>
              <th>
                {kaddishAlone}
              </th>
              <th>
                {childcare}
              </th>
            </tr>
            </thead>
            <tbody>
              {this.state.shuls.map((shul, key) => {
                return <tr key={key}>
                    <td style={{padding: "0px"}}>
                      <IconButton onClick={(e) => {this.deleteShul(shul.id)}}
                        classes={{
                          root: "delete-shul-button-root"
                        }}
                      >
                        <i className="fas fa-trash delete-shul-button-icon"></i>
                      </IconButton>
                    </td>
                    <td>
                      {shul.name}
                    </td>
                    <td>
                      {shul.nussach}
                    </td>
                    <td>
                      {shul.denom}
                    </td>
                    <td>
                      {shul.country}
                    </td>
                    <td>
                      {shul.region}
                    </td>
                    <td>
                      {shul.city}
                    </td>
                    <td>
                      {this.getIconsFromNumbers(shul.femLead)}
                    </td>
                    <td>
                      {this.getIconsFromNumbers(shul.kaddishWithMen)}
                    </td>
                    <td>
                      {this.getIconsFromNumbers(shul.kaddishAlone)}
                    </td>
                    <td>
                      {this.getIconsFromNumbers(shul.childcare)}
                    </td>
                  </tr>
              })}
            </tbody>
          </table>

      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(Search));