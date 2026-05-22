/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Hostplus site-wide cleanup.
 * Removes non-authorable content (header, footer, navigation, chat widgets,
 * tracking iframes, modals, and service elements).
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Chat widget and overlay - blocks parsing visibility
    // Found: <div class="cx-widget cx-side-button-group"> (line 9)
    // Found: <div id="chatConfirmOverlay" class="overlay"> (line 15)
    WebImporter.DOMUtils.remove(element, [
      '.cx-widget.cx-side-button-group',
      '#chatConfirmOverlay',
    ]);

    // App root mode container - empty div at top of body (line 2)
    // Found: <div id="app-root-mode">
    WebImporter.DOMUtils.remove(element, ['#app-root-mode']);

    // Body overlay used for navigation flyouts (line 527)
    // Found: <div class="js-body-overlay">
    WebImporter.DOMUtils.remove(element, ['.js-body-overlay']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header experience fragment - entire site header/navigation (line 35)
    // Found: <div class="cmp-experiencefragment cmp-experiencefragment--header">
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--header']);

    // Header element fallback (line 39)
    // Found: <header class="cmp-header sticky">
    WebImporter.DOMUtils.remove(element, ['header']);

    // Footer element (line 4393)
    // Found: <footer> inside .footer.container.responsivegrid
    WebImporter.DOMUtils.remove(element, ['footer', '.footer.container.responsivegrid']);

    // Genesys messenger widgets (lines 4541-4549)
    // Found: <div id="genesys-thirdparty"> and <div id="genesys-messenger" class="genesys-app">
    WebImporter.DOMUtils.remove(element, ['#genesys-thirdparty', '#genesys-messenger']);

    // Tracking iframes - DoubleClick (line 4539)
    // Found: <iframe src="https://8812987.fls.doubleclick.net/...">
    WebImporter.DOMUtils.remove(element, ['iframe[src*="doubleclick"]']);

    // Cloud service / Test & Target containers (lines 213, 314, 352, etc.)
    // Found: <div class="cloudservice testandtarget">
    WebImporter.DOMUtils.remove(element, ['.cloudservice.testandtarget']);

    // Modal wrapper (line 4537)
    // Found: <div class="modal-wrapper">
    WebImporter.DOMUtils.remove(element, ['.modal-wrapper']);

    // Navigation flyout modals in header (line 125-126)
    // Found: <div class="modal__container cmp-navigation__flyout__container">
    WebImporter.DOMUtils.remove(element, ['.modal__container.cmp-navigation__flyout__container']);

    // Stray link elements in DOM (line 3470)
    // Found: <link href="/etc.clientlibs/foundation/clientlibs/main...">
    WebImporter.DOMUtils.remove(element, ['link']);

    // Noscript and stray iframes
    WebImporter.DOMUtils.remove(element, ['noscript', 'iframe']);
  }
}
