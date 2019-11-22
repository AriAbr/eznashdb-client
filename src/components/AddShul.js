import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, Paper, Typography} from '@material-ui/core';

const ccs = require('countrycitystatejson')


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
        states: [],
        selState: "",
        cities: [],
        selCity: "",
      };
  }

  handleCountrySelect(e){
    var countryCode = e.target.value;
    var states = ccs.getStatesByShort(countryCode).sort();
    if(states.length === 0){
      states = ["N/A"];
      this.setState({
        selCountry: countryCode,
        states: states,
      }, () => {
        var e = {target: { value: "N/A"}};
        this.handleStateSelect(e);
      })
    } else {
      this.setState({
        selCountry: countryCode,
        states: states,
        selState: "",
        cities: [],
        selCity: "",
      })
    }
  }

  handleStateSelect(e){
    var state = e.target.value;
    var cities = ccs.getCities(this.state.selCountry, state).sort();
    if(cities.length === 0){
      cities = ["N/A"];
      this.setState({
        selState: state,
        cities: cities,
      }, () => {
        var e = {target: { value: "N/A"}};
        this.handleCitySelect(e);
      })
    } else {
      this.setState({
        selState: state,
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
  componentDidMount(){
    var countries = ccs.getCountries();
    var sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));
    this.setState({
      countries: sortedCountries
    })
  }

  render() {
    const { classes } = this.props;

    const addShul = this.props.translate("addShul");
    const country = this.props.translate("country");
    const stateRegion = this.props.translate("stateRegion");
    const city = this.props.translate("city");
    const selectCity = this.props.translate("selectCity");

    var directionStyling = {
      direction: 'ltr',
      textAlign: 'left'
    }

    if (this.props.activeLanguage && this.props.activeLanguage.code === "he") {
      directionStyling = {
        direction: 'rtl',
        textAlign: 'right'
      }

    }

    const countries = this.state.countries.map((country) => {
      return <MenuItem value={country.shortName}>{country.name}</MenuItem>
    });
    const states = this.state.states.map((state) => {
      return <MenuItem value={state}>{state}</MenuItem>
    });
    const cities = this.state.cities.map((city) => {
      return <MenuItem value={city}>{city}</MenuItem>
    });
    const statesDisabled = this.state.selCountry === "";
    const citiesDisabled = this.state.selState === "";

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
            <InputLabel id="add-shul-state-label">{stateRegion}</InputLabel>
            <Select
              labelId="add-shul-state-label"
              id="add-shul-state-select"
              value={this.state.selState}
              onChange={(e) => {this.handleStateSelect(e)}}
              disabled={statesDisabled}
            >
              {states}
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