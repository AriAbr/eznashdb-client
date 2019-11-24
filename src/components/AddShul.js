import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, Paper, Typography, Divider} from '@material-ui/core';
import * as israelCities from '../data/israel-cities';

const csc = require('countrycitystatejson')


const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: '20px',
  },
});

class AddShul extends Component {
  constructor(props) {
      super(props);
      this.state = {
        countries: [],
        selCountry: "",
        regions: [],
        selRegion: "",
        cities: [],
        selCity: "",
      };

    }

  handleCountrySelect(e){
    var countryCode = e.target.value;
    var regions = [];
    var adjustedCountryCode = countryCode;
    if(countryCode === "IL-HE"){
      adjustedCountryCode = "IL";
    }
    regions = this.getRegions(adjustedCountryCode);
    if(regions.length === 0){
      regions = [{
        "en": "N/A",
        "he": "N/A"
      }];
      this.setState({
        selCountry: countryCode,
        regions: regions,
      }, () => {
        var e = {target: { value: "N/A"}};
        this.handleRegionSelect(e);
      })
    } else {
      this.setState({
        selCountry: countryCode,
        regions: regions,
        selRegion: "",
        cities: [],
        selCity: "",
      })
    }
  }

  handleRegionSelect(e){
    var region = e.target.value;
    var countryCode = this.state.selCountry;
    if(countryCode === "IL-HE"){
      countryCode = "IL";
    }
    var cities = this.getCities(countryCode, region);
    if(cities.length === 0){
      cities = ["N/A"];
      this.setState({
        selRegion: region,
        cities: cities,
      }, () => {
        var e = {target: { value: "N/A"}};
        this.handleCitySelect(e);
      })
    } else {
      this.setState({
        selRegion: region,
        cities: cities,
      })
    }
  }

  handleCitySelect(e){
    var city = e.target.value;
    this.setState({
      selCity: city,
    })
  }

  getRegions(countryCode){
    if(countryCode === "IL") {
      return this.getIsraelRegions();
    } else {
      return this.getGeneralRegions(countryCode);
    }
  }

  getGeneralRegions(countryCode){ // reformatting general regions to match Israel regions
    var regions = csc.getStatesByShort(countryCode).sort();
    var formattedRegions = [];
    for (let i = 0; i < regions.length; i++){
      var regionName = regions[i]
      var regionObj = {
        "en": regionName,
        "he": regionName
      }
      formattedRegions.push(regionObj)
    }
    return formattedRegions;
  }

  getIsraelRegions(){
    var cities = israelCities.default;
    var lishkaot = [];
    for(let i = 0; i < cities.length; i++){
      var currCity = cities[i];
      var currLishka = {
        "en": currCity["lishka_en"],
        "he": currCity["lishka_he"]
      };
      const lishkaIndex = lishkaot.map(lishka => lishka["en"]).indexOf(currCity["lishka_en"]);
      if(lishkaIndex === -1){
        lishkaot.push(currLishka);
      }
    }
    return lishkaot;
  }

  getCities(countryCode, region){
    var cities = [];
    if(countryCode === "IL"){
      cities = this.getIsraelCities(region);
    } else {
      cities = this.getGeneralCities(countryCode, region);
    }
    return cities;
  }

  getIsraelCities(region){ // reformatting general cities to match Israel cities
    var allCities = israelCities.default;
    var regionCities = [];
    for(let i = 0; i < allCities.length; i++){
      var currCity = allCities[i];
      var cityRegion = currCity["lishka_en"]
      if(cityRegion === region){
        var cityData = {
          "en": currCity["english_name"],
          "he": currCity["name"]
        };
        regionCities.push(cityData);
      }
    }
    return regionCities;
  }

  getGeneralCities(countryCode, region){
    var cities = csc.getCities(countryCode, region);
    var formattedCities = [];
    for (let i = 0; i < cities.length; i++){
      var cityName = cities[i]
      var cityObj = {
        "en": cityName,
        "he": cityName
      }
      formattedCities.push(cityObj)
    }
    return formattedCities;
  }

