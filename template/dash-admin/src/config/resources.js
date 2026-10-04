export const resourceConfig = {
  customers: {label: 'Customers', singular: 'Customer', icon: 'CU', primary: 'name', secondary: 'email', columns: ['name', 'company', 'status', 'joinedAt'], fields: ['name', 'email', 'company', 'status', 'joinedAt']},
  products: {label: 'Products', singular: 'Product', icon: 'PR', primary: 'name', secondary: 'sku', columns: ['name', 'category', 'price', 'stock', 'status'], fields: ['name', 'sku', 'category', 'price', 'stock', 'status']},
  orders: {label: 'Orders', singular: 'Order', icon: 'OR', primary: 'id', secondary: 'customer', columns: ['id', 'customer', 'total', 'items', 'status', 'placedAt'], fields: ['customer', 'email', 'total', 'items', 'status', 'placedAt']},
};

export const fieldConfig = {
  name: {label: 'Name', type: 'text', required: true},
  email: {label: 'Email', type: 'email', required: true},
  company: {label: 'Company', type: 'text'},
  status: {label: 'Status', type: 'select'},
  joinedAt: {label: 'Joined date', type: 'date'},
  sku: {label: 'SKU', type: 'text', required: true},
  category: {label: 'Category', type: 'text'},
  price: {label: 'Price', type: 'number', min: 0, required: true},
  stock: {label: 'Stock', type: 'number', min: 0, required: true},
  customer: {label: 'Customer', type: 'text', required: true},
  total: {label: 'Total', type: 'number', min: 0, required: true},
  items: {label: 'Items', type: 'number', min: 1, required: true},
  placedAt: {label: 'Order date', type: 'date'},
};

export const statusOptions = {
  customers: ['active', 'invited', 'suspended'],
  products: ['published', 'draft', 'archived'],
  orders: ['paid', 'processing', 'shipped', 'refunded'],
};
