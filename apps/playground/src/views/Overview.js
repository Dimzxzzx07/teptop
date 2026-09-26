import {h} from '/teptop.js';
import {activity} from '../data/activity.js';
import {metrics, title} from '../state/dashboard.js';
import {ActivityPanel} from '../components/ActivityPanel.js';
import {MetricCard} from '../components/MetricCard.js';
import {SignalControls} from '../components/SignalControls.js';

export function Overview() {
  return h('section', null,
    h('div', {className: 'grid'},
      h(MetricCard, {label: 'Active sessions', value: title, change: '+12.8% this week'}),
      h(MetricCard, {label: 'Deployments', value: () => metrics().deployments, change: '+8.2% this week'}),
      h(MetricCard, {label: 'Availability', value: () => metrics().availability, change: 'Healthy'}),
      h(MetricCard, {label: 'Latency', value: () => metrics().latency, change: '-14ms this week'}),
    ),
    h('div', {className: 'content'}, h(ActivityPanel, {activity}), h(SignalControls)),
  );
}
