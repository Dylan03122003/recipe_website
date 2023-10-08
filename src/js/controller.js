import * as model from './model.js';
import { MODEL_CLOSE_SECOND } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  // Get the recipe data
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};
const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    // Render initial result
    resultsView.render(model.getSearchResultPage(1));
    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {}
};
const controlPagination = function (gotoPage) {
  // Render new result
  resultsView.render(model.getSearchResultPage(gotoPage));
  // Render new pagination button
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // add or delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // update recipe view because of changing of bookmark
  recipeView.update(model.state.recipe);
  // render bookmark view
  bookmarkView.render(model.state.bookmarks);
};
const controlRenderBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.recipe);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SECOND * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};
const init = function () {
  bookmarkView.addHandlerRender(controlRenderBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateRecipe(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
