"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
async function getAndShowStoriesOnStart() {
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();
    putStoriesOnPage($allStoriesList, storyList);
    $allStoriesList.show();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
function generateStoryMarkup(story) {
    console.debug("generateStoryMarkup");
    const hostName = story.getHostName();
    let isFavorite = 'fa-regular';
    try {
        for (let favorite of currentUser.favorites) {
            if (favorite.storyId == story.storyId) {
                isFavorite = 'fa-solid';
            }
        }
    } catch {}
    return $(`
      <div class="story" id="${story.storyId}">
      <span class="trash-icon hidden"><i class="fa-solid fa-trash-can"></i></span>
      <span class="fav-icon"><i class="${isFavorite} fa-heart"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </div>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage(pageList, storyList) {
    console.debug("putStoriesOnPage");
    pageList.empty();
    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
        const $story = generateStoryMarkup(story);
        pageList.append($story);
    }
    // change background color of every second story
    $(".story:odd").each(function() {
        this.style.backgroundColor = '#F2D2BD';
    });
}

/** Click handler for adding/removing favorite stories */
async function handleFavClick(target) {
    if (target.classList.contains('fa-regular')) {
        await currentUser.addFavorite(target.parentElement.parentElement.id);
    } else {
        await currentUser.removeFavorite(target.parentElement.parentElement.id);
    }
    target.classList.toggle('fa-solid');
    target.classList.toggle('fa-regular');
}

/** Activates click handler for adding/removing favorite stories when clicking on a heart */
$('.stories-list').on("click", '.fa-heart', (evt) => handleFavClick(evt.target));

/** Adds a new story to the storylist when add-story-form button is clicked. */
async function addStoryToPage(evt) {
    evt.preventDefault();
    // Check that the user has a token and has filled out all form fields before allowing a submit.
    if (currentUser.loginToken && $('#add-story-author').val() && $('#add-story-title').val() && $('#add-story-url').val()) {
        const newStory = {};
        newStory.title = $('#add-story-title').val();
        newStory.author = $('#add-story-author').val();
        newStory.url = $('#add-story-url').val();
        const submittedStory = await storyList.addStory(currentUser, newStory);
        console.debug(submittedStory);
        hidePageComponents();
        storyList = await StoryList.getStories();
        putStoriesOnPage($allStoriesList, storyList);
        $allStoriesList.show();
        $addStoryForm.trigger("reset");
    } else {
        return
    }
}

$addStoryForm.on("submit", addStoryToPage);

/** Deletes a user's story */
async function handleTrashClick(target) {
    const storyId = target.parentElement.parentElement.id // This div id set to storyId in generateStoryMarkup
    await Story.deleteStory(storyId);
    showMyStories();
}

/** Click Handler for using trash icon to delete a story */
$myStoriesList.on("click", '.trash-icon', (evt) => handleTrashClick(evt.target));