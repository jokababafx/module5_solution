$(function () {

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Remove the class 'active' from home and switch to Menu button
  var switchMenuToActive = function () {
    // Remove 'active' from home button
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    // Add 'active' to menu button if not already there
    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    // On first load, show home view
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML,
      true); // Explicitly setting the flag to get JSON from server processed into an object literal
  });

  // Builds HTML for the home page based on categories array
  // returned from the server.
  function buildAndShowHomeHTML(categories) {

    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {

        // TODO: STEP 2: Here, call chooseRandomCategory, passing it retrieved 'categories'
        // Pay attention to what type of data that function returns vs what the chosenCategoryShortName
        // variable's name implies it expects.
        var chosenCategory = chooseRandomCategory(categories);

        // TODO: STEP 3: Substitute {{randomCategoryShortName}} in the home html snippet with the
        // chosen category from STEP 2. Use existing insertProperty function for that purpose.
        // Look through this code for an example of how to do use the insertProperty function.
        // WARNING! You are inserting something that will have to result in a valid Javascript
        // syntax because the substitution of {{randomCategoryShortName}} becomes an argument
        // being passed into the $dc.loadMenuItems function. Think about what that argument needs
        // to look like. For example, a valid call would look something like this:
        // $dc.loadMenuItems('L')
        // Hint: you need to surround the chosen category short name with something before inserting
        // it into the home html snippet.
        var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", "'" + chosenCategory.short_name + "'");

        // TODO: STEP 4: Insert the produced HTML in STEP 3 into the main page
        // Use the existing insertHtml function for that purpose. Look through this code for an example
        // of how to do that.
        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

      },
      false); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }


  // Given array of category objects, returns a random category object.
  function chooseRandomCategory(categories) {
    // Choose a random index into the array (from 0 inclusively until array length (exclusively))
    var randomArrayIndex = Math.floor(Math.random() * categories.length);

    // return category object with that randomArrayIndex
    return categories[randomArrayIndex];
  }

  // Load the menu categories view
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML);
  };

  // Load the menu items view
  // 'categoryShort' is a short_name for a category
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML);
  };

  // Builds HTML for the categories page based on the data
  // from the server
  function buildAndShowCategoriesHTML(categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            // Switch CSS class active to menu button
            switchMenuToActive();

            var categoriesViewHtml =
              buildCategoriesViewHtml(categories,
                categoriesTitleHtml,
                categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);
          },
          false);
      },
      false);
  }

  // Using categories data and snippets html
  // build categories view HTML to be inserted into page
  function buildCategoriesViewHtml(categories,
    categoriesTitleHtml,
    categoryHtml) {

    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html =
        insertProperty(html, "name", name);
      html =
        insertProperty(html,
          "short_name",
          short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for the

