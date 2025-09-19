import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { DOMWindow } from 'jsdom';

const window = new JSDOM('').window as DOMWindow;
const DOMPurify = createDOMPurify(window);

export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'em', 'strong', 'ul', 'ol', 'li', 'p', 'br', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
