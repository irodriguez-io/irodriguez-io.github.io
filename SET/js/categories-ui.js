// category-ui.js
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
} from "./data.js";


/**
 * Renders the list of categories in the <ul id="category-list"> element.
 */
function renderCategoryList() {
  const listElement = document.getElementById("category-list");
  listElement.innerHTML = ""; // Clear existing list

  const categories = getAllCategories();

  for (const id in categories) {
    const { name } = categories[id];

    const listItem = document.createElement("li");
    listItem.dataset.id = id;

    listItem.innerHTML = `
      <span>${name}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    listElement.appendChild(listItem);
  }
}

const form = document.getElementById("category-form");
const nameInput = document.getElementById("category-name");
const idInput = document.getElementById("category-id");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const existingId = idInput.value;

  if (!name) return;

  if (existingId) {
    updateCategory(existingId, name);
  } else {
    addCategory(name);
  }

  form.reset();
  idInput.value = ""; // clear hidden field
  renderCategoryList();
});

document.getElementById("category-list").addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  if (e.target.classList.contains("edit-btn")) {
    const categories = getAllCategories();
    const category = categories[id];
    if (category) {
      nameInput.value = category.name;
      idInput.value = id;
    }
  }

  if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      deleteCategory(id);
      renderCategoryList();
    }
  }
});

renderCategoryList();
