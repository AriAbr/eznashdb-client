import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import globalTranslations from '../translations/global.json';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles"
import PropTypes from 'prop-types';
import $ from 'jquery';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  selectEng: {
    color: 'white',
    fontFamily: 'inherit',
    fontWeight: 500,
  },
  selectHeb: {
    color: 'white',
    fontFamily: 'inherit',
    fontWeight: 500,
    MozTransform: 'scaleX(-1)',
    WebkitTransform: 'scaleX(-1)',
    OTransform: 'scaleX(-1)',
    transform: 'scaleX(-1)',
    msFilter: 'fliph', /*IE*/
    filter: 'fliph', /*IE*/
  },
  selectMenuEng: {

  },
  selectMenuHeb: {
    color: 'white',
    fontFamily: 'inherit',
    fontWeight: 500,
    paddingRight: '0px',
    paddingLeft: '24px',
    MozTransform: 'scaleX(-1)',
    WebkitTransform: 'scaleX(-1)',
    OTransform: 'scaleX(-1)',
    transform: 'scaleX(-1)',
    msFilter: 'fliph', /*IE*/
    filter: 'fliph', /*IE*/
  }
});

class LanguageControls extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {

    };

    this.props.initialize({
      languages: [
        { name: 'English', code: 'en' },
        { name: 'Hebrew', code: 'he' },
      ],
      translation: globalTranslations,
      options: { renderToStaticMarkup, defaultLanguage: this.getDefaultLangCode()}
    });
  }

  getDefaultLangCode(){
    var defaultLangCode = "en";
    if('window.localStorage.ezNashDBLang'){
    //   defaultLangCode = window.localStorage.ezNashDBLang;
    // } else {
      if (this.getCountryCode() === "IL"){
        defaultLangCode = "he";
      } else {
        defaultLangCode = "en";
      }
    }
    return defaultLangCode;
  }

  handleLanguageChange (e, val) {
    var newLangCode = val.props.value;
    if (newLangCode !== this.props.activeLanguage.code) {
      this.props.setActiveLanguage(newLangCode);
      localStorage.setItem('ezNashDBLang', newLangCode);
    }
  }

  getElementText(response, elementName) {
    return response.getElementsByTagName(elementName)[0].innerHTML;
  }

  getCountryCode() {
      var countryCode = "";
      var ip = "";
      $.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
        var response  = JSON.stringify(data, null, 2);
        response  = JSON.parse(response);
        ip = response.ip;
        console.log(ip)
      });

      $.getJSON('http://www.geoplugin.net/json.gp?ip=' + ip, function(data) {
        var response  = JSON.stringify(data, null, 2);
        response  = JSON.parse(response);
        console.log(response)
        countryCode = response.geoplugin_countryCode;
        console.log("geoplugin_countryCode w/ ipify ip: " + countryCode);
      });

      $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
        var response  = JSON.stringify(data, null, 2);
        response  = JSON.parse(response);
        console.log(response)
        countryCode = response.geoplugin_countryCode;
        console.log("geoplugin_countryCode: " + countryCode);
      });

      return countryCode;
  }

  render() {
    const { classes } = this.props;
    var languageCode = "";
    if(this.props.activeLanguage) {
      languageCode = this.props.activeLanguage.code;
    }

    var selectClassName = classes.selectEng;
    var selectMenuClassName = classes.selectMenuEng;
    if(this.props.activeLanguage && this.props.activeLanguage.code === "he"){
      selectClassName = classes.selectHeb;
      selectMenuClassName = classes.selectMenuHeb;
    }

    return (
      <div id="language-controls-div">
        <FormControl className={selectClassName}>
          <Select
            value={languageCode}
            onChange={(e, val) => {this.handleLanguageChange(e, val)}}
            classes={{
              select: selectClassName,
              selectMenu: selectMenuClassName,
            }}
          >
            <MenuItem value={"en"}><img src="/usa-flag.png" alt="USA flag" className="language-flag-icon" /> EN </MenuItem>
            <MenuItem value={"he"}><img src="/israel-flag.png" alt="Israel flag" className="language-flag-icon" /> עב </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}

LanguageControls.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(LanguageControls));
