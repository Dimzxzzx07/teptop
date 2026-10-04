export const resources = {
  customers: {
    label: 'Customers',
    singular: 'Customer',
    fields: {
      name: {label: 'Name', type: 'text', required: true},
      email: {label: 'Email', type: 'email', required: true},
      company: {label: 'Company', type: 'text'},
      status: {label: 'Status', type: 'select', options: ['active', 'invited', 'suspended']},
      joinedAt: {label: 'Joined', type: 'date'},
    },
    seed: [
      {id: 'cus_1001', name: 'Avery Chen', email: 'avery@northstar.example', company: 'Northstar Studio', status: 'active', joinedAt: '2026-09-18'},
      {id: 'cus_1002', name: 'Mina Patel', email: 'mina@fieldwork.example', company: 'Fieldwork Co.', status: 'active', joinedAt: '2026-09-16'},
      {id: 'cus_1003', name: 'Noah Williams', email: 'noah@commonroom.example', company: 'Commonroom', status: 'invited', joinedAt: '2026-09-14'},
      {id: 'cus_1004', name: 'Sofia Andersson', email: 'sofia@formandfound.example', company: 'Form & Found', status: 'suspended', joinedAt: '2026-09-11'},
      {id: 'cus_1005', name: 'Leo Martin', email: 'leo@monocle.example', company: 'Monocle Works', status: 'active', joinedAt: '2026-09-08'},
    ],
  },
  products: {
    label: 'Products',
    singular: 'Product',
    fields: {
      name: {label: 'Product', type: 'text', required: true},
      sku: {label: 'SKU', type: 'text', required: true},
      category: {label: 'Category', type: 'text'},
      price: {label: 'Price', type: 'number', min: 0, required: true},
      stock: {label: 'Stock', type: 'number', min: 0, required: true},
      status: {label: 'Status', type: 'select', options: ['published', 'draft', 'archived']},
    },
    seed: [
      {id: 'prd_2001', name: 'Arc Desk Lamp', sku: 'ARC-LMP-01', category: 'Lighting', price: 168, stock: 24, status: 'published'},
      {id: 'prd_2002', name: 'Field Notes Set', sku: 'FLD-NTE-04', category: 'Stationery', price: 32, stock: 108, status: 'published'},
      {id: 'prd_2003', name: 'Utility Tote', sku: 'UTL-TOT-02', category: 'Accessories', price: 46, stock: 7, status: 'draft'},
      {id: 'prd_2004', name: 'Studio Chair', sku: 'STD-CHR-11', category: 'Furniture', price: 540, stock: 3, status: 'published'},
      {id: 'prd_2005', name: 'Ceramic Tray', sku: 'CRM-TRY-07', category: 'Home', price: 58, stock: 0, status: 'archived'},
    ],
  },
  orders: {
    label: 'Orders',
    singular: 'Order',
    fields: {
      customer: {label: 'Customer', type: 'text', required: true},
      email: {label: 'Email', type: 'email'},
      total: {label: 'Total', type: 'number', min: 0, required: true},
      items: {label: 'Items', type: 'number', min: 1, required: true},
      status: {label: 'Status', type: 'select', options: ['paid', 'processing', 'shipped', 'refunded']},
      placedAt: {label: 'Placed', type: 'date'},
    },
    seed: [
      {id: 'ord_3001', customer: 'Avery Chen', email: 'avery@northstar.example', total: 346, items: 3, status: 'paid', placedAt: '2026-09-22'},
      {id: 'ord_3002', customer: 'Mina Patel', email: 'mina@fieldwork.example', total: 168, items: 1, status: 'processing', placedAt: '2026-09-21'},
      {id: 'ord_3003', customer: 'Leo Martin', email: 'leo@monocle.example', total: 86, items: 2, status: 'shipped', placedAt: '2026-09-20'},
      {id: 'ord_3004', customer: 'Avery Chen', email: 'avery@northstar.example', total: 540, items: 1, status: 'refunded', placedAt: '2026-09-18'},
    ],
  },
};

export function validateRecord(resourceName, input, {partial = false} = {}) {
  const resource = resources[resourceName];
  if (!resource) return {error: `Unknown resource: ${resourceName}`};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {error: 'Request body must be an object.'};
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    const field = resource.fields[key];
    if (!field) return {error: `Unknown field: ${key}`};
    if (value === '' || value == null) {
      if (field.required && !partial) return {error: `${field.label} is required.`};
      if (!partial) output[key] = '';
      continue;
    }
    if (field.type === 'number') {
      const number = Number(value);
      if (!Number.isFinite(number) || (field.min != null && number < field.min)) return {error: `${field.label} must be a number greater than or equal to ${field.min ?? 0}.`};
      output[key] = number;
    } else if (field.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return {error: `${field.label} must be a valid email address.`};
      output[key] = String(value).trim();
    } else if (field.type === 'select') {
      if (field.options && !field.options.includes(value)) return {error: `${field.label} is not a supported option.`};
      output[key] = String(value);
    } else {
      output[key] = String(value).trim();
    }
  }
  if (!partial) {
    for (const [key, field] of Object.entries(resource.fields)) {
      if (field.required && (output[key] == null || output[key] === '')) return {error: `${field.label} is required.`};
    }
  }
  return {data: output};
}
