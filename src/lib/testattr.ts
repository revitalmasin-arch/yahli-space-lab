// Answer hints for automated browser tests. Present only in the dev build, never in a release.
export const testAttr = (name: string, value: string | number | boolean): Record<string, string> =>
  __APP_ENV__ === 'dev' ? { [`data-${name}`]: String(value) } : {};
