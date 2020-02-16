import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import SearchResultsTable from './SearchResultsTable';
import LoadingOverlay from 'react-loading-overlay';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Marker, Popup, Map as LeafletMap, TileLayer } from 'react-leaflet';

const provider = new OpenStreetMapProvider();

const request = require("request");

const styles = theme => ({
  mainHeader: {

  },
});

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuls: [],
      isLoadingResults: false,
      latLons: [],
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

  onMarkerPopupLinkClick(){
    alert("clicked!")
  }

  async getLatLons(){ // used to be createMap()
    //get latLons
    const addressArr = [
      "Teaneck, New Jersey, US",
      "Jerusalem, Israel",
      "Aland",
    ]
    var latLons = [];
    for (let i = 0; i < addressArr.length; i++) {
      var currAddress = addressArr[i];
      const results = await provider.search({ query: currAddress });
      latLons.push(results)
    }
    this.setState({latLons: latLons}, () => {
      // //create map
      // this.map = L.map('mapid', {
      //   center: [19.973348786110613, 6.855468750000001],
      //   zoom: 2,
      //   layers: [
      //     L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      //       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      //     }),
      //   ],
      //   worldCopyJump: true,
      // });
      // // add markers
      // this.markers = [];
      // const fakeThis = this;
      // for(let i = 0; i < this.state.latLons.length; i++){
      //   const currLatLon = this.state.latLons[i]
      //   const position = [parseFloat(currLatLon[0].y), parseFloat(currLatLon[0].x)];
      //   const marker = L.marker(position).addTo(this.map).bindPopup(`<span onclick="() => {${fakeThis.onMarkerPopupLinkClick}}">A pretty CSS3 popup.<br />Easily customizable.</span>`);
      //   this.markers.push(marker)
      // }
    })
  }

  componentDidMount(){
    this.getAllShuls();
    this.getLatLons();
  }

  render() {
    const { classes } = this.props;

    const map = this.props.translate("map");

    const markers = this.state.latLons.map((latLon, key) => {
      const position = [parseFloat(latLon[0].y), parseFloat(latLon[0].x)]
      return  <Marker position={position} key={key} riseOnHover>
                <Popup onMouseEnter={() => {this.onMarkerPopupLinkClick()}}>
                  A pretty CSS3 popup.<br />Easily customizable. <br />
                  <a className="map-marker-popup-link" onClick={() => {this.onMarkerPopupLinkClick()}}>clickable</a>
                </Popup>
              </Marker>
    })
    const mapCenter = [22.917922936146045, 8.261718750000002]; // to re-calculate: call onMoveEnd on Map and log out e.target.getCenter()
    
    return (
      <div className="mapPage">

        <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
          {map}
        </Typography>

        <div id="mapid">

          <LeafletMap center={mapCenter} zoom={2} worldCopyJump={true}>
            {/* for more TileLayer options see https://leaflet-extras.github.io/leaflet-providers/preview/ */}
            <TileLayer
              url={`https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png`}
              attribution={`<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>`}
            />
            {markers}
          </LeafletMap>
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

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(Map));