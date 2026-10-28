// Cursor's embedded browser stamps data-cursor-ref onto parsed DOM nodes.
// The server HTML does not contain that attribute, so React reports a
// hydration mismatch. Strip it once parsing finishes and before Next.js hydrates.
export const stripCursorRefScript = `(function () {
  var nodes = document.querySelectorAll("[data-cursor-ref]");
  for (var i = 0; i < nodes.length; i += 1) nodes[i].removeAttribute("data-cursor-ref");
})();`;
