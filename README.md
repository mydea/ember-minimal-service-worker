# ember-minimal-service-worker

Install a minimal service worker, in order for your app to be eligible to be added to the homescreen.

The installed service worker does nothing, and is only there to [make Chrome happy](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen#how_do_you_make_an_app_a2hs-ready) and allow "Add to home screen".

## Compatibility

- Ember.js v3.20 or above
- Ember CLI v3.20 or above
- Node.js v12 or above

## Installation

```
ember install ember-minimal-service-worker
```

## Usage

By default, it will install the minimal service worker when being built in production environment. You can overwrite this behavior:

```js
// ember-cli-build.js

let app = new EmberAddon(defaults, {
  'ember-minimal-service-worker': {
    // If this is true, the service worker will be loaded
    include: false,
  },
});
```

In addition, when the service worker is _not_ included (=usually in dev mode), all service workers will be unregistered to avoid unexpected development behavior. You can overwrite this behavior by setting `unregisterIfExcluded: true` in the config.

### Caching

Allthough this service worker does nothing, it is still a good idea to ensure the service worker _itself_ is not cached.
For example, if you use `ember-cli-deploy-s3` to upload your assets, you could use a configuration like this:

```js
let uncachedFilesGlobPattern = 'ember-minimal-service-worker/sw.js';

let ENV = {
  's3-assets': {
    fileIgnorePattern: uncachedFilesGlobPattern,
    bucket: config.bucket,
    region: config.region,
  },

  's3-assets-no-cache': {
    filePattern: uncachedFilesGlobPattern,
    cacheControl: 'no-cache, no-store, must-revalidate',
    bucket: config.bucket,
    region: config.region,
    manifestPath: null,
    allowOverwrite: true,
  },
};
```

This way, if you ever decide to ship a _proper_ service worker, you will not have to deal with unexpired sw.js files.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
