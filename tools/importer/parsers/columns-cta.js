/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-cta
 * Base block: columns
 * Source: https://hostplus.com.au/advisers
 * Selector: .cta .cmp-cta
 * Generated: 2026-05-21
 *
 * Transforms a CTA block with heading, description, CTA link, and optional image
 * into a Columns block with two columns: content (left) and image (right).
 *
 * Target structure (from library example):
 * | Columns |
 * |---------|---------|
 * | **Heading** | ![Badge image](/path/to/image.jpg) |
 * | Description text | |
 * | [CTA Link](/path) | |
 */
export default function parse(element, { document }) {
  // Extract heading from .cmp-cta__title or fallback to any h2/h3
  const heading = element.querySelector('.cmp-cta__title h2.cmp-title__text, .cmp-cta__title h3.cmp-title__text, h2.cmp-title__text, h3.cmp-title__text');

  // Extract description from .cmp-cta__description .cmp-text or fallback
  const descriptionContainer = element.querySelector('.cmp-cta__description .cmp-text, .cmp-cta__description');
  const description = descriptionContainer ? descriptionContainer.querySelector('p') || descriptionContainer : null;

  // Extract CTA link(s) from action container
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-cta__action-container a.cmp-button__clickable-area, .cmp-cta__action-container a[class*="cmp-button"], .cmp-cta__action-container a'));

  // Extract image from right-grid or any image in the block (indicated by cmp-cta--with-image class)
  const image = element.querySelector('.right-grid img, .cmp-cta__image img, img[class*="cmp-cta"], img');

  // Build cells to match the 2-column library example structure:
  // Row 1: [heading, image]
  // Row 2: [description, empty]
  // Row 3: [CTA link(s), empty]
  const cells = [];

  // Row 1: Heading (left) | Image (right)
  const row1Left = [];
  if (heading) row1Left.push(heading);
  const row1Right = [];
  if (image) row1Right.push(image);
  cells.push([row1Left, row1Right]);

  // Row 2: Description (left) | empty (right)
  if (description) {
    cells.push([[description], []]);
  }

  // Row 3: CTA link(s) (left) | empty (right)
  if (ctaLinks.length > 0) {
    cells.push([ctaLinks, []]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
