/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroAdviserParser from './parsers/hero-adviser.js';
import cardsResourceParser from './parsers/cards-resource.js';
import tabsDatesParser from './parsers/tabs-dates.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsCtaParser from './parsers/columns-cta.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import hostplusCleanupTransformer from './transformers/hostplus-cleanup.js';
import hostplusSectionsTransformer from './transformers/hostplus-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-adviser': heroAdviserParser,
  'cards-resource': cardsResourceParser,
  'tabs-dates': tabsDatesParser,
  'columns-promo': columnsPromoParser,
  'columns-feature': columnsFeatureParser,
  'cards-product': cardsProductParser,
  'columns-cta': columnsCtaParser,
  'cards-article': cardsArticleParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  hostplusCleanupTransformer,
  hostplusSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'advisers-page',
  description: 'Advisers landing page for financial advisers working with Hostplus members',
  urls: ['https://hostplus.com.au/advisers'],
  blocks: [
    {
      name: 'hero-adviser',
      instances: ['.hero-block-V2 .cmp-hero-block-V2__container'],
    },
    {
      name: 'cards-resource',
      instances: ['.cmp-resources-container-content-hero'],
    },
    {
      name: 'tabs-dates',
      instances: ['.tabs.panelcontainer .cmp-tabs'],
    },
    {
      name: 'columns-promo',
      instances: [
        '.promote-campaign.cmp-promote-campaign-banner-mid-blue.cmp-promote-campaign-banner-image.--mb-4xl',
        '.promote-campaign.cmp-promote-campaign-banner-dark-blue.cmp-promote-campaign-banner-image:has(#promote-campaign-8687610466)',
      ],
    },
    {
      name: 'columns-feature',
      instances: ['.content-media-block .cmp-content-media-block'],
    },
    {
      name: 'cards-product',
      instances: ['.crosslinks .cmp-cross-link__list'],
    },
    {
      name: 'columns-cta',
      instances: ['.cta .cmp-cta'],
    },
    {
      name: 'cards-article',
      instances: ['.page-list .cmp-page-list'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      selector: '.hero-block-V2',
      style: null,
      blocks: ['hero-adviser', 'cards-resource'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'EOFY Cut-off Dates',
      selector: ['.container-block.container.responsivegrid:has(#heading-dcc7b41184)', '.tabs.panelcontainer'],
      style: null,
      blocks: ['tabs-dates'],
      defaultContent: ['#heading-dcc7b41184 .cmp-title__text'],
    },
    {
      id: 'section-3',
      name: 'Retirement Bonus Promo',
      selector: '.promote-campaign.cmp-promote-campaign-banner-mid-blue.cmp-promote-campaign-banner-image.--mb-4xl',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Why Choose Hostplus',
      selector: '.content-media-block.--mb-4xl',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Discover Products',
      selector: ['.container-block.container.responsivegrid:has(#products)', '.crosslinks.--mb-2xl'],
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['#discover .cmp-title__text', '#text-ce02fa9a7c'],
    },
    {
      id: 'section-6',
      name: '360Health Promo',
      selector: '.promote-campaign.cmp-promote-campaign-banner-dark-blue.cmp-promote-campaign-banner-image:has(#promote-campaign-8687610466)',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Lonsec CTA',
      selector: '.cta.--mb-4xl.medium',
      style: 'dark',
      blocks: ['columns-cta'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Explore Further',
      selector: '.container-block.container.responsivegrid.--mb-4xl:has(#container-block-851ebfbdd9)',
      style: 'highlight',
      blocks: ['cards-article'],
      defaultContent: ['#heading-aa63c653a1 .cmp-title__text'],
    },
    {
      id: 'section-9',
      name: 'Disclaimers',
      selector: '.container-block.container.responsivegrid.--mb-4xl:has(#container-block-09d717a639)',
      style: null,
      blocks: [],
      defaultContent: ['#disclaimer-c6b1f5d06e'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
