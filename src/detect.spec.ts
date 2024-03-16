import { expect, describe, it } from 'bun:test';
import { load } from 'cheerio';

import { DetectConfig, detect } from './detect';

const BLOCK_HTML = `
<div class="parent">
  <div class="first-child">First Child</div>
  <div class="second-child">Second Child</div>
  <div class="third-child">Third Child</div>
  <div class="full-child">Content</div>
  <div class="empty-child"></div>
  <div class="number-content-child">632</div>
  <div class="regex-test-child">Year 2021</div>
  <div class="regex-template-test-child">https://example.com/ > example > test</div>
  <a class="link" href="https://example.com/">Test Url</a>
</div>
`;

const SAMPLE_HTML = `
<body>
  <div class="blocks">
    <div class="unblock">Unblock</div>
    ${BLOCK_HTML.repeat(4)}
  </div>
</body>
`;

const $ = load(SAMPLE_HTML);

describe('detect', () => {
  it('should return true if the element matches the config', () => {
    const el = $('.parent');
    const config: DetectConfig = {
      withInnerSelector: '.full-child'
    };

    const result = detect(el, config);

    expect(result).toBe(true);
  });
});
