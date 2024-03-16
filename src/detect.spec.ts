import { expect, describe, it } from 'bun:test';
import { load } from 'cheerio';
import { DetectConfig, detect } from './detect';

describe('detect', () => {
  const SAMPLE_HTML = `
        <body>
            <div class="blocks">
                <div class="unblock">Unblock</div>
                <div class="parent">
                    <div class="first-child">First Child</div>
                    <div class="second-child">Second Child</div>
                </div>
            </div>
        </body>
    `;

  const $ = load(SAMPLE_HTML);

  it('should return true if the element matches any of the configs in oneOf', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      oneOf: [
        { hasClassName: 'parent' },
        { withInnerSelector: '.first-child' },
        { exactMatchClassName: 'non-existent-class' }
      ]
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not match any of the configs in oneOf', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      oneOf: [
        { hasClassName: 'non-existent-class' },
        { withInnerSelector: '.non-existent-child' },
        { exactMatchClassName: 'non-existent-class' }
      ]
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return true if the element matches the config with inner selector', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      withInnerSelector: '.first-child'
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not match the config with inner selector', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      withInnerSelector: '.non-existent-child'
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return true if the element matches the config with exact match class name', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      exactMatchClassName: 'parent'
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not match the config with exact match class name', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      exactMatchClassName: 'non-existent-class'
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return true if the element matches the config with custom function', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      custom: (el) => el.find('.first-child').length > 0
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not match the config with custom function', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      custom: (el) => el.find('.non-existent-child').length > 0
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return true if the element has the specified class name', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      hasClassName: 'parent'
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not have the specified class name', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      hasClassName: 'non-existent-class'
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return false if the element does not have all the specified class names', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      hasClassNames: ['parent', 'non-existent-class']
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });
});