  componentDidMount(){
    this.getIsraelRegions();
    var countries = csc.getCountries();
    var sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));
    this.setState({
      countries: sortedCountries
    })
  }

  componentDidUpdate(){
    if(this.state.selCountry === "IL" && this.props.activeLanguage && this.props.activeLanguage.code === "he"){
      this.setState({
        selCountry: "IL-HE"
      })
    } else if (this.state.selCountry === "IL-HE" && this.props.activeLanguage && this.props.activeLanguage.code === "en"){
      this.setState({
        selCountry: "IL"
      })
    }
  }

  render() {
    const { classes } = this.props;

    const addShul = this.props.translate("addShul");
    const country = this.props.translate("country");
    const stateOrRegion = this.props.translate("stateOrRegion");
    const city = this.props.translate("city");
    const selectCity = this.props.translate("selectCity");

    const isHebrew = (this.props.activeLanguage && this.props.activeLanguage.code === "he");

    var directionStyling = {
      direction: 'ltr',
      textAlign: 'left'
    }
    var sortedRegions = this.state.regions.sort((a, b) => a["en"].localeCompare(b["en"]));
    var sortedCities = this.state.cities.sort((a, b) => a["en"].localeCompare(b["en"]));

    if (isHebrew) {
      directionStyling = {
        direction: 'rtl',
        textAlign: 'right'
      }
      sortedRegions = this.state.regions.sort((a, b) => a["he"].localeCompare(b["he"]));
      sortedCities = this.state.cities.sort((a, b) => a["he"].localeCompare(b["en"]));
    }

    const countries = this.state.countries.map((country) => {
      return <MenuItem value={country.shortName}>{country.name}</MenuItem>
    });
    if(isHebrew){
      countries.unshift(
        <Divider />
      )
      countries.unshift(
        <MenuItem value={"IL-HE"} style={{direction: directionStyling.direction}}>ישראל</MenuItem>
      )
    }
    const isIsrael = ["IL-HE", "IL"].includes(this.state.selCountry)
    const regions = sortedRegions.map((region) => {
      return <MenuItem value={region["en"]} style={{direction: isIsrael ? directionStyling.direction : 'ltr'}}>{isHebrew ? region["he"] : region["en"]}</MenuItem>
    });
    const cities = sortedCities.map((city) => {
      return <MenuItem value={city["he"]} style={{direction: isIsrael ? directionStyling.direction : 'ltr'}}>{isHebrew ? city["he"] : city["en"]}</MenuItem>
    });
    const regionsDisabled = this.state.selCountry === "";
    const citiesDisabled = this.state.selRegion === "";

    return (
      <div>
          <Typography variant="h2" component="h2" gutterBottom>
            {addShul}
          </Typography>
          <Paper className={classes.paper} id="add-shul-form-div" elevation={2} style={{direction: directionStyling.direction, textAlign: directionStyling.textAlign}}>
          <Typography variant="h4" component="h2" gutterBottom>
            {selectCity}
          </Typography>
          <FormControl className={classes.formControl}>
            <InputLabel id="add-shul-country-label">{country}</InputLabel>
            <Select
              labelId="add-shul-country-label"
              id="add-shul-country-select"
              value={this.state.selCountry}
              onChange={(e) => {this.handleCountrySelect(e)}}
              
            >
              {countries}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="add-shul-region-label">{stateOrRegion}</InputLabel>
            <Select
              labelId="add-shul-region-label"
              id="add-shul-region-select"
              value={this.state.selRegion}
              onChange={(e) => {this.handleRegionSelect(e)}}
              disabled={regionsDisabled}
            >
              {regions}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="add-shul-city-label">{city}</InputLabel>
            <Select
              labelId="add-shul-city-label"
              id="add-shul-city-select"
              value={this.state.selCity}
              onChange={(e) => {this.handleCitySelect(e)}}
              disabled={citiesDisabled}
            >
              {cities}
            </Select>
          </FormControl>
        </Paper>

      </div>
    );
  }
}

AddShul.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(AddShul));