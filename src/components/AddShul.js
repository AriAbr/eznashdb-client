import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Button, FormControl, InputLabel, Select, MenuItem, Paper, Typography, Divider, DialogActions, Table, TableRow, TableCell,
  TableBody, TextField, RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox} from '@material-ui/core';
import * as israelCities from '../data/israel-cities';
import AnimateHeight from 'react-animate-height';


const csc = require('countrycitystatejson')


const styles = theme => ({
  mainHeader: {
    fontWeight: 400
  },
  sectionHeader: {
    textAlign: 'center',
    fontWeight: 400
  },
  questionHeader:{
    fontWeight: 500,
  },
  roomHeader:{
    fontWeight: 500,
    textAlign: 'left',
    wordBreak: 'break-word',
    margin: '8px'
  },
  questionText:{
    fontWeight: 400
  },
  formControl: {
    margin: theme.spacing(1),
    border: '1px solid lightgrey',
    borderRadius: '4px',
    padding: '20px',
    width: 'calc(100% - 60px)',
  },
  generalBorderBox: {
    backgroundColor: '#d5d5d5',
  },
  roomBorderBox: {
    backgroundColor: 'slategrey',
    color: 'white'
  },
  generalQuestionBox: {
    backgroundColor: '#fafafa'
  },
  roomQuestionBox: {
    backgroundColor: 'aliceblue',
    color: 'black'
  },
  placementBox: {
    border: '0px solid lightgrey',
    padding: '0 20px',
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
  textField: {
    width: 300,
    maxWidth: '100%',
    marginBottom: '10px',
  },
  addRoomOuterDiv:{
    textAlign: 'right',
    padding: '0 10px'
  },
  heroButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  homeButtons: {
    minWidth: '220px',
    display: 'inline-block',
    margin: '10px'
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
      shulName: "",
      nussach: "",
      denomination: "",
      femaleLeadership: "",
      kaddishWithMen: "",
      kaddishAlone: "",
      childcare: "",
      roomNames: [""],
      roomSizes: [""],
      isCenteredVals: [false],
      isSameFloorSideVals: [false],
      isSameFloorBackVals: [false],
      isSameFloorElevatedVals: [false],
      isSameFloorLevelVals: [false],
      isBalconySideVals: [false],
      isBalconyBackVals: [false],
      isOnlyMenVals: [false],
      isMixedSeatingVals: [false],
      visAudVals: [""],
    };
  }

  addRoom(e){
    console.log("adding room");
    var roomNames = this.state.roomNames;
    var roomSizes = this.state.roomSizes;
    var isCenteredVals = this.state.isCenteredVals;
    var isSameFloorSideVals = this.state.isSameFloorSideVals;
    var isSameFloorBackVals = this.state.isSameFloorBackVals;
    var isSameFloorElevatedVals = this.state.isSameFloorElevatedVals;
    var isSameFloorLevelVals = this.state.isSameFloorLevelVals;
    var isBalconySideVals = this.state.isBalconySideVals;
    var isBalconyBackVals = this.state.isBalconyBackVals;
    var isOnlyMenVals = this.state.isOnlyMenVals;
    var isMixedSeatingVals = this.state.isMixedSeatingVals;
    var visAudVals = this.state.visAudVals;

    roomNames.push("");
    roomSizes.push("");
    isCenteredVals.push(false);
    isSameFloorSideVals.push(false);
    isSameFloorBackVals.push(false)
    isSameFloorElevatedVals.push(false)
    isSameFloorLevelVals.push(false);
    isBalconySideVals.push(false);
    isBalconyBackVals.push(false);
    isOnlyMenVals.push(false);
    isMixedSeatingVals.push(false);
    visAudVals.push("");

    this.setState({
      roomNames,
      roomSizes,
      isCenteredVals,
      isSameFloorSideVals,
      isSameFloorBackVals,
      isSameFloorElevatedVals,
      isSameFloorLevelVals,
      isBalconySideVals,
      isBalconyBackVals,
      isOnlyMenVals,
      isMixedSeatingVals,
      visAudVals,
    })
  }

  handleTextInput(e, inputName, key){
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
    } else if (inputName === 'roomName') {
      var roomNames = this.state.roomNames;
      roomNames[key] = value;
      this.setState({
        roomNames: roomNames,
      })
    }
  }

  handleRadioInput(e, inputName, key){
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
    } else if (inputName === 'size') {
      var roomSizes = this.state.roomSizes;
      roomSizes[key] = value;
      this.setState({
        roomSizes: roomSizes,
      })
    } else if (inputName === 'visAud') {
      var visAudVals = this.state.visAudVals;
      visAudVals[key] = value;
      this.setState({
        visAudVals: visAudVals,
      })
    }
  }

  handleCheckboxInput(e, key){
    var inputName = e.target.value;
    if(inputName === 'centered'){
      var isCenteredVals = this.state.isCenteredVals;
      isCenteredVals[key] = !this.state.isCenteredVals[key]
      this.setState({
        isCenteredVals: isCenteredVals,
      })
    } else if (inputName === 'sameFloorSide'){
      var isSameFloorSideVals = this.state.isSameFloorSideVals;
      isSameFloorSideVals[key] = !this.state.isSameFloorSideVals[key];
      this.setState({
        isSameFloorSideVals: isSameFloorSideVals,
      })
    } else if (inputName === 'sameFloorBack'){
      var isSameFloorBackVals = this.state.isSameFloorBackVals;
      isSameFloorBackVals[key] = !this.state.isSameFloorBackVals[key];
      this.setState({
        isSameFloorBackVals: isSameFloorBackVals,
      })
    } else if (inputName === 'sameFloorElevated'){
      var isSameFloorElevatedVals = this.state.isSameFloorElevatedVals;
      isSameFloorElevatedVals[key] = !this.state.isSameFloorElevatedVals[key];
      this.setState({
        isSameFloorElevatedVals: isSameFloorElevatedVals,
      })
    } else if (inputName === 'sameFloorLevel'){
      var isSameFloorLevelVals = this.state.isSameFloorLevelVals;
      isSameFloorLevelVals[key] = !this.state.isSameFloorLevelVals[key];
      this.setState({
        isSameFloorLevelVals: isSameFloorLevelVals,
      })
    } else if (inputName === 'balconySide'){
      var isBalconySideVals = this.state.isBalconySideVals;
      isBalconySideVals[key] = !this.state.isBalconySideVals[key];
      this.setState({
        isBalconySideVals: isBalconySideVals,
      })
    } else if (inputName === 'balconyBack'){
      var isBalconyBackVals = this.state.isBalconyBackVals;
      isBalconyBackVals[key] = !this.state.isBalconyBackVals[key];
      this.setState({
        isBalconyBackVals: isBalconyBackVals,
      })
    } else if (inputName === 'onlyMen'){
      var isOnlyMenVals = this.state.isOnlyMenVals;
      isOnlyMenVals[key] = !this.state.isOnlyMenVals[key];
      this.setState({
        isOnlyMenVals: isOnlyMenVals,
      })
    } else if (inputName === 'mixedSeating'){
      var isMixedSeatingVals = this.state.isMixedSeatingVals;
      isMixedSeatingVals[key] = !this.state.isMixedSeatingVals[key];
      this.setState({
        isMixedSeatingVals: isMixedSeatingVals,
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
    const womensSections = this.props.translate("womensSections");
    const rooms = this.props.translate("rooms");
    const room = this.props.translate("room");
    const roomName = this.props.translate("roomName");
    const womensSectionSize = this.props.translate("womensSectionSize");
    const sizeQuestion = this.props.translate("sizeQuestion");
    const muchSmaller = this.props.translate("muchSmaller");
    const somewhatSmaller = this.props.translate("somewhatSmaller");
    const sameSize = this.props.translate("sameSize");
    const larger = this.props.translate("larger");
    const placement = this.props.translate("placement");
    const placementQuestion = this.props.translate("placementQuestion");
    const sameFloor = this.props.translate("sameFloor");
    const balcony = this.props.translate("balcony");
    const noWomensSection = this.props.translate("noWomensSection");
    const centered = this.props.translate("centered");
    const side = this.props.translate("side");
    const back = this.props.translate("back");
    const elevated = this.props.translate("elevated");
    const levelWithMens = this.props.translate("levelWithMens");
    const onlyMens = this.props.translate("onlyMens");
    const mixedSeating = this.props.translate("mixedSeating");
    const visAud = this.props.translate("visAud");
    const visAudQuestion = this.props.translate("visAudQuestion");
    const visAudQuestionSubtitle1 = this.props.translate("visAudQuestionSubtitle1");
    const visAudQuestionSubtitle2 = this.props.translate("visAudQuestionSubtitle2");
    const difficult = this.props.translate("difficult");
    const easy = this.props.translate("easy");
    const addRoom = this.props.translate("addRoom");
    const submit = this.props.translate("submit");

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

    var roomHeaderIcon = <i class="fas fa-angle-right"></i>;
    if(isHebrew){
      roomHeaderIcon = <i class="fas fa-angle-left"></i>;
    }

    const roomSections = this.state.roomNames.map((roomNameVal, key) => {return <>
      <Typography variant="h5" component="h2" gutterBottom className={classes.roomHeader}>
        {roomHeaderIcon} {this.state.roomNames[key].length > key ? this.state.roomNames[key] : room + ` ${key+1}`}
      </Typography>
      <FormControl className={classes.formControl + " " + classes.roomBorderBox}>

        <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
          {roomName}
        </Typography>
        <FormControl className={classes.formControl + " " + classes.roomQuestionBox}>
          <TextField id="shul-name-input" className={classes.textField} label={roomName} required
            onChange={(e) => {this.handleTextInput(e, 'roomName', key)}} value={this.state.roomNames[key]} />
        </FormControl>

        <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
          {womensSectionSize}
        </Typography>
        <FormControl component="fieldset" className={classes.formControl + " " + classes.roomQuestionBox}>
          <Typography variant="body1" component="h2" gutterBottom className={classes.questionText}>
            {sizeQuestion}
          </Typography>
          <RadioGroup aria-label="size" name="size" value={this.state.roomSizes[key]} onChange={(e) => {this.handleRadioInput(e, 'size', key)}}>
            <FormControlLabel value="XS" control={<Radio color="primary" />} label={muchSmaller} />
            <FormControlLabel value="S" control={<Radio color="primary" />} label={somewhatSmaller} />
            <FormControlLabel value="M" control={<Radio color="primary" />} label={sameSize} />
            <FormControlLabel value="L" control={<Radio color="primary" />} label={larger} />
            <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
          </RadioGroup>
        </FormControl>
        
        <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
          {placement}
        </Typography>
        <FormControl component="fieldset" className={classes.formControl + " " + classes.roomQuestionBox}>
          <Typography variant="body1" component="h2" gutterBottom className={classes.questionText}>
            {placementQuestion}
          </Typography>
          <FormControl component="fieldset" className={classes.formControl + " " + classes.placementBox} style={{marginTop: '20px'}}>
            <Typography variant="body1" component="h2" gutterBottom className={classes.questionHeader}>
              {sameFloor}
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={this.state.isCenteredVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"centered"}  color="primary" />}
                label={centered}
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.isSameFloorSideVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"sameFloorSide"}  color="primary" />}
                label={side}
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.isSameFloorBackVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"sameFloorBack"}  color="primary" />}
                label={back}
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.isSameFloorElevatedVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"sameFloorElevated"}  color="primary" />}
                label={elevated}
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.isSameFloorLevelVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"sameFloorLevel"}  color="primary" />}
                label={levelWithMens}
              />
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset" className={classes.formControl + " " + classes.placementBox} >
            <Typography variant="body1" component="h2" gutterBottom className={classes.questionHeader}>
              {balcony}
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={this.state.isBalconySideVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"balconySide"}  color="primary" />}
                label={side}
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.isBalconyBackVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"balconyBack"}  color="primary" />}
                label={back}
              />
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset" className={classes.formControl + " " + classes.placementBox} >
            <Typography variant="body1" component="h2" gutterBottom className={classes.questionHeader}>
              {noWomensSection}
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={this.state.isOnlyMenVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"onlyMen"}  color="primary" />}
                label={onlyMens}
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.isMixedSeatingVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"mixedSeating"}  color="primary" />}
                label={mixedSeating}
              />
            </FormGroup>
          </FormControl>
        </FormControl>

        <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
          {visAud}
        </Typography>
        <FormControl component="fieldset" className={classes.formControl + " " + classes.roomQuestionBox}>
          <Typography variant="body1" component="h2" gutterBottom className={classes.questionText}>
            {visAudQuestion + " "}
            {visAudQuestionSubtitle1} <span className={classes.questionHeader}>{unsure}</span> {visAudQuestionSubtitle2}
          </Typography>
          <RadioGroup aria-label="visAud" name="visAud" value={this.state.visAudVals[key]} onChange={(e) => {this.handleRadioInput(e, 'visAud', key)}}>
            <FormControlLabel value="1" control={<Radio color="primary" />} label={"1 - " + difficult} />
            <FormControlLabel value="2" control={<Radio color="primary" />} label="2" />
            <FormControlLabel value="3" control={<Radio color="primary" />} label="3" />
            <FormControlLabel value="4" control={<Radio color="primary" />} label="4" />
            <FormControlLabel value="5" control={<Radio color="primary" />} label={"5 - " + easy} />
            <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
          </RadioGroup>
        </FormControl>

      </FormControl>
      
    </>});

    return (
      <div>
        <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
          {addShul}
        </Typography>
        <Paper className={classes.paper} id="add-shul-paper" elevation={12}>

          <Typography variant="h4" component="h2" gutterBottom className={classes.sectionHeader}>
            {generalInfo}
          </Typography>
          <FormControl className={classes.formControl + " " + classes.generalBorderBox}>

            <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
              {location}
            </Typography>
            <div className={classes.formControl + " " + classes.generalQuestionBox}>
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
                <Typography variant="body1" component="h2" gutterBottom className={classes.questionHeader}>
                  {checkIfShulListed}
                </Typography>
                  <Table className={classes.table} aria-label="simple table" size="small" >
                    <TableBody>
                      {this.state.savedShulRows.map(shul => (
                        <TableRow key={shul.name}>
                          <TableCell component="th" scope="row" className={classes.questionText}>
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

            <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
              {identification}
            </Typography>
            <FormControl className={classes.formControl + " " + classes.generalQuestionBox}>
              <TextField id="shul-name-input" className={classes.textField} label={shulName} required
                onChange={(e) => {this.handleTextInput(e, 'shulName')}} value={this.state.shulName} />
              <TextField id="nussach-input" className={classes.textField} label={nussach} 
                onChange={(e) => {this.handleTextInput(e, 'nussach')}} value={this.state.nussach} />
              <TextField id="denomination-input" className={classes.textField} label={denomination}
                onChange={(e) => {this.handleTextInput(e, 'denomination')}} value={this.state.denomination} />
            </FormControl>

            <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
              {femaleLeadership}
            </Typography>
            <FormControl component="fieldset" className={classes.formControl + " " + classes.generalQuestionBox}>
              <Typography variant="body1" component="h2" gutterBottom className={classes.questionText}>
                {femaleLeadershipQuestion}
              </Typography>
              <RadioGroup aria-label="femaleLeadership" name="femaleLeadership" value={this.state.femaleLeadership} 
                onChange={(e) => {this.handleRadioInput(e, 'femaleLeadership')}}>
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={yes} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={no} />
                <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
              </RadioGroup>
            </FormControl>

            <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
              {kaddish}
            </Typography>
            <FormControl component="fieldset" className={classes.formControl + " " + classes.generalQuestionBox}>
              <Typography variant="body1" component="h2" gutterBottom className={classes.questionText}>
                {kaddishWithMenQuestion}
              </Typography>
              <RadioGroup aria-label="kaddishWithMen" name="kaddishWithMen" value={this.state.kaddishWithMen} onChange={(e) => {this.handleRadioInput(e, 'kaddishWithMen')}}>
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={yes} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={no} />
                <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl + " " + classes.generalQuestionBox}>
              <Typography variant="body1" component="h2" gutterBottom className={classes.questionText}>
                {kaddishAloneQuestion}
              </Typography>
              <RadioGroup aria-label="kaddishAlone" name="kaddishAlone" value={this.state.kaddishAlone} onChange={(e) => {this.handleRadioInput(e, 'kaddishAlone')}}>
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={yes} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={no} />
                <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
                <FormControlLabel value="alwaysMan" control={<Radio color="primary" />} label={manAlwaysKaddish} />
              </RadioGroup>
            </FormControl>

            <Typography variant="h6" component="h2" gutterBottom className={classes.questionHeader}>
              {childcare}
            </Typography>
            <FormControl component="fieldset" className={classes.formControl + " " + classes.generalQuestionBox}>
              <Typography variant="body1" component="h2" gutterBottom className={classes.questionText}>
                {childcareQuestion}
              </Typography>
              <RadioGroup aria-label="childcare" name="childcare" value={this.state.childcare} onChange={(e) => {this.handleRadioInput(e, 'childcare')}}>
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={yes} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={no} />
                <FormControlLabel value="unsure" control={<Radio color="primary" />} label={unsure} />
              </RadioGroup>
            </FormControl>

          </FormControl>

          <Typography variant="h4" component="h2" gutterBottom className={classes.sectionHeader} style={{marginTop: '20px'}}>
            {rooms}
          </Typography>
          {roomSections}

          <div className={classes.heroButtons}>

            <Button variant="outlined" color="primary" size="large" className={classes.homeButtons} onClick={(e) => {this.addRoom(e)}}>
              <i className="fas fa-plus"></i> &nbsp; {addRoom}
            </Button>

            <Button variant="contained" color="primary" size="large" className={classes.homeButtons}>
              <i class="fas fa-paper-plane"></i> &nbsp; {submit}
            </Button>

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