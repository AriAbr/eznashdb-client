import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Button, FormControl, InputLabel, Select, MenuItem, Paper, Typography, Divider, DialogActions, Table, TableRow, TableCell,
  TableBody, TextField, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import * as israelCities from '../data/israel-cities';
import AnimateHeight from 'react-animate-height';


const csc = require('countrycitystatejson')


const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    border: '1px solid lightgrey',
    borderRadius: '7px',
    padding: '20px',
    width: 'calc(100% - 60px)',
  },
  locationFormControl: {
    width: 300,
    maxWidth: '100%',
    marginRight: '20px',
    marginBottom: '10px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: '20px',
    direction: 'ltr',
    textAlign: 'left',
  },
  dialogContent: {
    "&:focus": {
      outline:'none'
    }
  },
  dialogActions: {
    justifyContent: 'flex-start',
  },
  savedShulNameCell: {
    fontWeight: 'bold'
  },
  textField: {
    width: 300,
    maxWidth: '100%',
    marginBottom: '10px',
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
        duplicatesDialogIsOpen: false,
        duplicatesQuestionHeight: 0,
        savedShulRows: [ //saving dummy data here for now
          {"name": "Keter Torah"},
          {"name": "Rinat"},
          {"name": "Bnai Yeshurun"},
          {"name": "Beth Aaron"},
          {"name": "Netivot Shalom"},
        ],
        shulName: '',
        nussach: '',
        denomination: '',
        femaleLeadership: '',
        kaddishWithMen: '',
        kaddishAlone: '',
        childcare: '',
      };

    }

  handleTextInput(e, inputName){
    var value = e.target.value;
    if(inputName === 'shulName'){
      this.setState({
        shulName: value,
      })
    } else if (inputName === 'nussach'){
      this.setState({
        nussach: value,
      })
    } else if (inputName === 'denomination') {
      this.setState({
        denomination: value,
      })
    }
  }

  handleRadioInput(e, inputName){
    var value = e.target.value;
    if(inputName === 'femaleLeadership'){
      this.setState({
        femaleLeadership: value,
      })
    } else if (inputName === 'kaddishWithMen'){
      this.setState({
        kaddishWithMen: value,
      })
    } else if (inputName === 'kaddishAlone') {
      this.setState({
        kaddishAlone: value,
      })
    } else if (inputName === 'childcare') {
      this.setState({
        childcare: value,
      })
    }
  }

  openDuplicatesQuestion(){
    this.setState({
      duplicatesQuestionHeight: 'auto',
    })
  }

  closeDuplicatesQuestion(){
    this.setState({
      duplicatesQuestionHeight: 0,
    })
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
      cities = [{
        "en": "N/A",
        "he": "N/A"
      }];
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
    }, () => {
      this.openDuplicatesQuestion();
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
        "en": this.getFormattedIsraelName(currCity["lishka_en"]),
        "he": currCity["lishka_he"]
      };
      const lishkaIndex = lishkaot.map(lishka => lishka["he"]).indexOf(currCity["lishka_he"]);
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
      var cityRegion = currCity["lishka_he"]
      if(cityRegion === region){
        var cityData = {
          "en": this.getFormattedIsraelName(currCity["english_name"]),
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

  getFormattedIsraelName(name){
    var lowerCaseName = name.toLowerCase();
    var formattedName = '';
    var lowerLetters = 'abcdefghijklmnopqrstuvwyyz';
    lowerLetters = lowerLetters.split('');

    var nextIsUpper = true;
    for(let i = 0; i < lowerCaseName.length; i++){
      var currChar = lowerCaseName[i];
      //add char
      if(nextIsUpper){
        formattedName += currChar.toUpperCase();
      } else {
        formattedName += currChar;
      }
      //handle next char
      if(['\''].concat(lowerLetters).includes(currChar)){
        nextIsUpper = false;
      } else {
        nextIsUpper = true
      }
    }

    return formattedName;
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
    const location = this.props.translate("location");
    const identification = this.props.translate("identification");
    const checkIfShulListed = this.props.translate("checkIfShulListed");
    const viewEdit = this.props.translate("viewEdit");
    const shulNotListed = this.props.translate("shulNotListed");
    const generalInfo = this.props.translate("generalInfo");
    const shulName = this.props.translate("shulName");
    const nussach = this.props.translate("nussach");
    const denomination = this.props.translate("denomination");
    const femaleLeadership = this.props.translate("femaleLeadership");
    const kaddish = this.props.translate("kaddish");
    const childcare = this.props.translate("childcare");
    const femaleLeadershipQuestion = this.props.translate("femaleLeadershipQuestion");
    const kaddishWithMenQuestion = this.props.translate("kaddishWithMenQuestion");
    const kaddishAloneQuestion = this.props.translate("kaddishAloneQuestion");
    const childcareQuestion = this.props.translate("childcareQuestion");
    const yes = this.props.translate("yes");
    const no = this.props.translate("no");
    const unsure = this.props.translate("unsure");
    const manAlwaysKaddish = this.props.translate("manAlwaysKaddish");


    const isHebrew = (this.props.activeLanguage && this.props.activeLanguage.code === "he");

    var sortedRegions = this.state.regions.sort((a, b) => a["en"].localeCompare(b["en"]));
    var sortedCities = this.state.cities.sort((a, b) => a["en"].localeCompare(b["en"]));

    if (isHebrew) {
      sortedRegions = this.state.regions.sort((a, b) => a["he"].localeCompare(b["he"]));
      sortedCities = this.state.cities.sort((a, b) => a["he"].localeCompare(b["he"]));
    }

    const countries = this.state.countries.map((country, key) => {
      return <MenuItem value={country.shortName} key={key}>{country.name}</MenuItem>
    });

    if(isHebrew){
      countries.unshift(
        <Divider key={this.state.countries.length+1}/>
      )
      countries.unshift(
        <MenuItem value={"IL-HE"} key={this.state.countries.length}>ישראל</MenuItem>
      )
    }

    const regions = sortedRegions.map((region, key) => {
      return <MenuItem value={region["he"]} key={key}>{isHebrew ? region["he"] : region["en"]}</MenuItem>
    });
    const cities = sortedCities.map((city, key) => {
      return <MenuItem value={city["he"]} key={key}>{isHebrew ? city["he"] : city["en"]}</MenuItem>
    });
    const regionsDisabled = this.state.selCountry === "";
    const citiesDisabled = this.state.selRegion === "";

    const { duplicatesQuestionHeight } = this.state;

    return (
      <div>
        <Typography variant="h2" component="h2" gutterBottom>
          {addShul}
        </Typography>
        <Paper className={classes.paper} id="add-shul-paper" elevation={2}>
          <Typography variant="h4" component="h2" gutterBottom className='section-header'>
            {generalInfo}
          </Typography>
          <div id='general-info-questions-outer-div'>
            <Typography variant="h6" component="h2" gutterBottom className='question-header'>
              {location}
            </Typography>
            <div className={classes.formControl}>
              <FormControl className={classes.locationFormControl}>
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
              <FormControl className={classes.locationFormControl}>
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
              <FormControl className={classes.locationFormControl}>
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
              <AnimateHeight
                duration={ 750 }
                height={ duplicatesQuestionHeight }
              >
                <Divider style={{margin: '20px 0'}} />
                <Typography variant="body1" component="h2" gutterBottom>
                  <b>{checkIfShulListed}</b>
                </Typography>
                  <Table className={classes.table} aria-label="simple table" size="small" >
                    <TableBody>
                      {this.state.savedShulRows.map(shul => (
                        <TableRow key={shul.name}>
                          <TableCell component="th" scope="row" className={classes.savedShulNameCell}>
                            {shul.name}
                          </TableCell>
                          <TableCell align="right">
                            <Button variant="outlined" color="default" size="small" >
                              {viewEdit}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                <DialogActions className={classes.dialogActions}>
                  <Button variant="outlined" color="primary" size="medium" onClick={() => {this.closeDuplicatesQuestion()}} >
                    {shulNotListed}
                  </Button>
                </DialogActions>
              </AnimateHeight>
            </div>

            <Typography variant="h6" component="h2" gutterBottom className='question-header'>
              {identification}
            </Typography>
            <FormControl className={classes.formControl}>
              <TextField id="shul-name-input" className={classes.textField} label={shulName} required
                onChange={(e) => {this.handleTextInput(e, 'shulName')}} value={this.state.shulName} />
              <TextField id="nussach-input" className={classes.textField} label={nussach} 
                onChange={(e) => {this.handleTextInput(e, 'nussach')}} value={this.state.nussach} />
              <TextField id="denomination-input" className={classes.textField} label={denomination}
                onChange={(e) => {this.handleTextInput(e, 'denomination')}} value={this.state.denomination} />
            </FormControl>

            <Typography variant="h6" component="h2" gutterBottom className='question-header'>
              {femaleLeadership}
            </Typography>
            <FormControl component="fieldset" className={classes.formControl}>
              <Typography variant="body1" component="h2" gutterBottom>
                <b>{femaleLeadershipQuestion}</b>
              </Typography>
              <RadioGroup aria-label="femaleLeadership" name="femaleLeadership" value={this.state.femaleLeadership} 
                onChange={(e) => {this.handleRadioInput(e, 'femaleLeadership')}}>
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={yes} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={no} />
                <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
              </RadioGroup>
            </FormControl>
            <Typography variant="h6" component="h2" gutterBottom className='question-header'>
              {kaddish}
            </Typography>
            <FormControl component="fieldset" className={classes.formControl}>
              <Typography variant="body1" component="h2" gutterBottom>
                <b>{kaddishWithMenQuestion}</b>
              </Typography>
              <RadioGroup aria-label="kaddishWithMen" name="kaddishWithMen" value={this.state.kaddishWithMen} onChange={(e) => {this.handleRadioInput(e, 'kaddishWithMen')}}>
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={yes} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={no} />
                <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl}>
              <Typography variant="body1" component="h2" gutterBottom>
                <b>{kaddishAloneQuestion}</b>
              </Typography>
              <RadioGroup aria-label="kaddishAlone" name="kaddishAlone" value={this.state.kaddishAlone} onChange={(e) => {this.handleRadioInput(e, 'kaddishAlone')}}>
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={yes} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={no} />
                <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
                <FormControlLabel value="alwaysMan" control={<Radio color="primary" />} label={manAlwaysKaddish} />
              </RadioGroup>
            </FormControl>
            <Typography variant="h6" component="h2" gutterBottom className='question-header'>
              {childcare}
            </Typography>
            <FormControl component="fieldset" className={classes.formControl}>
              <Typography variant="body1" component="h2" gutterBottom>
                <b>{childcareQuestion}</b>
              </Typography>
              <RadioGroup aria-label="childcare" name="childcare" value={this.state.childcare} onChange={(e) => {this.handleRadioInput(e, 'childcare')}}>
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={yes} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={no} />
                <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
              </RadioGroup>
            </FormControl>
          </div>
        </Paper>
      </div>
    );
  }
}

AddShul.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(AddShul));