import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, 
  Button } from '@material-ui/core';
import SingleResultTable from './SearchResultsTable';
const request = require("request");

const styles = theme => ({
  tableTextCell: {
    textAlign: "left",
  },
  roomTableCell: {
    textAlign: "left",
    verticalAlign: "top",
    paddingTop: '8px',
  },
  placementCell:{
    textAlign: "left",
    verticalAlign: "top",
    padding: "2px 0px 2px 16px !important"
  },
  centeredCell: {
    paddingRight: "16px !important",
    paddingLeft: "16px !important"
  }
});

class SearchResultsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuls: [],
      confirmDeleteIsOpen: false,
      shulToDelete: null,
    };

    this.closeConfirmDelete = this.closeConfirmDelete.bind(this);
    this.unmountShulToDelete = this.unmountShulToDelete.bind(this);
  }

  openConfirmDelete(shul){
    this.setState({
      shulToDelete: shul,
      confirmDeleteIsOpen: true
    })
  }

  closeConfirmDelete(){
    this.setState({
      confirmDeleteIsOpen: false
    })
  }

  unmountShulToDelete(){
    this.setState({
      shulToDelete: null,
    })
  }

  deleteShul(shul){
    if(shul){
      const options = {
        url: `${process.env.REACT_APP_EZNASHDB_API}shuls/destroy`,
        form: {
          id: shul.id,
        }
      };
  
      request.post(options, (err, res, body) => {
        this.props.afterDelete();
      })
    }
    this.closeConfirmDelete();
  }

  searchOnGoogleMaps(shul){
    var url = "https://www.google.com/maps/search/?api=1&query=";
    var searchParams = `${shul.name}`
    if(shul.city !== "N/A"){
      searchParams += `, ${shul.city}`
    }
    if(shul.region !== "N/A"){
      searchParams += `, ${shul.region}`
    }
    searchParams += `, ${shul.country}`
    var mapObj = { // replacing chracters for url
       " ":"+",
       ",":"%2C",
    };
    searchParams = searchParams.replace(/ |,/gi, function(matched){
      return mapObj[matched];
    });

    url += searchParams;
    window.open(url, '_blank');
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
      icon = <strong>XS</strong>
    } else if (num === 2){
      icon = <strong>S</strong>
    } else if (num === 3){
      icon = <strong>M</strong>
    } else if (num === 4){
      icon = <strong>L</strong>
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
          icon.push(<i key={i} className="fas fa-star"></i>)
        } else {
          icon.push(<i key={i} className="far fa-star"></i>)
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

    var cellContents = <Table size="small" aria-label="a dense table" className="search-results-placement-table">
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
    ;

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

  render() {
    const { classes } = this.props;

    const city = this.props.translate("city");
    const shulName = this.props.translate("shulName");
    const nussach = this.props.translate("nussach");
    const denomination = this.props.translate("denomination");
    const femaleLeadership = this.props.translate("femaleLeadership");
    const childcare = this.props.translate("childcare");
    const kaddish = this.props.translate("kaddish");
    const withMen = this.props.translate("withMen");
    const alone = this.props.translate("alone");
    const deleteTR = this.props.translate("delete");
    const editTR = this.props.translate("edit");
    const searchGoogleMaps = this.props.translate("searchGoogleMaps");
    const deleteThisShul = this.props.translate("deleteThisShul");
    const recordWillBeRemoved = this.props.translate("recordWillBeRemoved");
    const cancel = this.props.translate("cancel");
    
    return (
      <div>


            <Table stickyHeader={this.props.isStickyHeader} size="small" aria-label="a dense table" className="results-table">
              <TableHead>
                <TableRow>
                  {this.props.enableActions &&
                    <TableCell rowSpan={2} style={{width: '15px', minWidth: '15px'}}className="results-header-floor-cell"></TableCell>
                  }
                  <TableCell align="center" rowSpan={2} style={{width: '115px', minWidth: '115px', maxWidth: '115px'}} className={classes.tableTextCell + " results-header-floor-cell"}>{shulName}</TableCell>
                  <TableCell align="center" rowSpan={2} style={{width: '100px', minWidth: '100px'}} className={classes.tableTextCell + " results-header-floor-cell"}>{city}</TableCell>
                  <TableCell align="center" rowSpan={2} style={{width: '70px', minWidth: '70px'}} className={classes.tableTextCell + " results-header-floor-cell"}>{nussach}</TableCell>
                  <TableCell align="center" rowSpan={2} style={{width: '95px'}} className={classes.tableTextCell + " results-header-floor-cell"}>{denomination}</TableCell>
                  <TableCell align="center" rowSpan={2} className={classes.centeredCell + " results-header-floor-cell"} style={{width: '76px'}}>{femaleLeadership}</TableCell>
                  <TableCell align="center" colSpan={2} className={classes.centeredCell + " results-header-super-cell"}style={{width: '140px', padding: '2px 0 0 0'}}>{kaddish}</TableCell>
                  <TableCell align="center" rowSpan={2} className={classes.centeredCell + " results-header-floor-cell"} style={{width: '65px'}}>{childcare}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.centeredCell + " results-table-header-subcell results-header-floor-cell"} align="center" style={{width: '65px', whiteSpace: 'nowrap'}}>{withMen}</TableCell>
                  <TableCell className={classes.centeredCell + " results-table-header-subcell results-header-floor-cell"} align="center"  style={{width: '40px'}}>{alone}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.shuls && this.props.shuls.map((shul, key) => ([
                  <TableRow key={key} style={{background: "#d1edff"}}>
                    {this.props.enableActions &&
                      <TableCell align="center" rowSpan={2} className="shul-actions-cell">
                        <IconButton onClick={(e) => {this.searchOnGoogleMaps(shul)}}
                          classes={{
                            root: "shul-action-button-root"
                          }}
                          title={searchGoogleMaps}
                        >
                          <i className="fas fa-map-marker-alt shul-action-button-icon"></i>
                        </IconButton>
                        <IconButton onClick={(e) => {this.editShul(shul)}}
                          classes={{
                            root: "shul-action-button-root"
                          }}
                          title={editTR}
                          disabled={true}
                        >
                          <i className="fas fa-edit shul-action-button-icon"></i>
                        </IconButton>
                        <IconButton onClick={(e) => {this.openConfirmDelete(shul)}}
                          classes={{
                            root: "shul-action-button-root"
                          }}
                          title={deleteTR}
                        >
                          <i className="fas fa-trash shul-action-button-icon"></i>
                        </IconButton>
                      </TableCell>
                    }
                    <TableCell align="center" className={classes.tableTextCell}>{shul.name}</TableCell>
                    <TableCell align="center" className={classes.tableTextCell}>
                      {shul.city}, {shul.region}, {shul.country}
                    </TableCell>
                    <TableCell align="center" className={classes.tableTextCell}>{shul.nussach}</TableCell>
                    <TableCell align="center" className={classes.tableTextCell}>{shul.denom}</TableCell>
                    <TableCell align="center" className={classes.centeredCell}>{this.getIconsFromNumbers(shul.femLead)}</TableCell>
                    <TableCell align="center" className={classes.centeredCell}>{this.getIconsFromNumbers(shul.kaddishWithMen)}</TableCell>
                    <TableCell align="center" className={classes.centeredCell}>{this.getIconsFromNumbers(shul.kaddishAlone)}</TableCell>
                    <TableCell align="center" className={classes.centeredCell}>{this.getIconsFromNumbers(shul.childcare)}</TableCell>
                  </TableRow>,
                  <TableRow key={this.props.shuls.length + key} style={{background: "white"}}>
                    <TableCell align="center" colSpan={8} className="results-rooms-cell">{this.getRoomsTable(shul.rooms)}</TableCell>
                  </TableRow>
                ]))}
              </TableBody>
            </Table>

        {this.props.enableActions &&
          <Dialog
            open={this.state.confirmDeleteIsOpen}
            onClose={this.closeConfirmDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onExited={this.unmountShulToDelete}
            maxWidth={false}
          >
            <DialogTitle id="alert-dialog-title">{deleteThisShul}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {recordWillBeRemoved} <br /><br />
                <SingleResultTable 
                  shuls={[this.state.shulToDelete]}
                  afterDelete={() => {return false}}
                  enableActions={false}
                  isStickyHeader={false}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeConfirmDelete} color="primary">
                {cancel}
              </Button>
              <Button onClick={() => this.deleteShul(this.state.shulToDelete)} color="secondary">
                {deleteTR}
              </Button>
            </DialogActions>
          </Dialog>
        }


      </div>
    );
  }
}

SearchResultsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(SearchResultsTable));