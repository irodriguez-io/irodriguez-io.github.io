import { store } from "./init.js";


// Expenses Schema.
// id: number (auto)
// Each expense references other entities by ID
/*
{
  description: string,
  amount: number,
  date: string,           // "2025-06-15"
  categoryId: number,
  subcategoryId: number,
  payeeId: number,
  tagIds: string          // comma-separated "1,2,3"
}
*/


// Categories Schema.
/* 
{
  name: string
}
*/

// Create a new category and return its ID
export function addCategory(name) {
  return store.addRow("categories", { name });
}

// Get all categories
export function getAllCategories() {
  return store.getTable("categories");
}

// Update a category name by ID
export function updateCategory(id, newName) {
  store.setCell("categories", id, "name", newName);
}

// Delete a category
export function deleteCategory(id) {
  store.delRow("categories", id);
}

//Sub Categories Table.

{
  name: string,
  categoryId: number   // foreign key to Categories
}

// Payees Table.

{
  name: string
}

// Tags Table.

{
  name: string
}
