/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Hostplus section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for sections with styles.
 * Processes sections from payload.template.sections in reverse order.
 * All selectors verified against captured DOM in migration-work/cleaned.html and page-templates.json.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const doc = element.ownerDocument || document;
    const sections = template.sections;

    // Process sections in reverse order to avoid shifting DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first element matching any of the section selectors
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before section element (except for the first section)
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
