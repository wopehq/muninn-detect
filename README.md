# Muninn Detect

[![npm](https://img.shields.io/npm/v/muninn-detect?color=%234fc921)](https://www.npmjs.com/package/muninn-detect)
[![Build Status](https://github.com/wopehq/muninn-detect/workflows/test/badge.svg?color=%234fc921)](https://github.com/teamseodo/muninn/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg?color=%234fc921)](https://opensource.org/licenses/MIT)

Muninn Detect is an assistant designed to test whether an HTML element adheres to specified rules. This allows you to define detect rules to identify HTML elements in bulk.

### Usage

Sample HTML:

```html
<body>
  <div class="blocks">
    <div class="block">
      <div class="title">Title</div>
      <div class="description">Description</div>
    </div>
    <div class="block-video">
      <div class="title">Title</div>
      <div class="video-wrapper">...</div>
    </div>
    <div class="block-gallery">
      <div class="title">Title</div>
      <div class="image-gallery">...</div>
    </div>
    <div class="block hidden">
      <div class="title">Title</div>
      <div class="description">Description</div>
    </div>
  </div>
</body>
```

Example:

```js
import { load } from 'cheerio';
import { detect } from 'muninn-detect';

const $ = load(/* html content */);

// Get blocks
const blockElements = $('.blocks > div').toArray();

// Define detect rules
const basicBlockDetect = {
  hasClassName: 'block',
  withInnerSelector: '.description'
};

const videoBlockDetect = {
  exactMatchClassName: 'block-video',
  withInnerSelector: '.video-wrapper'
};

const imageBlockDetect = {
  exactMatchClassName: 'block-gallery',
  withInnerSelector: '.image-gallery'
};

// Find a specific block among the stack of blocks
const imageBlock = blockElements.find((el, index) =>
  detect(el, imageBlockDetect)
);
```

## License

Distributed under the MIT License. See LICENSE for more information.
