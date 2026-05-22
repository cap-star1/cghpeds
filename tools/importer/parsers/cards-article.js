/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article
 * Base block: cards
 * Source: https://hostplus.com.au/advisers
 * Selector: .page-list .cmp-page-list
 * Generated: 2026-05-21
 *
 * Source structure:
 *   .cmp-page-list > ul.cmp-page-list__list > li.cmp-page-list-item
 *     > a.cmp-page-list-item__link[href]
 *       > .cmp-image > img.cmp-image__image
 *       > .cmp-page-list-item__content
 *         > .cmp-title > h3.cmp-title__text
 *         > .cmp-page-list-item__button > span.cmp-page-list-item__button-text
 *
 * Target structure (per card row): image, title, link
 */
export default function parse(element, { document }) {
  // Select all card list items
  const cardItems = element.querySelectorAll('li.cmp-page-list-item, .cmp-page-list-item');

  const cells = [];

  cardItems.forEach((item) => {
    // Each card is wrapped in a link
    const link = item.querySelector('a.cmp-page-list-item__link, a[class*="page-list-item"]');
    const href = link ? link.getAttribute('href') : '';

    // Extract image
    const img = item.querySelector('img.cmp-image__image, img');

    // Extract title
    const titleEl = item.querySelector('h3.cmp-title__text, .cmp-title__text, h3, h4');
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // Extract CTA text
    const ctaSpan = item.querySelector('.cmp-page-list-item__button-text, .cmp-page-list-item__button span');
    const ctaText = ctaSpan ? ctaSpan.textContent.trim() : 'Read more';

    // Build cell content for this card row
    const cellContent = [];

    // Add image if present
    if (img) {
      const imgClone = img.cloneNode(true);
      cellContent.push(imgClone);
    }

    // Add title as a heading
    if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = titleText;
      cellContent.push(heading);
    }

    // Add CTA link
    if (href) {
      const ctaLink = document.createElement('a');
      ctaLink.setAttribute('href', href);
      ctaLink.textContent = ctaText;
      cellContent.push(ctaLink);
    }

    if (cellContent.length > 0) {
      cells.push(cellContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
