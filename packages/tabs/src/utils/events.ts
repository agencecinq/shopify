export const EVENTS = {
  BEFORE_ACTIVATE: 'tab-before-activate',
  ACTIVATE: 'tab-activate',
  DELETE: 'tab-delete',
} as const;

export type Events = (typeof EVENTS)[keyof typeof EVENTS];

