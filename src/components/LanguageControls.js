import React from 'react';
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
    color: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 500,
  },
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
      options: { renderToStaticMarkup}
    });
  }

  componentDidMount(){
    this.props.setActiveLanguage("en");
  }

  handleLanguageChange (e, val) {
    var newLangCode = val.props.value;
    this.props.setActiveLanguage(newLangCode);
  }

  render() {
    const { classes } = this.props;
    var languageCode = "";
    if(this.props.activeLanguage) {
      languageCode = this.props.activeLanguage.code;
    }

    return (
      <div>
        <header>
          <FormControl>
            <Select
              value={languageCode}
              onChange={(e, val) => {this.handleLanguageChange(e, val)}}
              className={classes.select}
            >
              <MenuItem value={"en"}><img src="/usa-flag.png" alt="USA flag" className="language-flag-icon" /> EN </MenuItem>
              <MenuItem value={"he"}><img src="/israel-flag.png" alt="Israel flag" className="language-flag-icon" /> עב </MenuItem>
            </Select>
          </FormControl>
        </header>
      </div>
    );
  }
}

LanguageControls.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(LanguageControls));
