/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Base block: cards
 * Source selector: .crosslinks .cmp-cross-link__list
 * Source: https://hostplus.com.au/advisers
 * Generated: 2026-05-21
 *
 * Extracts product cross-link cards from the source page.
 * Each card has an icon/image, a title, and an optional description,
 * all wrapped in a link to the product page.
 *
 * Target structure (from block library):
 * | Cards |
 * |-------|
 * | ![Icon](...)  |
 * | **Title**     |
 * | Description   |
 *
 * Each row in the cells array represents one card.
 * Each card cell contains: icon image, linked title, and optional description.
 */
export default function parse(element, { document }) {
  // Extract all card items from the cross-link list
  const cardItems = element.querySelectorAll('.cmp-cross-link__item, .cmp-list__item');

  const cells = [];

  cardItems.forEach((item) => {
    // Each card is wrapped in a link
    const link = item.querySelector('a.cmp-cross-link__link, a');
    const href = link ? link.getAttribute('href') : '';

    // Icon/mnemonic image for the card
    const icon = item.querySelector('img.cmp-cross-link__mnemonic, .cmp-cross-link__teaser-content > img');

    // Title text inside h4 (or h3/h5 as fallback)
    const titleEl = item.querySelector('.cmp-title__text, h4, h3, h5');

    // Description text (may be empty)
    const descriptionEl = item.querySelector('.cmp-cross-link__title-description > .cmp-text, .cmp-cross-link__teaser > .cmp-text');
    const descriptionText = descriptionEl ? descriptionEl.textContent.trim() : '';

    // Build the card cell content
    const cardContent = [];

    // Add icon image if present
    if (icon) {
      const img = document.createElement('img');
      img.src = icon.getAttribute('src') || '';
      img.alt = icon.getAttribute('alt') || '';
      cardContent.push(img);
    }

    // Add title as a link to preserve the card's href
    if (titleEl) {
      const linkedTitle = document.createElement('a');
      linkedTitle.href = href || '';
      linkedTitle.textContent = titleEl.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(linkedTitle);
      cardContent.push(strong);
    }

    // Add description if present and non-empty
    if (descriptionText) {
      const desc = document.createElement('p');
      desc.textContent = descriptionText;
      cardContent.push(desc);
    }

    if (cardContent.length > 0) {
      cells.push(cardContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
