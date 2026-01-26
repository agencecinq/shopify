import { throttle } from "./throttle";

const html = document.documentElement;
const { body } = document;
const isDebug = html.hasAttribute('data-debug');

const scroll = {
  y: 0,
  x: 0,
};

const mouse = {
  x: 0,
  y: 0,
};

window.addEventListener(
  'pointermove',
  throttle(({ x, y }) => {
    mouse.x = x;
    mouse.y = y;
  }, 100),
  { passive: true }
);

const breakpoints = {
  lg: window.matchMedia('(width >= 64rem)'),
  xl: window.matchMedia('(min-width: 1280px)'),
  '2xl': window.matchMedia('(min-width: 1440px)'),
  '3xl': window.matchMedia('(min-width: 1920px)'),
};

const production = import.meta.env.PROD;

export { html, body, isDebug, scroll, mouse, breakpoints, production };
