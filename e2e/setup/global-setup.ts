// Ensure TransformStream is available before Playwright loads
(async function applyPolyfill() {
	try {
		const m = await import('web-streams-polyfill');
		const TransformStream = m.TransformStream || (m.default && m.default.TransformStream);
	if (TransformStream && typeof globalThis.TransformStream === 'undefined') {
		// @ts-expect-error - assigning polyfill to globalThis
		globalThis.TransformStream = TransformStream;
	}
  } catch (e) {
	console.warn('Could not apply web-streams-polyfill in global-setup:', String(e));
  }
})();