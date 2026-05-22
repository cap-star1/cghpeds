/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-dates variant.
 * Base block: tabs
 * Source: https://hostplus.com.au/advisers
 * Selector: .tabs.panelcontainer .cmp-tabs
 * Generated: 2026-05-21
 *
 * Source structure:
 *   .cmp-tabs
 *     ol.cmp-tabs__tablist
 *       li.cmp-tabs__tab (tab labels - original items have cmp-tabs__tab--hidden class)
 *     div.cmp-tabs__tabpanel (one per tab, content panels)
 *
 * Target structure (from library example):
 *   | Tabs |
 *   | Tab Label 1 |
 *   | Content for tab 1 |
 *   | Tab Label 2 |
 *   | Content for tab 2 |
 *   ... repeating for each tab
 */
export default function parse(element, { document }) {
  // Extract tab labels from the original tablist
  // The original tabs have the --hidden class (JS duplicates them for responsive UI)
  const tabList = element.querySelector('ol.cmp-tabs__tablist, ul.cmp-tabs__tablist');
  let tabItems = [];

  if (tabList) {
    // Prefer the original hidden tabs (before JS enhancement duplicates them)
    tabItems = Array.from(tabList.querySelectorAll(':scope > li.cmp-tabs__tab--hidden'));

    // Fallback: if no hidden tabs found, get all li.cmp-tabs__tab that are not
    // part of secondary tablist or "more" button UI
    if (tabItems.length === 0) {
      tabItems = Array.from(tabList.querySelectorAll(':scope > li.cmp-tabs__tab:not(.cmp-tabs__tab-selected):not(.cmp-tabs__tab-more)'));
    }

    // Final fallback: get all direct li children that have an id containing '-tab'
    if (tabItems.length === 0) {
      tabItems = Array.from(tabList.querySelectorAll(':scope > li[id*="-tab"]:not([id*="-tab-secondary"])'));
    }
  }

  // Extract tab panels (content for each tab)
  const tabPanels = Array.from(element.querySelectorAll(':scope > .cmp-tabs__tabpanel, :scope > div[role="tabpanel"]'));

  // Build cells: alternating tab label / tab content rows
  const cells = [];

  const tabCount = Math.max(tabItems.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    // Tab label row
    if (tabItems[i]) {
      const labelText = tabItems[i].textContent.trim();
      const labelEl = document.createElement('p');
      labelEl.textContent = labelText;
      cells.push([labelEl]);
    } else {
      // Fallback if panel exists but no matching tab label
      const labelEl = document.createElement('p');
      labelEl.textContent = `Tab ${i + 1}`;
      cells.push([labelEl]);
    }

    // Tab content row
    if (tabPanels[i]) {
      // Clone panel content to preserve all inner elements
      cells.push([tabPanels[i]]);
    } else {
      // If no panel content available, add empty placeholder
      const emptyEl = document.createElement('p');
      emptyEl.textContent = '';
      cells.push([emptyEl]);
    }
  }

  // If no tabs or panels were found, attempt a simpler extraction
  // from any child divs that might serve as tab content
  if (cells.length === 0) {
    const childDivs = Array.from(element.querySelectorAll(':scope > div:not(.cmp-tabs__tablist)'));
    childDivs.forEach((div, idx) => {
      const labelEl = document.createElement('p');
      labelEl.textContent = `Tab ${idx + 1}`;
      cells.push([labelEl]);
      cells.push([div]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-dates', cells });
  element.replaceWith(block);
}
