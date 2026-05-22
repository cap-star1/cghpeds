/**
 * Section Metadata block.
 * Reads key-value pairs and applies them to the parent section.
 * The "style" key adds its values as classes to the section element.
 * @param {HTMLElement} block The section-metadata block element
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (!section) return;

  [...block.children].forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase();
    const value = row.children[1]?.textContent?.trim();
    if (!key || !value) return;

    if (key === 'style') {
      value.split(',').forEach((style) => {
        section.classList.add(style.trim());
      });
    } else {
      section.dataset[key] = value;
    }
  });

  block.closest('.section-metadata-wrapper')?.remove();
}
