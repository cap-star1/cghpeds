/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-advisers-page.js
  var import_advisers_page_exports = {};
  __export(import_advisers_page_exports, {
    default: () => import_advisers_page_default
  });

  // tools/importer/parsers/hero-adviser.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(
      "img.cmp-hero-block__background-image.desktop, img.cmp-hero-block__background-image"
    );
    const heading = element.querySelector(
      "h1.cmp-title__text, .cmp-hero-block__headings h1, .cmp-hero-block__content h1"
    );
    const description = element.querySelector(
      ".description-text .cmp-text__text p, .description-text .cmp-text p, .cmp-hero-block__content .cmp-text p"
    );
    const ctaLinks = Array.from(
      element.querySelectorAll(".cmp-hero-block__content a[href], .cmp-hero-block__headings a[href]")
    );
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
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
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-adviser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resource.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll(".cmp-resources-container-content-hero__item, .link-resource");
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a.cmp-resource-item, a");
      const image = item.querySelector(".cmp-resource-item__image img, .cmp-image__image, img");
      const titleEl = item.querySelector(".cmp-title__text");
      const cellContent = [];
      if (image) {
        cellContent.push(image);
      }
      if (titleEl && link) {
        const linkedTitle = document.createElement("a");
        linkedTitle.href = link.href;
        linkedTitle.textContent = titleEl.textContent.trim();
        const strong = document.createElement("strong");
        strong.appendChild(linkedTitle);
        cellContent.push(strong);
      } else if (titleEl) {
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        cellContent.push(strong);
      }
      const description = item.querySelector(".cmp-resource-item__description, .cmp-text, p:not(.cmp-title__text)");
      if (description) {
        cellContent.push(description);
      }
      if (cellContent.length > 0) {
        cells.push(cellContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resource", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-dates.js
  function parse3(element, { document }) {
    const tabList = element.querySelector("ol.cmp-tabs__tablist, ul.cmp-tabs__tablist");
    let tabItems = [];
    if (tabList) {
      tabItems = Array.from(tabList.querySelectorAll(":scope > li.cmp-tabs__tab--hidden"));
      if (tabItems.length === 0) {
        tabItems = Array.from(tabList.querySelectorAll(":scope > li.cmp-tabs__tab:not(.cmp-tabs__tab-selected):not(.cmp-tabs__tab-more)"));
      }
      if (tabItems.length === 0) {
        tabItems = Array.from(tabList.querySelectorAll(':scope > li[id*="-tab"]:not([id*="-tab-secondary"])'));
      }
    }
    const tabPanels = Array.from(element.querySelectorAll(':scope > .cmp-tabs__tabpanel, :scope > div[role="tabpanel"]'));
    const cells = [];
    const tabCount = Math.max(tabItems.length, tabPanels.length);
    for (let i = 0; i < tabCount; i++) {
      if (tabItems[i]) {
        const labelText = tabItems[i].textContent.trim();
        const labelEl = document.createElement("p");
        labelEl.textContent = labelText;
        cells.push([labelEl]);
      } else {
        const labelEl = document.createElement("p");
        labelEl.textContent = `Tab ${i + 1}`;
        cells.push([labelEl]);
      }
      if (tabPanels[i]) {
        cells.push([tabPanels[i]]);
      } else {
        const emptyEl = document.createElement("p");
        emptyEl.textContent = "";
        cells.push([emptyEl]);
      }
    }
    if (cells.length === 0) {
      const childDivs = Array.from(element.querySelectorAll(":scope > div:not(.cmp-tabs__tablist)"));
      childDivs.forEach((div, idx) => {
        const labelEl = document.createElement("p");
        labelEl.textContent = `Tab ${idx + 1}`;
        cells.push([labelEl]);
        cells.push([div]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-dates", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document }) {
    const image = element.querySelector(".cmp-promote-campaign__image-container img.cmp-image__image, .cmp-promote-campaign__image-container img, .cmp-image img");
    const heading = element.querySelector(".cmp-promote-campaign__heading .cmp-title__text, .cmp-promote-campaign__content-details h3, .cmp-promote-campaign__content-details h2");
    const descContainer = element.querySelector(".cmp-promote-campaign__desc .cmp-text, .cmp-promote-campaign__desc");
    const descElements = descContainer ? Array.from(descContainer.querySelectorAll(":scope > p")) : [];
    const ctaLink = element.querySelector(".cmp-promote-campaign__button-container a.cmp-button__clickable-area, .cmp-promote-campaign__button-container a");
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
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
    const cells = [
      [imageCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse5(element, { document }) {
    const image = element.querySelector(".cmp-content-media-block__container1 img.cmp-image__image, .cmp-content-media-block__container1 img");
    const heading = element.querySelector(".cmp-content-block__heading .cmp-title__text, .cmp-content-media-block__container2 h2, .cmp-content-media-block__container2 h3");
    const textContainer = element.querySelector(".cmp-content-block__text .cmp-text, .cmp-content-media-block__container2 .cmp-text");
    const descriptions = textContainer ? Array.from(textContainer.querySelectorAll("p")) : [];
    const ctaLinks = Array.from(element.querySelectorAll('.cmp-content-media-block__container2 a.cmp-button, .cmp-content-media-block__container2 a[class*="button"], .cmp-content-media-block__container2 a[class*="cta"], .cmp-content-block a'));
    const leftCell = [];
    if (image) {
      leftCell.push(image);
    }
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
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse6(element, { document }) {
    const cardItems = element.querySelectorAll(".cmp-cross-link__item, .cmp-list__item");
    const cells = [];
    cardItems.forEach((item) => {
      const link = item.querySelector("a.cmp-cross-link__link, a");
      const href = link ? link.getAttribute("href") : "";
      const icon = item.querySelector("img.cmp-cross-link__mnemonic, .cmp-cross-link__teaser-content > img");
      const titleEl = item.querySelector(".cmp-title__text, h4, h3, h5");
      const descriptionEl = item.querySelector(".cmp-cross-link__title-description > .cmp-text, .cmp-cross-link__teaser > .cmp-text");
      const descriptionText = descriptionEl ? descriptionEl.textContent.trim() : "";
      const cardContent = [];
      if (icon) {
        const img = document.createElement("img");
        img.src = icon.getAttribute("src") || "";
        img.alt = icon.getAttribute("alt") || "";
        cardContent.push(img);
      }
      if (titleEl) {
        const linkedTitle = document.createElement("a");
        linkedTitle.href = href || "";
        linkedTitle.textContent = titleEl.textContent.trim();
        const strong = document.createElement("strong");
        strong.appendChild(linkedTitle);
        cardContent.push(strong);
      }
      if (descriptionText) {
        const desc = document.createElement("p");
        desc.textContent = descriptionText;
        cardContent.push(desc);
      }
      if (cardContent.length > 0) {
        cells.push(cardContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse7(element, { document }) {
    const heading = element.querySelector(".cmp-cta__title h2.cmp-title__text, .cmp-cta__title h3.cmp-title__text, h2.cmp-title__text, h3.cmp-title__text");
    const descriptionContainer = element.querySelector(".cmp-cta__description .cmp-text, .cmp-cta__description");
    const description = descriptionContainer ? descriptionContainer.querySelector("p") || descriptionContainer : null;
    const ctaLinks = Array.from(element.querySelectorAll('.cmp-cta__action-container a.cmp-button__clickable-area, .cmp-cta__action-container a[class*="cmp-button"], .cmp-cta__action-container a'));
    const image = element.querySelector('.right-grid img, .cmp-cta__image img, img[class*="cmp-cta"], img');
    const cells = [];
    const row1Left = [];
    if (heading) row1Left.push(heading);
    const row1Right = [];
    if (image) row1Right.push(image);
    cells.push([row1Left, row1Right]);
    if (description) {
      cells.push([[description], []]);
    }
    if (ctaLinks.length > 0) {
      cells.push([ctaLinks, []]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse8(element, { document }) {
    const cardItems = element.querySelectorAll("li.cmp-page-list-item, .cmp-page-list-item");
    const cells = [];
    cardItems.forEach((item) => {
      const link = item.querySelector('a.cmp-page-list-item__link, a[class*="page-list-item"]');
      const href = link ? link.getAttribute("href") : "";
      const img = item.querySelector("img.cmp-image__image, img");
      const titleEl = item.querySelector("h3.cmp-title__text, .cmp-title__text, h3, h4");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const ctaSpan = item.querySelector(".cmp-page-list-item__button-text, .cmp-page-list-item__button span");
      const ctaText = ctaSpan ? ctaSpan.textContent.trim() : "Read more";
      const cellContent = [];
      if (img) {
        const imgClone = img.cloneNode(true);
        cellContent.push(imgClone);
      }
      if (titleText) {
        const heading = document.createElement("h3");
        heading.textContent = titleText;
        cellContent.push(heading);
      }
      if (href) {
        const ctaLink = document.createElement("a");
        ctaLink.setAttribute("href", href);
        ctaLink.textContent = ctaText;
        cellContent.push(ctaLink);
      }
      if (cellContent.length > 0) {
        cells.push(cellContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/hostplus-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cx-widget.cx-side-button-group",
        "#chatConfirmOverlay"
      ]);
      WebImporter.DOMUtils.remove(element, ["#app-root-mode"]);
      WebImporter.DOMUtils.remove(element, [".js-body-overlay"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--header"]);
      WebImporter.DOMUtils.remove(element, ["header"]);
      WebImporter.DOMUtils.remove(element, ["footer", ".footer.container.responsivegrid"]);
      WebImporter.DOMUtils.remove(element, ["#genesys-thirdparty", "#genesys-messenger"]);
      WebImporter.DOMUtils.remove(element, ['iframe[src*="doubleclick"]']);
      WebImporter.DOMUtils.remove(element, [".cloudservice.testandtarget"]);
      WebImporter.DOMUtils.remove(element, [".modal-wrapper"]);
      WebImporter.DOMUtils.remove(element, [".modal__container.cmp-navigation__flyout__container"]);
      WebImporter.DOMUtils.remove(element, ["link"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "iframe"]);
    }
  }

  // tools/importer/transformers/hostplus-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-advisers-page.js
  var parsers = {
    "hero-adviser": parse,
    "cards-resource": parse2,
    "tabs-dates": parse3,
    "columns-promo": parse4,
    "columns-feature": parse5,
    "cards-product": parse6,
    "columns-cta": parse7,
    "cards-article": parse8
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "advisers-page",
    description: "Advisers landing page for financial advisers working with Hostplus members",
    urls: ["https://hostplus.com.au/advisers"],
    blocks: [
      {
        name: "hero-adviser",
        instances: [".hero-block-V2 .cmp-hero-block-V2__container"]
      },
      {
        name: "cards-resource",
        instances: [".cmp-resources-container-content-hero"]
      },
      {
        name: "tabs-dates",
        instances: [".tabs.panelcontainer .cmp-tabs"]
      },
      {
        name: "columns-promo",
        instances: [
          ".promote-campaign.cmp-promote-campaign-banner-mid-blue.cmp-promote-campaign-banner-image.--mb-4xl",
          ".promote-campaign.cmp-promote-campaign-banner-dark-blue.cmp-promote-campaign-banner-image:has(#promote-campaign-8687610466)"
        ]
      },
      {
        name: "columns-feature",
        instances: [".content-media-block .cmp-content-media-block"]
      },
      {
        name: "cards-product",
        instances: [".crosslinks .cmp-cross-link__list"]
      },
      {
        name: "columns-cta",
        instances: [".cta .cmp-cta"]
      },
      {
        name: "cards-article",
        instances: [".page-list .cmp-page-list"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: ".hero-block-V2",
        style: null,
        blocks: ["hero-adviser", "cards-resource"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "EOFY Cut-off Dates",
        selector: [".container-block.container.responsivegrid:has(#heading-dcc7b41184)", ".tabs.panelcontainer"],
        style: null,
        blocks: ["tabs-dates"],
        defaultContent: ["#heading-dcc7b41184 .cmp-title__text"]
      },
      {
        id: "section-3",
        name: "Retirement Bonus Promo",
        selector: ".promote-campaign.cmp-promote-campaign-banner-mid-blue.cmp-promote-campaign-banner-image.--mb-4xl",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Why Choose Hostplus",
        selector: ".content-media-block.--mb-4xl",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Discover Products",
        selector: [".container-block.container.responsivegrid:has(#products)", ".crosslinks.--mb-2xl"],
        style: null,
        blocks: ["cards-product"],
        defaultContent: ["#discover .cmp-title__text", "#text-ce02fa9a7c"]
      },
      {
        id: "section-6",
        name: "360Health Promo",
        selector: ".promote-campaign.cmp-promote-campaign-banner-dark-blue.cmp-promote-campaign-banner-image:has(#promote-campaign-8687610466)",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Lonsec CTA",
        selector: ".cta.--mb-4xl.medium",
        style: "dark",
        blocks: ["columns-cta"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Explore Further",
        selector: ".container-block.container.responsivegrid.--mb-4xl:has(#container-block-851ebfbdd9)",
        style: "highlight",
        blocks: ["cards-article"],
        defaultContent: ["#heading-aa63c653a1 .cmp-title__text"]
      },
      {
        id: "section-9",
        name: "Disclaimers",
        selector: ".container-block.container.responsivegrid.--mb-4xl:has(#container-block-09d717a639)",
        style: null,
        blocks: [],
        defaultContent: ["#disclaimer-c6b1f5d06e"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_advisers_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_advisers_page_exports);
})();
