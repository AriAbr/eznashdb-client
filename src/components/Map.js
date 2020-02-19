import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import SearchResultsTable from './SearchResultsTable';
import LoadingOverlay from 'react-loading-overlay';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Marker, Popup, Map as LeafletMap, TileLayer, LayersControl } from 'react-leaflet';
const ccs = require('countrycitystatejson')
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
      isLoadingMap: false,
      mapData: {}
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

    this.setState({ isLoadingMap: true}, async () => {
      request.get(`${process.env.REACT_APP_EZNASHDB_API}shuls/getMapData`, async (err, res, body) => {
        if(res && res.statusCode === 200){
          var mapData = JSON.parse(res.body)
          const locationNames = Object.keys(mapData);
          for(let i = 0 ; i < locationNames.length; i++){
            var currLocation = locationNames[i]
            const city = mapData[currLocation].city;
            const region = mapData[currLocation].region;
            const country = ccs.getCountryInfoByShort(mapData[currLocation].countryCode).name;
            var parsedLocationArr = [];
            if(city !== "N/A"){
              parsedLocationArr.push(city)
            }
            if(region !== "N/A" && country !== "Israel"){
              parsedLocationArr.push(region)
            }
            if(country !== "N/A"){
              parsedLocationArr.push(country)
            }
            var parsedLocation = parsedLocationArr.join(", ")
            var latLon = await provider.search({ query: parsedLocation });
            if(latLon.length === 0){ // if location not found, try removing region
              parsedLocationArr = [];
              if(city !== "N/A"){
                parsedLocationArr.push(city)
              }
              if(country !== "N/A"){
                parsedLocationArr.push(country)
              }
              parsedLocation = parsedLocationArr.join(", ")
              latLon = await provider.search({ query: parsedLocation });
            }
            mapData[currLocation].latLon = latLon
            console.log(mapData[currLocation].latLon)
          }
          this.setState({
            mapData: mapData,
            isLoadingMap: false
          }, () => {
            console.log(this.state.mapData)
          })
        } else {
          this.setState({
            isLoadingMap: false,
          }, () => {
            window.alert("server error. see console for more info")
            console.log(res)
          })
        }
      });
  
  
  
      // const addressArr = [
      //   "Teaneck, New Jersey, US",
      //   "Jerusalem, Israel",
      //   "Aland",
      // ]
      // var latLons = [];
      // for (let i = 0; i < addressArr.length; i++) {
      //   var currAddress = addressArr[i];
      //   const results = await provider.search({ query: currAddress });
      //   latLons.push(results)
      // }
      // this.setState({latLons: latLons}, () => {
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
      // })
    })

  }

  componentDidMount(){
    this.getAllShuls();
    this.getLatLons();
  }

  render() {
    const { classes } = this.props;

    const isHebrew = (this.props.activeLanguage && this.props.activeLanguage.code === "he");

    const map = this.props.translate("map");
    const markers = [];
    const locations = Object.keys(this.state.mapData);
    for(let i = 0; i < locations.length; i++){
      const key = i;
      const currlocation = locations[i]
      const latLon = this.state.mapData[currlocation].latLon;
      const position = [parseFloat(latLon[0].y), parseFloat(latLon[0].x)]
      const shulCountString = this.state.mapData[currlocation].shulCount === 1 ? `1 Shul` : `${this.state.mapData[currlocation].shulCount} Shuls`;
      const marker = <Marker position={position} key={key} riseOnHover>
                      <Popup onMouseEnter={() => {this.onMarkerPopupLinkClick()}}>
                        <strong>{currlocation}</strong> <br/>

                        {shulCountString} | <a className="map-marker-popup-link" onClick={() => {this.onMarkerPopupLinkClick()}}>clickable</a>
                      </Popup>
                    </Marker>
      markers.push(marker)
    }
    const mapCenter = [22.917922936146045, 8.261718750000002]; // to re-calculate: call onMoveEnd on Map and log out e.target.getCenter()
    
    return (
      <div className="mapPage">

        <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
          {map}
        </Typography>
        <div className="map-laoding-overlay-container">
          <LoadingOverlay
            active={this.state.isLoadingMap}
            spinner
            text={null}
            style={{ }}
          >
            <div id="mapid">
              <LeafletMap center={mapCenter} zoom={2} worldCopyJump={true} className={isHebrew ? "hebrew-map" : "english-map"}>
                {/* for more TileLayer options see https://leaflet-extras.github.io/leaflet-providers/preview/ */}
                <LayersControl position="topright">
                  <LayersControl.BaseLayer name="TomTom" checked>
                    <TileLayer
                      url={`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?view=Unified&key=${process.env.REACT_APP_TOMTOM_API}`}
                      attribution={`<a href="https://developer.tomtom.com/">TomTom</a>`}
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Wikimedia">
                    <TileLayer
                      attribution='<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
                      url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png"
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>
                {markers}
              </LeafletMap>
            </div>
          </LoadingOverlay>
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