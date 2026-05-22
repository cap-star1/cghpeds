// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-dates-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children];

  // Rows alternate: label row (even index), content row (odd index)
  const tabLabels = [];
  const tabPanels = [];

  rows.forEach((row, i) => {
    if (i % 2 === 0) {
      tabLabels.push(row);
    } else {
      tabPanels.push(row);
    }
  });

  // Remove all existing children
  block.innerHTML = '';

  // Create tabs and panels
  tabLabels.forEach((labelRow, i) => {
    let labelText = labelRow.firstElementChild?.textContent?.trim() || '';

    // If the label looks like a placeholder ("Tab N") or contains "More",
    // try to extract the date from the panel's first <strong> or bold text
    if (/^Tab \d+$/i.test(labelText) || labelText.startsWith('More')) {
      const panel = tabPanels[i];
      if (panel) {
        const strong = panel.querySelector('strong');
        if (strong) {
          labelText = strong.textContent.trim();
        }
      }
    }

    if (!labelText) labelText = `Tab ${i + 1}`;
    const id = toClassName(labelText);

    // Create the tab button
    const button = document.createElement('button');
    button.className = 'tabs-dates-tab';
    button.id = `tab-${id}`;
    button.textContent = labelText;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    tablist.append(button);

    // Setup the panel
    const panel = tabPanels[i];
    if (panel) {
      panel.className = 'tabs-dates-panel';
      panel.id = `tabpanel-${id}`;
      panel.setAttribute('aria-hidden', i !== 0);
      panel.setAttribute('aria-labelledby', `tab-${id}`);
      panel.setAttribute('role', 'tabpanel');
    }
  });

  // Add click handlers
  tablist.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      const panelId = button.getAttribute('aria-controls');
      const panel = block.querySelector(`#${panelId}`);
      if (panel) panel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
  });

  // Assemble: tablist first, then panels
  block.append(tablist);
  tabPanels.forEach((panel) => {
    if (panel) block.append(panel);
  });
}
