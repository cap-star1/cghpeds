/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-adviser
 * Base block: hero
 * Source: https://hostplus.com.au/advisers
 * Selector: .hero-block-V2 .cmp-hero-block-V2__container
 * Generated: 2026-05-21
 *
 * Target structure (from library example):
 *   Row 1: Background image
 *   Row 2: Heading (h1)
 *   Row 3: Description text
 *
 * Source DOM validated selectors:
 *   - Background image: img.cmp-hero-block__background-image.desktop
 *   - Heading: h1.cmp-title__text, .rotator-title
 *   - Description: .description-text .cmp-text__text p
 *   - CTA links (if present): .cmp-hero-block__content a
 */
export default function parse(element, { document }) {
  // Extract background image (prefer desktop, fallback to tablet/mobile)
  const bgImage = element.querySelector(
    'img.cmp-hero-block__background-image.desktop, img.cmp-hero-block__background-image'
  );

  // Extract heading (h1 with rotator-title class, fallback to any h1 in content area)
  const heading = element.querySelector(
    'h1.cmp-title__text, .cmp-hero-block__headings h1, .cmp-hero-block__content h1'
  );

  // Extract description text
  const description = element.querySelector(
    '.description-text .cmp-text__text p, .description-text .cmp-text p, .cmp-hero-block__content .cmp-text p'
  );

  // Extract CTA links (if present - block description mentions CTA)
  const ctaLinks = Array.from(
    element.querySelectorAll('.cmp-hero-block__content a[href], .cmp-hero-block__headings a[href]')
  );

  // Build cells array matching library example structure
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Heading + description + CTAs (combined content cell)
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }
  if (description) {
    contentCell.push(description);
  }
  if (ctaLinks.length > 0) {
    contentCell.push(...ctaLinks);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-adviser', cells });
  element.replaceWith(block);
}
