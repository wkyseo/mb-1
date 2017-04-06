let language = null;
const DEFAULT_LANG = 'en-us';

exports.getTranslation = function(key) {
  if(!language) {
    // choose language by browser language.
    language = navigator.language.toLowerCase() || DEFAULT_LANG;
  }
  let defaultPkg = require('./' + DEFAULT_LANG);
  let pkg = require('./' + language) || defaultPkg;
  return pkg[key] || defaultPkg[key];
};