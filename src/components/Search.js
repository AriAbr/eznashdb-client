import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from '@material-ui/core';
const request = require("request");

const styles = theme => ({
  tableTextCell: {
    textAlign: "left",
  },
  roomTableCell: {
    textAlign: "left",
    verticalAlign: "top"
  },
  placementCell:{
    textAlign: "left",
    verticalAlign: "top",
    padding: "5px 0px 5px 16px !important"
  }
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuls: [],
      isLoadingResults: false
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

  getVisAudIcon(num){
    var icon = [];

    if(num === 0){
      icon = <i className="fas fa-question"></i>;
    } else {
      for(let i = 0; i < 5; i++){
        if(i<num){
          icon.push(<i className="fas fa-star"></i>)
        } else {
          icon.push(<i className="far fa-star"></i>)
        }
      }
    }
    return icon;
  }
  getPlacementCell(room){
    const { classes } = this.props;

    const sameFloorTR = this.props.translate("sameFloorShort");
    const balconyTR = this.props.translate("balcony");
    const noWomSecTR = this.props.translate("noWomensSection");
    const centeredTR = this.props.translate("centeredMechitza");
    const sideTR = this.props.translate("side");
    const backTR = this.props.translate("back");
    const elevatedTR = this.props.translate("elevated");
    const notElevatedTR = this.props.translate("levelWithMens");
    const onlyMenTR = this.props.translate("onlyMens");
    const mixedSeatingTR = this.props.translate("mixedSeating");
    
    var sameFloor = [];
    var balcony = [];
    var noWomSec = [];

    if(room.isCentered){
      sameFloor.push(centeredTR)
    }
    if(room.isSameFloorSide){
      sameFloor.push(sideTR)
    }
    if(room.isSameFloorBack){
      sameFloor.push(backTR)
    }
    if(room.isSameFloorElevated){
      sameFloor.push(elevatedTR)
    }
    if(room.isSameFloorLevel){
      sameFloor.push(notElevatedTR)
    }

    if(room.isBalconySide){
      balcony.push(sideTR)
    }
    if(room.isBalconyBack){
      balcony.push(backTR)
    }

    if(room.isOnlyMen){
      noWomSec.push(onlyMenTR)
    }
    if(room.isMixedSeating){
      noWomSec.push(mixedSeatingTR)
    }

    var cellContents = <>

      <Table size="small" aria-label="a dense table" className="search-results-placement-table">
        <TableBody>
          {sameFloor.length > 0 && 
            <TableRow>
              <TableCell align="center" style={{width: '80px'}} className={classes.tableTextCell}>{sameFloorTR}</TableCell>
              <TableCell align="center" className={classes.tableTextCell}>{sameFloor.join(", ")}</TableCell>
            </TableRow>
          }
          {balcony.length > 0 && 
            <TableRow>
              <TableCell align="center" style={{width: '80px'}} className={classes.tableTextCell}>{balconyTR}</TableCell>
              <TableCell align="center" className={classes.tableTextCell}>{balcony.join(", ")}</TableCell>
            </TableRow>
          }
          {noWomSec.length > 0 && 
            <TableRow>
              <TableCell align="center" style={{width: '80px'}} className={classes.tableTextCell}>{noWomSecTR}</TableCell>
              <TableCell align="center" className={classes.tableTextCell}>{noWomSec.join(", ")}</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </>;

    return cellContents;
  }

  getRoomsTable(roomsArr){
    const { classes } = this.props;
    const roomName = this.props.translate("roomName");
    const size = this.props.translate("size");
    const visAud = this.props.translate("visAud");
    const placement = this.props.translate("placement");
    
    return <Table size="small" aria-label="a dense table" className="search-results-rooms-table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{whiteSpace: 'nowrap', width: '100px'}} className={classes.tableTextCell}>{roomName}</TableCell>
            <TableCell align="center" style={{maxWidth: '15px', width: '15px'}} className={classes.tableTextCell}>{size}</TableCell>
            <TableCell align="center" style={{width: '80px'}} className={classes.tableTextCell}>{visAud}</TableCell>
            <TableCell align="center" className={classes.tableTextCell}>{placement}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roomsArr.map((room, key) => (
            <TableRow key={key}>
              <TableCell align="center" className={classes.roomTableCell}>{room.name}</TableCell>
              <TableCell align="center" className={classes.roomTableCell}>{this.getSizeIcon(room.size)}</TableCell>
              <TableCell align="center" className={classes.roomTableCell}>{this.getVisAudIcon(room.visAudScore)}</TableCell>
              <TableCell align="center" className={classes.placementCell}>{this.getPlacementCell(room)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
        <div className="search-results-container">
          <LoadingOverlay
            active={this.state.isLoadingResults}
            spinner
            text={null}
            style={{ }}
          >
            <Table stickyHeader size="small" aria-label="a dense table" className="results-table">
              <TableHead>
                <TableRow style={{background: "#c0caff"}}>
                  <TableCell rowSpan={2} style={{width: '15px', minWidth: '15px'}}className="results-header-floor-cell"></TableCell>
                  <TableCell align="center" rowSpan={2} style={{width: '115px', minWidth: '115px', maxWidth: '115px'}} className={classes.tableTextCell + " results-header-floor-cell"}>{shulName}</TableCell>
                  <TableCell align="center" rowSpan={2} style={{width: '70px', minWidth: '70px'}} className={classes.tableTextCell + " results-header-floor-cell"}>{nussach}</TableCell>
                  <TableCell align="center" rowSpan={2} style={{width: '95px'}} className={classes.tableTextCell + " results-header-floor-cell"}>{denomination}</TableCell>
                  <TableCell align="center" rowSpan={2} style={{width: '100px', minWidth: '100px'}} className={classes.tableTextCell + " results-header-floor-cell"}>{city}</TableCell>
                  <TableCell align="center" rowSpan={2} className="results-header-floor-cell" style={{width: '60px'}}>{femaleLeadership}</TableCell>
                  <TableCell align="center" colSpan={2} className="results-header-super-cell">{kaddish}</TableCell>
                  <TableCell align="center" rowSpan={2} className="results-header-floor-cell" style={{width: '65px'}}>{childcare}</TableCell>
                </TableRow>
                <TableRow style={{background: "#c0caff"}}>
                  <TableCell className="results-table-header-subcell results-header-floor-cell" align="center" style={{width: '65px', whiteSpace: 'nowrap'}}>{withMen}</TableCell>
                  <TableCell className="results-table-header-subcell results-header-floor-cell" align="center"  style={{width: '40px'}}>{alone}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.shuls.map((shul, key) => (<>
                  <TableRow key={key} style={{background: "#dfe3f9"}}>
                    <TableCell align="center" rowSpan={2} style={{background: "white", maxWidth: '20px', width: '20px'}}>
                      <IconButton onClick={(e) => {this.deleteShul(shul.id)}}
                        classes={{
                          root: "delete-shul-button-root"
                        }}
                      >
                        <i className="fas fa-trash delete-shul-button-icon"></i>
                      </IconButton>
                    </TableCell>
                    <TableCell align="center" className={classes.tableTextCell}>{shul.name}</TableCell>
                    <TableCell align="center" className={classes.tableTextCell}>{shul.nussach}</TableCell>
                    <TableCell align="center" className={classes.tableTextCell}>{shul.denom}</TableCell>
                    <TableCell align="center" className={classes.tableTextCell}>
                      {shul.city}, {shul.region}, {shul.country}
                    </TableCell>
                    <TableCell align="center">{this.getIconsFromNumbers(shul.femLead)}</TableCell>
                    <TableCell align="center">{this.getIconsFromNumbers(shul.kaddishWithMen)}</TableCell>
                    <TableCell align="center">{this.getIconsFromNumbers(shul.kaddishAlone)}</TableCell>
                    <TableCell align="center">{this.getIconsFromNumbers(shul.childcare)}</TableCell>
                  </TableRow>
                  <TableRow key={key*2} style={{background: "white"}}>
                    <TableCell align="center" colSpan={8} className="results-rooms-cell">{this.getRoomsTable(shul.rooms)}</TableCell>
                  </TableRow>
                </>))}
              </TableBody>
            </Table>
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