import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import SearchResultsTable from './SearchResultsTable';
import LoadingOverlay from 'react-loading-overlay';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Marker, Popup, Map as LeafletMap, TileLayer, LayersControl } from 'react-leaflet';
import * as israelCities from '../data/israel-cities';
const ccs = require('countrycitystatejson')
const provider = new OpenStreetMapProvider();

const request = require("request");

const styles = theme => ({
  markerPopopContents: {
    direction: 'ltr',
    textAlign: 'left'
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

  searchFromMarker(locationData){
    this.setState({ isLoadingResults: true }, () => {
      const options = {
        url: `${process.env.REACT_APP_EZNASHDB_API}shuls/searchByLocation`,
        form: {
          country: locationData.countryCode,
          region: locationData.region,
          city: locationData.city,
        }
      };
  
      request.post(options, (err, res, body) => {
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

  async getMapData(){ // used to be createMap()
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
          }
          this.setState({
            mapData: mapData,
            isLoadingMap: false
          }, () => {
            console.log("mapData state set:")
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
    })
  }

  componentDidMount(){
    // this.getAllShuls();
    this.getMapData();
  }

  getFullPlaceName(locationData){
    const isHebrew = (this.props.activeLanguage && this.props.activeLanguage.code === "he");
    if(isHebrew && locationData.countryCode === "IL"){
      const engCity = locationData.city;
      const cities = israelCities.default;
      var cityData = cities.find(city => {
        return city["english_name"] === engCity.toUpperCase();
      })
      const hebCity = cityData.name
      return `${hebCity}, ישראל`
    } else {
      const country = ccs.getCountryInfoByShort(locationData.countryCode).name;
      var parsedLocationArr = [];
      if(locationData.city !== "N/A"){
        parsedLocationArr.push(locationData.city)
      }
      if(locationData.region !== "N/A" && country !== "Israel"){
        parsedLocationArr.push(locationData.region)
      }
      parsedLocationArr.push(country)
      const locationStr = parsedLocationArr.join(", ")
      return locationStr;
    }
  }

  locationsToMarkers() {
    const shulTR = this.props.translate("shul");
    const shulsTR = this.props.translate("shuls");
    const searchTR = this.props.translate("search");
    const { classes } = this.props;
    
    let markers = []
    Object.entries(this.state.mapData).forEach(([locationName, locationData], index) => {
      try {
        const latLon = locationData.latLon;
        const position = [parseFloat(latLon[0].y), parseFloat(latLon[0].x)]
        const shulCountString = locationData.shulCount === 1 ? `1 ${shulTR}` : `${locationData.shulCount} ${shulsTR}`;
        const locationStr = this.getFullPlaceName(locationData)
        const marker = <Marker position={position} key={index} riseOnHover>
                        <Popup onMouseEnter={() => {this.onMarkerPopupLinkClick()}}>
                          <div className={classes.markerPopopContents}>
                            <strong>{locationStr}</strong> <br/>
                            {/* eslint-disable-next-line */}
                            {shulCountString} | <a className="map-marker-popup-link" onClick={() => {this.searchFromMarker(locationData)}}><i class="fas fa-search"></i> {searchTR}</a>
                          </div>
                        </Popup>
                      </Marker>
        markers.push(marker)
      } catch {
        console.log("Error creating marker for the following location: ")
        console.log(locationData)
      }
    })
    return markers
  }

  render() {
    const { classes } = this.props;

    const isHebrew = (this.props.activeLanguage && this.props.activeLanguage.code === "he");

    const map = this.props.translate("map");
    const markers = this.locationsToMarkers();

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