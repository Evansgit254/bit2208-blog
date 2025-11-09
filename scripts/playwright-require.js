// Preload shim to ensure TransformStream is available before Playwright loads
(function applyWebStreamsPolyfill() {
  function apply(ponyfill) {
    const TransformStream = (ponyfill && (ponyfill.TransformStream || (ponyfill.default && ponyfill.default.TransformStream)));
    if (TransformStream && typeof globalThis.TransformStream === 'undefined') {
      globalThis.TransformStream = TransformStream;
    }
  }

  try {
    if (typeof require === 'function') {
      // CommonJS environment
      const ponyfill = require('web-streams-polyfill');
      apply(ponyfill);
      return;
    }
  } catch (err) {
    // fallthrough to dynamic import
  }

  // Attempt dynamic import (works in ESM contexts)
  try {
    import('web-streams-polyfill')
      .then((m) => apply(m))
      .catch((e) => {
        console.warn('Could not apply web-streams-polyfill preload (dynamic import):', e && e.message);
      });
  } catch (e) {
    console.warn('Could not apply web-streams-polyfill preload:', e && e.message);
  }
})();
