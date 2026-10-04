import {startAdmin} from './app.js';

const root = document.querySelector('#app');
if (!root) throw new Error('Missing #app mount node.');
const application = await startAdmin(root);
window.addEventListener('pagehide', () => application.destroy(), {once: true});
