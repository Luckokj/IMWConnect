// storage wrapper: static import of @react-native-async-storage/async-storage
// This makes bundlers include the dependency and surfaces clear errors if the package
// is missing. Falls back to window.localStorage for web.
// Robust storage wrapper. Tries to load @react-native-async-storage/async-storage
// (require or dynamic import). Falls back to window.localStorage on web and
// an in-memory store as a last resort.
const isWeb = typeof window !== 'undefined' && !!window.localStorage;

let impl = null;
let initTried = false;
const memoryStore = Object.create(null);

async function initImpl() {
  if (initTried) return impl;
  initTried = true;
  // try require first (works in many RN bundlers)
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const mod = require('@react-native-async-storage/async-storage');
    impl = mod && (mod.default || mod);
    if (impl) return impl;
  } catch (e) {
    // ignore
  }

  // try dynamic import
  try {
    // dynamic import returns a promise; catch if not available
    // eslint-disable-next-line import/no-dynamic-require
    const mod = await import('@react-native-async-storage/async-storage');
    impl = mod && (mod.default || mod);
    if (impl) return impl;
  } catch (e) {
    // ignore
  }

  impl = null;
  // eslint-disable-next-line no-console
  console.log('storage: no AsyncStorage implementation found; falling back');
  return impl;
}

export async function getItem(key) {
  try {
    await initImpl();
    if (impl && typeof impl.getItem === 'function') {
      // eslint-disable-next-line no-console
      console.log('storage: using AsyncStorage.getItem for key', key);
      return await impl.getItem(key);
    }
    if (isWeb) {
      // eslint-disable-next-line no-console
      console.log('storage: using window.localStorage.getItem for key', key);
      return window.localStorage.getItem(key);
    }
    return memoryStore[key] || null;
  } catch (err) {
    // console.warn('storage.getItem error', err);
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await initImpl();
    if (impl && typeof impl.setItem === 'function') {
      // eslint-disable-next-line no-console
      console.log('storage: using AsyncStorage.setItem for key', key);
      return await impl.setItem(key, value);
    }
    if (isWeb) { console.log('storage: using window.localStorage.setItem for key', key); window.localStorage.setItem(key, value); return; }
    memoryStore[key] = value;
    return;
  } catch (err) {
    // console.warn('storage.setItem error', err);
  }
}

export async function removeItem(key) {
  try {
    await initImpl();
    if (impl && typeof impl.removeItem === 'function') {
      // eslint-disable-next-line no-console
      console.log('storage: using AsyncStorage.removeItem for key', key);
      return await impl.removeItem(key);
    }
    if (isWeb) { console.log('storage: using window.localStorage.removeItem for key', key); window.localStorage.removeItem(key); return; }
    delete memoryStore[key];
    return;
  } catch (err) {
    // console.warn('storage.removeItem error', err);
  }
}

export default { getItem, setItem, removeItem };
