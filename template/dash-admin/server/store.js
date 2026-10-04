import {mkdir, readFile, rename, writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
import {randomUUID} from 'node:crypto';
import {resources} from './resources.js';

const clone = value => structuredClone(value);
const seedState = () => Object.fromEntries(Object.entries(resources).map(([name, resource]) => [name, clone(resource.seed)]));

export function createAdminStore(filePath) {
  let records;
  let writes = Promise.resolve();

  async function initialize() {
    if (records) return;
    try {
      records = JSON.parse(await readFile(filePath, 'utf8'));
      for (const [name, resource] of Object.entries(resources)) records[name] ||= clone(resource.seed);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      records = seedState();
      await persist();
    }
  }

  function persist() {
    const snapshot = JSON.stringify(records, null, 2);
    writes = writes.then(async () => {
      await mkdir(dirname(filePath), {recursive: true});
      const temporary = `${filePath}.${process.pid}.tmp`;
      await writeFile(temporary, snapshot, 'utf8');
      await rename(temporary, filePath);
    });
    return writes;
  }

  return {
    async list(name, {page = 1, perPage = 10, q = '', status = ''} = {}) {
      await initialize();
      const all = records[name];
      const needle = String(q).trim().toLowerCase();
      const filtered = all.filter(record => {
        const matchesSearch = !needle || Object.values(record).some(value => String(value).toLowerCase().includes(needle));
        return matchesSearch && (!status || record.status === status);
      });
      const start = (page - 1) * perPage;
      return {data: clone(filtered.slice(start, start + perPage)), total: filtered.length, page, perPage};
    },
    async get(name, id) {
      await initialize();
      const record = records[name].find(item => item.id === id);
      return record ? clone(record) : null;
    },
    async create(name, input) {
      await initialize();
      const now = new Date().toISOString();
      const record = {id: `${name.slice(0, 3)}_${randomUUID().slice(0, 8)}`, ...input, createdAt: now, updatedAt: now};
      records[name].unshift(record);
      await persist();
      return clone(record);
    },
    async update(name, id, input) {
      await initialize();
      const index = records[name].findIndex(item => item.id === id);
      if (index < 0) return null;
      records[name][index] = {...records[name][index], ...input, updatedAt: new Date().toISOString()};
      await persist();
      return clone(records[name][index]);
    },
    async remove(name, id) {
      await initialize();
      const index = records[name].findIndex(item => item.id === id);
      if (index < 0) return null;
      const [removed] = records[name].splice(index, 1);
      await persist();
      return clone(removed);
    },
    async summary() {
      await initialize();
      const customers = records.customers;
      const orders = records.orders;
      const products = records.products;
      return {
        customers: customers.length,
        activeCustomers: customers.filter(item => item.status === 'active').length,
        orders: orders.length,
        revenue: orders.filter(item => item.status !== 'refunded').reduce((sum, item) => sum + item.total, 0),
        lowStock: products.filter(item => item.stock < 10).length,
        recentOrders: clone(orders.slice(0, 5)),
      };
    },
  };
}
