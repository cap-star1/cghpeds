/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-resource
 * Base block: cards
 * Source: https://hostplus.com.au/advisers
 * Selector: .cmp-resources-container-content-hero
 * Generated: 2026-05-21
 *
 * Extracts resource card items with icon/image, title, and optional description.
 * Each card item is a linked resource with an image and heading text.
 */
export default function parse(element, { document }) {
  // Each card item is a .cmp-resources-container-content-hero__item
  const items = element.querySelectorAll('.cmp-resources-container-content-hero__item, .link-resource');

  const cells = [];

  items.forEach((item) => {
    // Each item is wrapped in a link
    const link = item.querySelector('a.cmp-resource-item, a');
    // Get the image/icon
    const image = item.querySelector('.cmp-resource-item__image img, .cmp-image__image, img');
    // Get the title text
    const titleEl = item.querySelector('.cmp-title__text');

    // Build cell content for this card row
    const cellContent = [];

    // Add image if present
    if (image) {
      cellContent.push(image);
    }

    // Add title - wrap in a link if available to preserve navigation
    if (titleEl && link) {
      const linkedTitle = document.createElement('a');
      linkedTitle.href = link.href;
      linkedTitle.textContent = titleEl.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(linkedTitle);
      cellContent.push(strong);
    } else if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      cellContent.push(strong);
    }

    // Add description if present (not in current source, but handle for variation)
    const description = item.querySelector('.cmp-resource-item__description, .cmp-text, p:not(.cmp-title__text)');
    if (description) {
      cellContent.push(description);
    }

    if (cellContent.length > 0) {
      cells.push(cellContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
  element.replaceWith(block);
}
