import {h} from '/runtime/index.js';
import {dashboardSummary, loadDashboard} from '../state/admin.js';
import {MetricCard} from '../components/MetricCard.js';
import {ResourceTable} from '../components/ResourceTable.js';
import {resourceConfig} from '../config/resources.js';

const money = value => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(value || 0);

export function DashboardPage({onNavigate}) {
  return h('section', {className: 'page'},
    h('div', {className: 'page-heading'}, h('div', null, h('div', {className: 'eyebrow'}, 'Wednesday · September 23, 2026'), h('h1', null, 'Good morning, admin'), h('p', null, 'A clear view of what is happening across your workspace.')), h('button', {className: 'button', onclick: loadDashboard}, 'Refresh overview')),
    () => {
      const summary = dashboardSummary();
      if (!summary) return h('div', {className: 'loading'}, 'Loading workspace overview…');
      return h('div', null,
        h('div', {className: 'metrics'},
          h(MetricCard, {label: 'Total customers', value: summary.customers.toLocaleString(), trend: `${summary.activeCustomers} active`, note: 'Across all accounts'}),
          h(MetricCard, {label: 'Orders', value: summary.orders.toLocaleString(), trend: 'Live records', note: 'All order statuses'}),
          h(MetricCard, {label: 'Gross revenue', value: money(summary.revenue), trend: 'Excludes refunds', note: 'Seed data · USD'}),
          h(MetricCard, {label: 'Low stock items', value: summary.lowStock.toLocaleString(), trend: summary.lowStock ? 'Review inventory' : 'Inventory healthy', note: 'Below 10 units'}),
        ),
        h('div', {className: 'dashboard-grid'},
          h('section', {className: 'panel'}, h('div', {className: 'panel-head'}, h('h2', {className: 'panel-title'}, 'Recent orders'), h('button', {className: 'text-button', onclick: () => onNavigate('/orders')}, 'View all →')), h(ResourceTable, {resource: 'orders', rows: summary.recentOrders || [], loading: false, showActions: false})),
          h('section', {className: 'panel'}, h('div', {className: 'panel-head'}, h('h2', {className: 'panel-title'}, 'Workspace activity'), h('span', {className: 'panel-meta'}, 'TODAY')), h('ul', {className: 'activity-list'},
            h('li', null, h('i', {className: 'activity-dot'}), h('div', null, h('strong', null, 'Inventory synced'), h('span', null, 'Product catalog · 12 minutes ago'))),
            h('li', null, h('i', {className: 'activity-dot'}), h('div', null, h('strong', null, 'New customer invited'), h('span', null, 'Northstar Studio · 48 minutes ago'))),
            h('li', null, h('i', {className: 'activity-dot'}), h('div', null, h('strong', null, 'Order moved to processing'), h('span', null, 'ORD-3002 · 1 hour ago'))),
            h('li', null, h('i', {className: 'activity-dot'}), h('div', null, h('strong', null, 'Admin session started'), h('span', null, 'You · Just now'))),
          ),
            h('div', {className: 'quick-links'}, ...Object.entries(resourceConfig).map(([key, resource]) => h('button', {className: 'quick-link', onclick: () => onNavigate(`/${key}`)}, resource.label, h('span', null, '→')))),
          ),
        ),
      );
    },
  );
}
