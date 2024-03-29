import React, {Component} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import globalTranslations from '../translations/global.json';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles"
import PropTypes from 'prop-types';

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
  select: {
    color: 'white',
    fontFamily: 'inherit',
    fontWeight: 400,
    marginTop: '2px',
    paddingTop: '2px',
    paddingBottom: '4px',
  },
  drawerSelect: {
    color: '#757575 !important'
  },
});

class LanguageControls extends Component {

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
    // if(window.localStorage.ezNashDBLang){
    //   defaultLangCode = window.localStorage.ezNashDBLang;
    // } else {
      if (this.getCountryCode() === "IL"){
        defaultLangCode = "he";
      } else {
        defaultLangCode = "en";
      }
    // }
    return defaultLangCode;
  }

  handleLanguageChange (e, val) {
    var newLangCode = val.props.value;
    if (newLangCode !== this.props.activeLanguage.code) {
      this.props.setActiveLanguage(newLangCode);
      localStorage.setItem('ezNashDBLang', newLangCode);
    }
  }

  getCountryCode() {
    fetch('https://ipapi.co/json/').then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((response) => {
      return response.country;
    })
    .catch((error) => {
      return "US"
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.activeLanguage && prevProps.activeLanguage !== this.props.activeLanguage){
      var dir = this.props.activeLanguage.code === 'en' ? 'ltr' : 'rtl';
      var body = document.getElementsByTagName('body')[0];
      body.dir = dir;

      var title = this.props.activeLanguage.code === 'en' ? 'The Ezrat Nashim Database' : 'מאגר הנתונים עזרת נשים';
      var titleElem = null; 
      if(document.getElementsByTagName('title').length > 0){
        titleElem = document.getElementsByTagName('title')[0];
        titleElem.innerHTML = title;
      } else {
        titleElem = document.createElement('title');
        titleElem.innerHTML = title;
        var headElem = document.getElementsByTagName('head')[0];
        headElem.appendChild(titleElem);
      }

    }
  }

  render() {
    const { classes } = this.props;
    var languageCode = "";
    if(this.props.activeLanguage) {
      languageCode = this.props.activeLanguage.code;
    }

    var selectClassName = classes.select;

    if (this.props.parent === 'drawer') {
      selectClassName += " " + classes.drawerSelect;
    }

    return (
      <div id="language-controls-div">
        <FormControl className={selectClassName}>
          <Select
            value={languageCode}
            onChange={(e, val) => {this.handleLanguageChange(e, val)}}
            classes={{
              select: selectClassName,
            }}
            style={{fontSize: `${this.props.fontSize}px`}}
          >
            <MenuItem value={"en"} >
              <img src="/usa-flag.png" alt="USA flag" className="language-flag-icon" />&nbsp;EN
            </MenuItem>
            <MenuItem value={"he"}>
              <img src="/israel-flag.png"alt="Israel flag" className="language-flag-icon" />&nbsp;עב
            </MenuItem>
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
