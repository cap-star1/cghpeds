/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-feature
 * Base block: columns
 * Source: https://hostplus.com.au/advisers
 * Selector: .content-media-block .cmp-content-media-block
 * Generated: 2026-05-21
 *
 * Layout: Two-column Columns block (image left, content right)
 * Left column: image; Right column: heading, description text, optional CTA links
 */
export default function parse(element, { document }) {
  // Column 1: Image from container1
  const image = element.querySelector('.cmp-content-media-block__container1 img.cmp-image__image, .cmp-content-media-block__container1 img');

  // Column 2: Content from container2
  const heading = element.querySelector('.cmp-content-block__heading .cmp-title__text, .cmp-content-media-block__container2 h2, .cmp-content-media-block__container2 h3');
  const textContainer = element.querySelector('.cmp-content-block__text .cmp-text, .cmp-content-media-block__container2 .cmp-text');
  const descriptions = textContainer ? Array.from(textContainer.querySelectorAll('p')) : [];
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-content-media-block__container2 a.cmp-button, .cmp-content-media-block__container2 a[class*="button"], .cmp-content-media-block__container2 a[class*="cta"], .cmp-content-block a'));

  // Build left column cell (image)
  const leftCell = [];
  if (image) {
    leftCell.push(image);
  }

  // Build right column cell (heading + description + CTA)
  const rightCell = [];
  if (heading) {
    rightCell.push(heading);
  }
  descriptions.forEach((p) => {
    if (p.textContent.trim()) {
      rightCell.push(p);
    }
  });
  ctaLinks.forEach((link) => {
    rightCell.push(link);
  });

  // Single row with two columns matching the library example
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
