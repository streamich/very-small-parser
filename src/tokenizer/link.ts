import {label, url, title, replace} from '../regex';
import type {IParser, TEat, ILink, IImage} from '../types';

const REG = replace(/^!?\[(label)\]\(url(?:\s+(title))?\s*\)/, {
  label,
  url,
  title,
});

const link = () => {
  return function (this: IParser, eat: TEat<ILink | IImage>, value: string) {
    const matches = value.match(REG);

    if (matches) {
      const isImage = matches[0][0] === '!';
      let linkTitle = matches[3];

      if (linkTitle) {
        linkTitle = linkTitle.substr(1, linkTitle.length - 2);
      }

      if (isImage) {
        return eat(matches[0], 'image', void 0, {
          url: matches[2],
          alt: matches[1],
          title: linkTitle,
        });
      } else {
        return eat(matches[0], 'link', this.tokenizeInline(matches[1]), {
          url: matches[2],
          title: linkTitle,
        });
      }
    }

    return;
  };
};

export default link;
