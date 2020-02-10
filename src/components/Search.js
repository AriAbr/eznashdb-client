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

  getSizeIcon(num){
    var icon = num;

    if(num === 0){
      icon = <i className="fas fa-question"></i>;
    } else if (num === 1){
      icon = "XS"
    } else if (num === 2){
      icon = "S"
    } else if (num === 3){
      icon = "M"
    } else if (num === 4){
      icon = "L"
    }    
    return icon;
  }

  getRoomsTable(roomsArr){
    const roomName = this.props.translate("roomName");
    const size = this.props.translate("size");
    
    return <table style={{margin: "auto"}} className="search-results-table">
    <thead>
    <tr style={{background: '#b5b5b5'}}>
      <th>
        {roomName}
      </th>
      <th>
        {size}
      </th>
    </tr>
    </thead>
    <tbody>
      {roomsArr.map((room, key) => {
        return <>
          <tr key={key}>
            <td>
              {room.name}
            </td>
            <td>
              {this.getSizeIcon(room.size)}
            </td>
          </tr>
        </>
      })}
    </tbody>
  </table>
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
    const kaddish = this.props.translate("kaddish");
    const withMen = this.props.translate("withMen");
    const alone = this.props.translate("alone");
    const rooms = this.props.translate("rooms");

    return (
      <div>

          <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
            {search}
          </Typography>
          <table style={{margin: "auto"}} className="search-results-table">
            <thead>
            <tr style={{background: '#b5b5b5'}}>
              <th rowSpan={2}>

              </th>
              <th rowSpan={2}>
                {shulName}
              </th>
              <th rowSpan={2}>
                {nussach}
              </th>
              <th rowSpan={2}>
                {denomination}
              </th>
              <th rowSpan={2}>
                {city}
              </th>
              <th rowSpan={2} style={{maxWidth: "100px"}}>
                {femaleLeadership}
              </th>
              <th colSpan={2}>
                {kaddish}
              </th>
              <th rowSpan={2}>
                {childcare}
              </th>
            </tr>
            <tr style={{background: "#c8c8c8"}}>
              <th style={{fontWeight: "normal"}}>
                {withMen}
              </th>
              <th style={{fontWeight: "normal"}}>
                {alone}
              </th>
            </tr>
            </thead>
            <tbody>
              {this.state.shuls.map((shul, key) => {
                return <>
                  <tr key={key}>
                    <td style={{padding: "0px"}} rowSpan={2}>
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
                      {shul.city}, {shul.region}, {shul.country}
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
                  <tr key={key*2}>
                    <td colSpan={8}>
                      {this.getRoomsTable(shul.rooms)}
                    </td>
                  </tr>
                </>
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