import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Button, FormControl, InputLabel, Select, MenuItem, Paper, Typography, Divider, DialogActions, Table, TableRow, TableCell,
  TableBody, TextField, FormControlLabel, FormGroup, Checkbox, Dialog, DialogTitle, DialogContent,
  DialogContentText} from '@material-ui/core';
import * as israelCities from '../data/israel-cities';
const request = require("request");


const ccs = require('countrycitystatejson')


const styles = theme => ({
  mainHeader: {
    fontWeight: 400,
    fontSize: '40px',
    textAlign: 'center'
  },
  sectionHeader: {
    textAlign: 'left',
    fontWeight: 400,
    fontSize: '31px',
  },
  roomHeader:{
    fontWeight: 400,
    textAlign: 'left',
    wordBreak: 'break-word',
  },
  questionContainer:{
    padding: '2px 10px',
    height: 'fit-content',
    position: 'relative',
  },
  questionGroupContainer: {
    "& > *:nth-child(odd)":  {
      backgroundColor: '#f1f1f1',
    },
    border: '4px solid #f1f1f1',
    borderRadius: '7px',
  },
  questionText:{
    fontWeight: 400,
    fontSize: '16px',
    float: 'left',
    marginTop: '16px',
    verticalAlign: '14px',
  },
  duplicateShulText: {
    fontWeight: 200,
    fontSize: '16px',
    marginTop: '16px',
    verticalAlign: '14px',
  },
  textBuffer: {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
    color: 'transparent',
    fontWeight: 200,
    fontSize: '16px',
    float: 'left',
    marginTop: '13px',
    verticalAlign: '14px',
  },
  inputBuffer: {
    width: '140px',
    height: '36px',
    display: 'inline-block',
    marginLeft: '20px',
    marginBottom: '10px',
    verticalAlign: '-5px',
    fontWeight: 200,
    "& *":  {
      fontWeight: 200
    },
  },
  inputContainer: {
    textAlign: 'right',
    position: 'absolute',
    right: 10,
    bottom: 0,
    "& *":  {
      fontWeight: 200
    },
  },
  placementGroupContainer: {
    margin: theme.spacing(1),
    display: 'inherit'
  },
  placementGroupHeader:{
    fontWeight: 400,
    fontStyle: 'italic',
  },
  textSelectFormControl: {
    width: 140,
    maxWidth: '100%',
    marginLeft: '20px',
    marginBottom: '10px',
  },
  paper: {
    padding: '20px',
    direction: 'ltr',
    textAlign: 'left',
    border: '1px solid #D5D5D5',
    backgroundColor: 'white'
  },
  dialogActions: {
    justifyContent: 'flex-start',
  },
  textField: {
    height: 20
  },
  heroButtonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  heroButton: {
    display: 'inline-block',
    margin: '10px 0px 10px 10px'
  },
  roomTitleContainer:{
    margin: `${theme.spacing(1)}px 0`,
    display: 'flex',
    marginTop: '20px',
    justifyContent: 'space-between',
    height: 'fit-content',
    padding: '0 10px',
  },
  formControlLabel:{
    width: 'fit-content',
    display: 'block',
    "& *":  {
      fontWeight: 200
    },
  },
  select: {
    height: 20,
    textAlign: 'left'
  }
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
      duplicatesQuestionDialogIsOpen: false,
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
      deleteDialogIsOpen: false,
      roomToDelete: null,
      focusedInput: null,
    };
  }

  openDeleteRoomDialog(e, key){
    this.setState({
      deleteDialogIsOpen: true, roomToDelete: key
    })
  }

  closeDeleteRoomDialog(){
    this.setState({
      deleteDialogIsOpen: false, roomToDelete: null
    })
  }

  deleteRoom(e, key){
    this.closeDeleteRoomDialog();

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

    roomNames.splice(key, 1);
    roomSizes.splice(key, 1);
    isCenteredVals.splice(key, 1);
    isSameFloorSideVals.splice(key, 1);
    isSameFloorBackVals.splice(key, 1);
    isSameFloorElevatedVals.splice(key, 1);
    isSameFloorLevelVals.splice(key, 1);
    isBalconySideVals.splice(key, 1);
    isBalconyBackVals.splice(key, 1);
    isOnlyMenVals.splice(key, 1);
    isMixedSeatingVals.splice(key, 1);
    visAudVals.splice(key, 1);

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

  addRoom(e){
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
    isSameFloorBackVals.push(false);
    isSameFloorElevatedVals.push(false);
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

  handleSelectInput(e, inputName, key){ //using this for everything except country selects
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
      duplicatesQuestionDialogIsOpen: true,
    })
  }

  closeDuplicatesQuestion(){
    this.setState({
      duplicatesQuestionDialogIsOpen: false,
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
    var regions = ccs.getStatesByShort(countryCode).sort();
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
    var cities = ccs.getCities(countryCode, region);
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

  setFocusedInput(e, inputName){
    this.setState({
      focusedInput: inputName
    })
  }

  async submit(e){
    var url = `${process.env.REACT_APP_EZNASHDB_API}shuls/create`

    var rooms = [];
    for(let i = 0; i < this.state.roomNames.length; i++){
      var room = {
        name: this.state.roomNames[i],
        size: this.state.roomSizes[i],
        isCentered: this.state.isCenteredVals[i],
        isSameFloorSide: this.state.isSameFloorSideVals[i],
        isSameFloorBack: this.state.isSameFloorBackVals[i],
        isSameFloorElevated: this.state.isSameFloorElevatedVals[i],
        isSameFloorLevel: this.state.isSameFloorLevelVals[i],
        isBalconySide: this.state.isBalconySideVals[i],
        isBalconyBack: this.state.isBalconyBackVals[i],
        isOnlyMen: this.state.isOnlyMenVals[i],
        isMixedSeating: this.state.isMixedSeatingVals[i],
        visAudScore: this.state.visAudVals[i],
      }
      rooms.push(room)
    }

    const options = {
      url: url,
      json: true,
      method: 'post',
      body: {
        name: this.state.shulName,
        nussach: this.state.nussach,
        denom: this.state.denomination,
        country: this.state.selCountry,
        region: this.state.selRegion,
        city: this.state.selCity,
        femLead: this.state.femaleLeadership,
        kaddishWithMen: this.state.kaddishWithMen,
        kaddishAlone: this.state.kaddishAlone,
        childcare: this.state.childcare,
        rooms: rooms
      }
    };
    
    request(options,

      (err, res, body) => {
        var parsedBody = res.body;
        if(res.statusCode === 500){
          console.log("SUBMISSION ERROR (see below):");
          window.alert("Submission error. See console for error info");
        } else {
          window.alert("Submission success! See console for submitted info");
        }
        console.log(parsedBody);
      }
    );
  }

  componentDidMount(){
    this.getIsraelRegions();
    var countries = ccs.getCountries();
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

    const inputLabelOffset = -6;

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
    const femaleLeadershipQuestion = this.props.translate("femaleLeadershipQuestion");
    const kaddishWithMenQuestion = this.props.translate("kaddishWithMenQuestion");
    const kaddishAloneQuestion = this.props.translate("kaddishAloneQuestion");
    const childcareQuestion = this.props.translate("childcareQuestion");
    const yes = this.props.translate("yes");
    const no = this.props.translate("no");
    const unsure = this.props.translate("unsure");
    const manAlwaysKaddish = this.props.translate("manAlwaysKaddish");
    const rooms = this.props.translate("rooms");
    const room = this.props.translate("room");
    const roomName = this.props.translate("roomName");
    const sizeQuestion = this.props.translate("sizeQuestion");
    const muchSmaller = this.props.translate("muchSmaller");
    const somewhatSmaller = this.props.translate("somewhatSmaller");
    const sameSize = this.props.translate("sameSize");
    const larger = this.props.translate("larger");
    const placementQuestion = this.props.translate("placementQuestion");
    const sameFloor = this.props.translate("sameFloor");
    const balcony = this.props.translate("balcony");
    const noWomensSection = this.props.translate("noWomensSection");
    const centeredMechitza = this.props.translate("centeredMechitza");
    const side = this.props.translate("side");
    const back = this.props.translate("back");
    const elevated = this.props.translate("elevated");
    const levelWithMens = this.props.translate("levelWithMens");
    const onlyMens = this.props.translate("onlyMens");
    const mixedSeating = this.props.translate("mixedSeating");
    const visAudQuestion = this.props.translate("visAudQuestion");
    const difficult = this.props.translate("difficult");
    const easy = this.props.translate("easy");
    const addRoom = this.props.translate("addRoom");
    const submit = this.props.translate("submit");
    const deleteTranslated = this.props.translate("delete");
    const areYouSure = this.props.translate("areYouSure");
    const willBeDeleted = this.props.translate("willBeDeleted");
    const deleteRoom = this.props.translate("deleteRoom");
    const cancel = this.props.translate("cancel");
    const select = this.props.translate("select");

    const isHebrew = (this.props.activeLanguage && this.props.activeLanguage.code === "he");

    var sortedRegions = this.state.regions.sort((a, b) => a["en"].localeCompare(b["en"]));
    var sortedCities = this.state.cities.sort((a, b) => a["en"].localeCompare(b["en"]));

    if (isHebrew) {
      sortedRegions = this.state.regions.sort((a, b) => a["he"].localeCompare(b["he"]));
      sortedCities = this.state.cities.sort((a, b) => a["he"].localeCompare(b["he"]));
    }

    const countries = this.state.countries.map((country, key) => {
      return <MenuItem value={country.shortName} key={key} dense={true}>{country.name}</MenuItem>
    });

    if(isHebrew){
      countries.unshift(
        <Divider key={this.state.countries.length+1}/>
      )
      countries.unshift(
        <MenuItem value={"IL-HE"} key={this.state.countries.length} dense={true}>ישראל</MenuItem>
      )
    }

    const regions = sortedRegions.map((region, key) => {
      return <MenuItem value={region["he"]} key={key} dense={true}>{isHebrew ? region["he"] : region["en"]}</MenuItem>
    });
    const cities = sortedCities.map((city, key) => {
      return <MenuItem value={city["he"]} key={key} dense={true}>{isHebrew ? city["he"] : city["en"]}</MenuItem>
    });
    const regionsDisabled = this.state.selCountry === "";
    const citiesDisabled = this.state.selRegion === "";

    var roomNameToDelete = "";
    if(typeof(this.state.roomToDelete) === "number"){
      roomNameToDelete = this.state.roomNames[this.state.roomToDelete];
      if(roomNameToDelete === ""){
        roomNameToDelete = `${room} ${this.state.roomToDelete + 1}`;
      }
    }

    const roomSections = this.state.roomNames.map((roomNameVal, key) => {return <div key={key}>
      <div className={classes.roomTitleContainer}>
        <Typography variant="h5" component="h2" className={classes.roomHeader} display='inline'>
          {this.state.roomNames[key].length > key ? this.state.roomNames[key] : room + ` ${key+1}`}

        </Typography>
        <Button color="default" size="small" onClick={(e) => {this.openDeleteRoomDialog(e, key)}} disabled={this.state.roomNames.length <= 1}>
          <i className="fas fa-trash"></i> &nbsp; {deleteTranslated}
        </Button>

      </div>

      <div className={classes.questionGroupContainer}>
        <div className={classes.questionContainer}>
          <span className={classes.questionText}>
            {roomName}:
          </span>
          <div className={classes.inputBuffer}></div>
          <span className={classes.inputContainer}>
            <span className={classes.textBuffer}>
              {roomName}:
            </span>
            <FormControl className={classes.textSelectFormControl} size="small" >
              <TextField id={`room-${key}-name-input`} label={roomName} size='small'
                onChange={(e) => {this.handleTextInput(e,  'roomName', key)}} value={this.state.roomNames[key]}
                onFocus={(e) => {this.setFocusedInput(e, `roomName${key}`)}}
                onBlur ={(e) => {this.setFocusedInput(e, null)}}
                InputProps={{
                  className: classes.textField
                }}
                InputLabelProps={{
                  style: {
                    ...(!(this.state.focusedInput === `roomName${key}` || this.state.roomNames[key]) && { top: `${inputLabelOffset}px` }),
                  },
                  disableAnimation: true
                }}
              />
            </FormControl>
          </span>
        </div>

        <div className={classes.questionContainer}>
          <span className={classes.questionText}>
            {sizeQuestion}
          </span>
          <div className={classes.inputBuffer}></div>
          <span className={classes.inputContainer}>
            <span className={classes.textBuffer}>
              {sizeQuestion}
            </span>
            <FormControl className={classes.textSelectFormControl} size="small" >
              <InputLabel id={`room-${key}-size-input-label`}
                style={{
                  top: `${inputLabelOffset}px`,
                  visibility: `${(this.state.focusedInput === `womSecSize${key}` || this.state.roomSizes[key]) ? "hidden" : "visible"}`
                }}
                disableAnimation={true}
              >
                {select}
              </InputLabel>
              <Select
                labelId={`room-${key}-size-input-label`}
                id={`room-${key}-size-select`}
                value={this.state.roomSizes[key]}
                onChange={(e) => {this.handleSelectInput(e, 'size', key)}}
                onFocus={(e) => {this.setFocusedInput(e, `womSecSize${key}`)}}
                onBlur ={(e) => {this.setFocusedInput(e, null)}}
                className={classes.select}
              >
                <MenuItem dense value="">
                  <em>{select}</em>
                </MenuItem>
                <MenuItem dense value={1}>{muchSmaller}</MenuItem>
                <MenuItem dense value={2}>{somewhatSmaller}</MenuItem>
                <MenuItem dense value={3}>{sameSize}</MenuItem>
                <MenuItem dense value={4}>{larger}</MenuItem>
                <MenuItem dense value={0}>{unsure}</MenuItem>
              </Select>
            </FormControl>
          </span>
        </div>

        <div className={classes.questionContainer}>
          <span className={classes.questionText}>
            {visAudQuestion}
          </span>
          <div className={classes.inputBuffer}></div>
          <span className={classes.inputContainer}>
            <span className={classes.textBuffer}>
              {visAudQuestion}
            </span>
            <FormControl className={classes.textSelectFormControl} size="small" >
              <InputLabel id={`room-${key}-vis-aud-input-label`}
                style={{
                  top: `${inputLabelOffset}px`,
                  visibility: `${(this.state.focusedInput === `visAud${key}` || this.state.visAudVals[key]) ? "hidden" : "visible"}`
                }}
                disableAnimation={true}
              >
                {select}
              </InputLabel>
              <Select
                labelId={`room-${key}-vis-aud-input-label`}
                id={`room-${key}-vis-aud-select`}
                value={this.state.visAudVals[key]}
                onChange={(e) => {this.handleSelectInput(e, 'visAud', key)}}
                onFocus={(e) => {this.setFocusedInput(e, `visAud${key}`)}}
                onBlur ={(e) => {this.setFocusedInput(e, null)}}
                className={classes.select}
              >
                <MenuItem dense value="">
                  <em>{select}</em>
                </MenuItem>
                <MenuItem dense value={1}>{"1 - " + difficult}</MenuItem>
                <MenuItem dense value={2}>{"2"}</MenuItem>
                <MenuItem dense value={3}>{"3"}</MenuItem>
                <MenuItem dense value={4}>{"4"}</MenuItem>
                <MenuItem dense value={5}>{"5 - " + easy}</MenuItem>
                <MenuItem dense value={0}>{unsure}</MenuItem>
              </Select>
            </FormControl>
          </span>
        </div>


        <div className={classes.questionContainer}>
          <span className={classes.questionText}>
            {placementQuestion}
          </span>

          <div className="add-shul-placement-options">
            <div component="fieldset" className={classes.placementGroupContainer} size="small" >
              <Typography variant="body1" component="h2" gutterBottom className={classes.placementGroupHeader}>
                {sameFloor}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={this.state.isCenteredVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}}value={"centered"}  color="primary" size="small"/>}
                  label={centeredMechitza}
                  className={classes.formControlLabel}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.isSameFloorSideVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"sameFloorSide"}  color="primary" size="small"/>}
                  label={side}
                  className={classes.formControlLabel}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.isSameFloorBackVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"sameFloorBack"}  color="primary" size="small"/>}
                  label={back}
                  className={classes.formControlLabel}
                />
              </FormGroup>
            </div>
            <div component="fieldset" className={classes.placementGroupContainer} size="small" >
              <Typography variant="body1" component="h2" gutterBottom className={classes.placementGroupHeader}>
                {elevated}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={this.state.isSameFloorElevatedVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"sameFloorElevated"}  color="primary" size="small"/>}
                  label={elevated}
                  className={classes.formControlLabel}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.isSameFloorLevelVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"sameFloorLevel"}  color="primary" size="small"/>}
                  label={levelWithMens} 
                  className={classes.formControlLabel}
                />
              </FormGroup>
            </div>
            <div component="fieldset" className={classes.placementGroupContainer} size="small" >
              <Typography variant="body1" component="h2" gutterBottom className={classes.placementGroupHeader}>
                {balcony}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={this.state.isBalconySideVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"balconySide"}  color="primary" size="small"/>}
                  label={side}
                  className={classes.formControlLabel}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.isBalconyBackVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"balconyBack"}  color="primary" size="small"/>}
                  label={back}
                  className={classes.formControlLabel}
                />
              </FormGroup>
            </div>
            <div component="fieldset" className={classes.placementGroupContainer} size="small" >
              <Typography variant="body1" component="h2" gutterBottom className={classes.placementGroupHeader}>
                {noWomensSection}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={this.state.isOnlyMenVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"onlyMen"}  color="primary" size="small"/>}
                  label={onlyMens}
                  className={classes.formControlLabel}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.isMixedSeatingVals[key]} onChange={(e) => {this.handleCheckboxInput(e, key)}} value={"mixedSeating"}  color="primary" size="small"/>}
                  label={mixedSeating}
                  className={classes.formControlLabel}
                />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
     
    </div>});

    return (
      <div>

        <Paper className={classes.paper} id="add-shul-paper" elevation={0} square>
          <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
            {addShul}
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom className={classes.sectionHeader}>
            {generalInfo}
          </Typography>

          <div className={classes.questionGroupContainer}>

            <div className={classes.questionContainer}>
              <span className={classes.questionText}>
                {identification}:
              </span>
              <div className={classes.inputBuffer}></div>
              <div className={classes.inputBuffer}></div>
              <div className={classes.inputBuffer}></div>
              <span className={classes.inputContainer}>
                <span className={classes.textBuffer}>
                  {identification}:
                </span>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <TextField id="shul-name-input" label={shulName} required size='small' 
                    onChange={(e) => {this.handleTextInput(e, 'shulName')}} value={this.state.shulName} 
                    onFocus={(e) => {this.setFocusedInput(e, 'shulName')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    InputProps={{
                      className: classes.textField,
                    }}
                    InputLabelProps={{
                      style: {
                        ...(!(this.state.focusedInput === 'shulName' || this.state.shulName) && { top: `${inputLabelOffset}px` }),
                      },
                      disableAnimation: true
                    }}
                  />
                </FormControl>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <TextField id="nussach-input" label={nussach} size='small'
                    onChange={(e) => {this.handleTextInput(e, 'nussach')}} value={this.state.nussach}
                    onFocus={(e) => {this.setFocusedInput(e, 'nussach')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    InputProps={{
                      className: classes.textField
                    }}
                    InputLabelProps={{
                      style: {
                        ...(!(this.state.focusedInput === 'nussach' || this.state.nussach) && { top: `${inputLabelOffset}px` }),
                      },
                      disableAnimation: true
                    }}
                  />
                </FormControl>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <TextField id="denomination-input" label={denomination} size='small'
                    onChange={(e) => {this.handleTextInput(e, 'denomination')}} value={this.state.denomination}
                    onFocus={(e) => {this.setFocusedInput(e, 'denomination')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    InputProps={{
                      className: classes.textField
                    }}
                    InputLabelProps={{
                      style: {
                        ...(!(this.state.focusedInput === 'denomination' || this.state.denomination) && { top: `${inputLabelOffset}px` }),
                      },
                      disableAnimation: true
                    }}
                  />
                </FormControl>
              </span>
            </div>

            <div className={classes.questionContainer}>
              <span className={classes.questionText}>
                {location}:
              </span>
              <div className={classes.inputBuffer}></div>
              <div className={classes.inputBuffer}></div>
              <div className={classes.inputBuffer}></div>
              <span className={classes.inputContainer}>
                <span className={classes.textBuffer}>
                  {location}:
                </span>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <InputLabel id="add-shul-country-label"
                    style={
                      { top: `${(this.state.focusedInput === 'country' || this.state.selCountry) ? "0" : inputLabelOffset}px` }
                    }
                    disableAnimation={true}
                  >
                    {country}
                  </InputLabel>
                  <Select
                    labelId="add-shul-country-label"
                    id="add-shul-country-select"
                    value={this.state.selCountry}
                    onChange={(e) => {this.handleCountrySelect(e)}}
                    onFocus={(e) => {this.setFocusedInput(e, 'country')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    className={classes.select}
                  >
                    {countries}
                  </Select>
                </FormControl>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <InputLabel id="add-shul-region-label"
                    style={
                      { top: `${(this.state.focusedInput === 'region' || this.state.selRegion) ? "0" : inputLabelOffset}px` }
                    }
                    disableAnimation={true}
                  >
                    {stateOrRegion}
                  </InputLabel>
                  <Select
                    labelId="add-shul-region-label"
                    id="add-shul-region-select"
                    value={this.state.selRegion}
                    onChange={(e) => {this.handleRegionSelect(e)}}
                    onFocus={(e) => {this.setFocusedInput(e, 'region')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    className={classes.select}
                    disabled={regionsDisabled}
                  >
                    {regions}
                  </Select>
                </FormControl>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <InputLabel id="add-shul-city-label"
                    style={
                      { top: `${(this.state.focusedInput === 'city' || this.state.selCity) ? "0" : inputLabelOffset}px` }
                    }
                    disableAnimation={true}
                  >
                    {city}
                  </InputLabel>
                  <Select
                    labelId="add-shul-city-label"
                    id="add-shul-city-select"
                    value={this.state.selCity}
                    onChange={(e) => {this.handleCitySelect(e)}}
                    onFocus={(e) => {this.setFocusedInput(e, 'city')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    className={classes.select}
                    disabled={citiesDisabled}
                  >
                    {cities}
                  </Select>
                </FormControl>
              </span>
            </div>

            <div className={classes.questionContainer}>
              <span className={classes.questionText}>
                {femaleLeadershipQuestion}
              </span>
              <div className={classes.inputBuffer}></div>
              <span className={classes.inputContainer}>
                <span className={classes.textBuffer}>
                  {femaleLeadershipQuestion}:
                </span>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <InputLabel id="add-shul-female-leadership-label"
                    style={{
                      top: `${inputLabelOffset}px`,
                      visibility: `${(this.state.focusedInput === 'femaleLeadership' || typeof(this.state.femaleLeadership) === 'number') ? "hidden" : "visible"}`
                    }}
                    disableAnimation={true}
                  >
                    {select}
                  </InputLabel>
                  <Select
                    labelId="add-shul-female-leadership-label"
                    id="add-shul-female-leadership-select"
                    value={this.state.femaleLeadership}
                    onChange={(e) => {this.handleSelectInput(e, 'femaleLeadership')}}
                    onFocus={(e) => {this.setFocusedInput(e, 'femaleLeadership')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    className={classes.select}
                  >
                    <MenuItem dense value={1}>{yes}</MenuItem>
                    <MenuItem dense value={2}>{no}</MenuItem>
                    <MenuItem dense value={0}>{unsure}</MenuItem>
                  </Select>
                </FormControl>
              </span>
            </div>

            <div className={classes.questionContainer}>
              <span className={classes.questionText}>
                {kaddishWithMenQuestion}
              </span>
              <div className={classes.inputBuffer}></div>
              <span className={classes.inputContainer}>
                <span className={classes.textBuffer}>
                  {kaddishWithMenQuestion}:
                </span>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <InputLabel id="add-shul-kaddish-with-men-label"
                    style={{
                      top: `${inputLabelOffset}px`,
                      visibility: `${(this.state.focusedInput === 'kaddishWithMen' || typeof(this.state.kaddishWithMen) === 'number') ? "hidden" : "visible"}`
                    }}
                    disableAnimation={true}
                  >
                    {select}
                  </InputLabel>
                  <Select
                    labelId="add-shul-kaddish-with-men-label"
                    id="add-shul-kaddish-with-men-select"
                    value={this.state.kaddishWithMen}
                    onChange={(e) => {this.handleSelectInput(e, 'kaddishWithMen')}}
                    onFocus={(e) => {this.setFocusedInput(e, 'kaddishWithMen')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    className={classes.select}
                  >
                    <MenuItem dense value={1}>{yes}</MenuItem>
                    <MenuItem dense value={2}>{no}</MenuItem>
                    <MenuItem dense value={0}>{unsure}</MenuItem>
                  </Select>
                </FormControl>
              </span>
            </div>

            <div className={classes.questionContainer}>
              <span className={classes.questionText}>
                {kaddishAloneQuestion}
              </span>
              <div className={classes.inputBuffer}></div>
              <span className={classes.inputContainer}>
                <span className={classes.textBuffer}>
                  {kaddishAloneQuestion}:
                </span>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <InputLabel id="add-shul-kaddish-alone-label"
                    style={{
                      top: `${inputLabelOffset}px`,
                      visibility: `${(this.state.focusedInput === 'kaddishAlone' || typeof(this.state.kaddishAlone) === "number") ? "hidden" : "visible"}`
                    }}
                    disableAnimation={true}
                  >
                    {select}
                  </InputLabel>
                  <Select
                    labelId="add-shul-kaddish-alone-label"
                    id="add-shul-kaddish-alone-select"
                    value={this.state.kaddishAlone}
                    onChange={(e) => {this.handleSelectInput(e, 'kaddishAlone')}}
                    onFocus={(e) => {this.setFocusedInput(e, 'kaddishAlone')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    className={classes.select}
                  >
                    <MenuItem dense value={1}>{yes}</MenuItem>
                    <MenuItem dense value={2}>{no}</MenuItem>
                    <MenuItem dense value={0}>{unsure}</MenuItem>
                    <MenuItem dense value={3}>{manAlwaysKaddish}</MenuItem>
                  </Select>
                </FormControl>
              </span>
            </div>

            <div className={classes.questionContainer}>
              <span className={classes.questionText}>
                {childcareQuestion}
              </span>
              <div className={classes.inputBuffer}></div>
              <span className={classes.inputContainer}>
                <span className={classes.textBuffer}>
                  {childcareQuestion}:
                </span>
                <FormControl className={classes.textSelectFormControl} size="small" >
                  <InputLabel id="add-shul-childcare-label"
                    style={{
                      top: `${inputLabelOffset}px`,
                      visibility: `${(this.state.focusedInput === 'childcare' || typeof(this.state.childcare) === "number") ? "hidden" : "visible"}`
                    }}
                    disableAnimation={true}
                  >
                    {select}
                  </InputLabel>
                  <Select
                    labelId="add-shul-childcare-label"
                    id="add-shul-childcare-select"
                    value={this.state.childcare}
                    onChange={(e) => {this.handleSelectInput(e, 'childcare')}}
                    onFocus={(e) => {this.setFocusedInput(e, 'childcare')}}
                    onBlur ={(e) => {this.setFocusedInput(e, null)}}
                    className={classes.select}
                  >
                    <MenuItem dense value={1}>{yes}</MenuItem>
                    <MenuItem dense value={2}>{no}</MenuItem>
                    <MenuItem dense value={0}>{unsure}</MenuItem>
                  </Select>
                </FormControl>
              </span>
            </div>

          </div>


          <Typography variant="h4" component="h2" className={classes.sectionHeader} style={{marginTop: '30px'}}>
            {rooms}
          </Typography>

          {roomSections}

          <div className={classes.heroButtonsContainer}>

            <Button variant="outlined" color="primary" size="large" className={classes.heroButton} onClick={(e) => {this.addRoom(e)}}>
              <i className="fas fa-plus"></i> &nbsp; {addRoom}
            </Button>

            <Button variant="outlined" color="primary" size="large" className={classes.heroButton} onClick={(e) => {this.submit(e)}}>
              <i className="fas fa-paper-plane"></i> &nbsp; {submit}
            </Button>

          </div>


        </Paper>

        <Dialog
          open={this.state.deleteDialogIsOpen}
          onClose={(e) => {this.closeDeleteRoomDialog()}}
          aria-labelledby="delete-room-dialog"
        >
          <DialogTitle id="delete-room-dialog">{areYouSure}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {roomNameToDelete} {willBeDeleted}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={(e) => {this.closeDeleteRoomDialog()}} color="primary">
              {cancel}
            </Button>
            <Button autoFocus onClick={(e) => {this.deleteRoom(e, this.state.roomToDelete)}} color="primary">
              {deleteRoom}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.duplicatesQuestionDialogIsOpen}
          onClose={(e) => {this.closeDuplicatesQuestion()}}
          aria-labelledby="check-for-duplicates-dialog"
        >
          <DialogTitle id="check-for-duplicates-dialog">{checkIfShulListed}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Table className={classes.table} aria-label="simple table" size="small" >
                <TableBody>
                  {this.state.savedShulRows.map(shul => (
                    <TableRow key={shul.name}>
                      <TableCell component="th" scope="row" className={classes.duplicateShulText}>
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
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" size="medium" onClick={() => {this.closeDuplicatesQuestion()}} >
              {shulNotListed}
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

AddShul.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(AddShul));