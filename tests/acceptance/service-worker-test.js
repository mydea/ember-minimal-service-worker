import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import config from 'dummy/config/environment';

module('Acceptance | service worker', function (hooks) {
  setupApplicationTest(hooks);

  test('it correctly registers/unregisters', async function (assert) {
    // This is based on running the tests/app with EXCLUDE_SW=true or not
    let { isExcludeMode } = config;

    await visit('/');

    assert.strictEqual(currentURL(), '/');

    assert
      .dom('[data-sw-registration]', document.body)
      .exists({ count: isExcludeMode ? 0 : 1 });
    assert
      .dom('[data-sw-unregistration]', document.body)
      .exists({ count: isExcludeMode ? 1 : 0 });
  });
});
