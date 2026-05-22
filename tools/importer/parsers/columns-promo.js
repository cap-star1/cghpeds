/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo
 * Base block: columns
 * Source: https://hostplus.com.au/advisers
 * Generated: 2026-05-21
 *
 * Extracts a promotional campaign banner with image on one side
 * and heading + description + CTA on the other side into a Columns block.
 */
export default function parse(element, { document }) {
  // Extract the image from the image container
  const image = element.querySelector('.cmp-promote-campaign__image-container img.cmp-image__image, .cmp-promote-campaign__image-container img, .cmp-image img');

  // Extract the heading
  const heading = element.querySelector('.cmp-promote-campaign__heading .cmp-title__text, .cmp-promote-campaign__content-details h3, .cmp-promote-campaign__content-details h2');

  // Extract description paragraphs from the text content area
  const descContainer = element.querySelector('.cmp-promote-campaign__desc .cmp-text, .cmp-promote-campaign__desc');
  const descElements = descContainer ? Array.from(descContainer.querySelectorAll(':scope > p')) : [];

  // Extract CTA button link from the button container
  const ctaLink = element.querySelector('.cmp-promote-campaign__button-container a.cmp-button__clickable-area, .cmp-promote-campaign__button-container a');

  // Build the image column cell
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  // Build the content column cell (heading + description + CTA)
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }
  if (descElements.length > 0) {
    contentCell.push(...descElements);
  } else if (descContainer) {
    contentCell.push(descContainer);
  }
  if (ctaLink) {
    contentCell.push(ctaLink);
  }

  // Build cells: single row with two columns (image | content)
  const cells = [
    [imageCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
