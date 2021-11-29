'use strict';

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

    this._shouldInclude = shouldInclude;
    this._unregisterIfExcluded = unregisterIfExcluded;

    this._fixFingerprintingSettings();
  },

  contentFor(type) {
    if (type !== 'body-footer') {
      return;
    }

    if (this._shouldInclude) {
      return `<script data-sw-registration>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./ember-minimal-service-worker/sw.js')
    .catch((error) => {
      console.error('Could not setup service worker: ' + error);
    });
  }
</script>`;
    } else if (this._unregisterIfExcluded) {
      return `<script data-sw-unregistration>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
</script>`;
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
