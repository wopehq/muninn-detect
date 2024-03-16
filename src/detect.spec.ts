import { expect, describe, it } from 'bun:test';
import { load } from 'cheerio';
import { DetectConfig, detect } from './detect';

describe('detect', () => {
  const SAMPLE_HTML = `
    <body>
      <div class="blocks">
        <div class="block">
          <div class="title">Title</div>
          <div class="description">Description</div>
        </div>
        <div class="block">
          <div class="title">Title</div>
          <div class="video-wrapper">...</div>
        </div>
        <div class="block block-gallery">
          <div class="title">Title</div>
          <div class="image-gallery">...</div>
        </div>
        <div class="block">
          <div class="title">Title</div>
          <div class="description">Description</div>
        </div>
      </div>
    </body>`;

  const $ = load(SAMPLE_HTML);

  it('should return true if the element matches any of the configs in oneOf', () => {
    const el = $('.block');
    const config: DetectConfig = {
      oneOf: [{ hasClassName: 'block' }, { withInnerSelector: '.title' }]
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not match any of the configs in oneOf', () => {
    const el = $('.block');
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
    const el = $('.block');
    const config: DetectConfig = {
      withInnerSelector: '.title'
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not match the config with inner selector', () => {
    const el = $('.block');
    const config: DetectConfig = {
      withInnerSelector: '.non-existent-child'
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return true if the element matches the config with exact match class name', () => {
    const el = $('.block');
    const config: DetectConfig = {
      exactMatchClassName: 'block'
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not match the config with exact match class name', () => {
    const el = $('.block');
    const config: DetectConfig = {
      exactMatchClassName: 'non-existent-class'
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return true if the element matches the config with custom function', () => {
    const el = $('.block');
    const config: DetectConfig = {
      custom: (el) => el.find('.title').length > 0
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not match the config with custom function', () => {
    const el = $('.block');
    const config: DetectConfig = {
      custom: (el) => el.find('.non-existent-child').length > 0
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return true if the element has the specified class name', () => {
    const el = $('.block');
    const config: DetectConfig = {
      hasClassName: 'block'
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });

  it('should return false if the element does not have the specified class name', () => {
    const el = $('.block');
    const config: DetectConfig = {
      hasClassName: 'non-existent-class'
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });

  it('should return false if the element does not have all the specified class names', () => {
    const el = $('.block');
    const config: DetectConfig = {
      hasClassNames: ['block', 'non-existent-class']
    };

    const result = detect(el, config);

    expect(result).toBe(false);
  });
});
