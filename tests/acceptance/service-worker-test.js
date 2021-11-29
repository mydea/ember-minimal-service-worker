import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import config from 'dummy/config/environment';

// This is based on running the tests/app with EXCLUDE_SW=true / UNREGISTER_OTHERS=true or not
const { isExcludeMode, shouldUnregisterOthers } = config;

module('Acceptance | service worker', function (hooks) {
  setupApplicationTest(hooks);

  test(`it correctly ${
    isExcludeMode ? 'unregisters' : 'registers'
  }`, async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');

    assert
      .dom('[data-sw-registration]', document.body)
      .exists({ count: isExcludeMode ? 0 : 1 });
    assert
      .dom('[data-sw-unregister-all]', document.body)
      .exists({ count: isExcludeMode ? 1 : 0 });
    assert
      .dom('[data-sw-unregister-others]', document.body)
      .exists({ count: shouldUnregisterOthers && !isExcludeMode ? 1 : 0 });
  });
});
