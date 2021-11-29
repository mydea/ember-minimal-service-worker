'use strict';
const fs = require('fs');

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    let app = this._findHost();

    let options = app.options?.['ember-minimal-service-worker'] || {};

    let shouldInclude =
      typeof options.include !== 'undefined'
        ? options.include
        : app.env === 'production';

    let unregisterIfExcluded =
      options.unregisterIfExcluded !== 'undefined'
        ? options.unregisterIfExcluded
        : true;

    let unregisterOthers = Boolean(options.unregisterOthers);

    this._shouldInclude = shouldInclude;
    this._unregisterIfExcluded = unregisterIfExcluded;
    this._unregisterOthers = unregisterOthers;

    this._fixFingerprintingSettings();
  },

  contentFor(type) {
    if (type !== 'body-footer') {
      return;
    }

    if (this._shouldInclude) {
      let content = fs.readFileSync('./lib/register-sw.html', 'utf-8');

      if (this._unregisterOthers) {
        let unregisterContent = fs.readFileSync(
          './lib/unregister-others.html',
          'utf-8'
        );
        return `${content}\n${unregisterContent}`;
      }

      return content;
    } else if (this._unregisterIfExcluded) {
      let content = fs.readFileSync('./lib/unregister-all.html', 'utf-8');
      return content;
    }
  },

  _fixFingerprintingSettings() {
    let app = this._findHost();

    // Fix fingerprinting options to work
    if (
      app.options?.fingerprint?.enabled !== false &&
      app.project.findAddonByName('broccoli-asset-rev')
    ) {
      let fingerprintOptions = app.options.fingerprint || {};

      // Ensure sw.js file is not fingerprinted
      let exclude = fingerprintOptions.exclude || [];
      if (!exclude.includes('ember-minimal-service-worker/sw.js')) {
        exclude.push('ember-minimal-service-worker/sw.js');

        fingerprintOptions.exclude = exclude;
        app.options.fingerprint = fingerprintOptions;
      }
    }
  },
};
