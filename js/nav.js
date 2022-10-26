"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
    console.debug("navAllStories", evt);
    hidePageComponents();
    storyList = await StoryList.getStories();
    putStoriesOnPage($allStoriesList, storyList);
    $allStoriesList.show();
}

$body.on("click", "#nav-all", navAllStories);


/** Show form to add a story */

function navAddStory(evt) {
    console.debug("navAddStory", evt);
    hidePageComponents();
    $addStoryForm.show();
}

$submit.on("click", navAddStory)

/** Show list of user favorite stories when click favorites */

async function showFavorites(evt) {
    console.debug("showFavorites", evt);
    hidePageComponents();
    await currentUser.updateFavoriteList();
    $favoriteStoriesList.show();
}

$favorites.on("click", showFavorites)

/** Show list of user submitted stories when click My Stories */

async function showMyStories(evt) {
    console.debug("showMyStories", evt);
    hidePageComponents();
    await currentUser.updateMyStoriesList();
    console.log('showing trash');
    $('.trash-icon').show();
    $myStoriesList.show();
}

$myStories.on("click", showMyStories)

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
    console.debug("navLoginClick", evt);
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
    console.debug("updateNavOnLogin");
    $(".main-nav-links").show();
    $(".nav-center").show();
    $navLogin.hide();
    $navLogOut.show();
    $navUserProfile.text(`${currentUser.username}`).show();
}