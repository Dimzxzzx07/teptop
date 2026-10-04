import {signal} from 'teptop.js';

const runtimeStatus = signal('ready');

export function JsxBadge() {
  return <span className="jsx-badge">JSX runtime {runtimeStatus()}</span>;
}
