import { type Cheerio, type Element } from 'cheerio';

export interface DetectConfig {
  oneOf?: DetectConfig[];
  hasClassName?: string;
  hasClassNames?: string[];
  withInnerSelector?: string | string[];
  exactMatchClassName?: string;
  custom?: ($: Cheerio<Element>) => boolean;
}

const detectWithOneOf = (el: Cheerio<Element>, oneOf: DetectConfig[]) => {
  let isDetected = false;

  for (const detectObj of oneOf) {
    isDetected = detect(el, detectObj);
    if (isDetected) break;
  }

  return isDetected;
};

const detectWithInnerSelector = (
  el: Cheerio<Element>,
  withInnerSelector: string | string[]
) => {
  if (Array.isArray(withInnerSelector)) {
    return withInnerSelector
      .map((selector) => el.find(selector).length > 0)
      .every((isDetected) => isDetected);
  }

  return el.find(withInnerSelector).length > 0;
};

const detectWithHasClassNames = (
  el: Cheerio<Element>,
  hasClassNames: string[]
) => {
  return hasClassNames
    .map((className) => el.hasClass(className))
    .every((isDetected) => isDetected);
};

export function detect(el: Cheerio<Element>, config: DetectConfig) {
  let isDetected = false;

  if (!config) return;

  const {
    oneOf,
    hasClassName,
    hasClassNames,
    withInnerSelector,
    exactMatchClassName,
    custom
  } = config;

  if (Array.isArray(oneOf)) {
    isDetected = detectWithOneOf(el, oneOf);
    if (!isDetected) return false;
  }

  if (withInnerSelector) {
    isDetected = detectWithInnerSelector(el, withInnerSelector);
    if (!isDetected) return false;
  }

  if (hasClassNames) {
    isDetected = detectWithHasClassNames(el, hasClassNames);
    if (!isDetected) return false;
  }

  if (hasClassName) {
    isDetected = el.hasClass(hasClassName);
    if (!isDetected) return false;
  }

  if (exactMatchClassName) {
    isDetected = el.attr('class') === exactMatchClassName;
    if (!isDetected) return false;
  }

  if (typeof custom === 'function') {
    isDetected = custom(el);
    if (!isDetected) return false;
  }

  return isDetected;
}
