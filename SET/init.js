// Set up store, Tables and Persistence.

const { createStore, createLocalPersister } = TinyBase;

// Create the store
export const store = createStore();

// Optional: expose for debugging
window.store = store;

// Define empty tables
store.setTables({
  expenses: {},
  categories: {},
  subcategories: {},
  payees: {},
  tags: {}
});

// Start auto-save to LocalStorage
const persister = createLocalPersister(store, "SecureExpenseTracker");
persister.startAutoLoad().then(() => {
  persister.startAutoSave();
  console.log("TinyBase store initialized and synced.");
});
