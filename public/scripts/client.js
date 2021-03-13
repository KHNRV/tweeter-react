/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/**
 * This function output a message of how long ago that tweet was posted
 * @author fearofawhackplanet (stackoverflow)
 * @param {*} prev
 */
const timeDifferenceFromNow = function(prev) {
  const current = new Date();
  const previous = new Date(prev);

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "approximately " + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "approximately " + Math.round(elapsed / msPerYear) + " years ago";
  }
};
/**
 * Escape HTML unsafe characters
 * @param {string} str
 */
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

/**
 * Create a tweet element from a tweet object
 * @param {object} tweetObj
 */
const createTweetElement = function(tweetObj) {
  return $(`
  <article class="tweet">
    <header>
      <div class="user-meta">
        <img src="${tweetObj.user.avatars}" class="avatar">
        <div class="username">${tweetObj.user.name}</div>
      </div>
      <div class="user-handle">${tweetObj.user.handle}</div>
    </header>
    <main>${escape(tweetObj.content.text)}
    </main>
    <footer>
      <div class="date">${timeDifferenceFromNow(tweetObj.created_at)}</div>
      <div class="action-bar">
        <img src="./icons/flag.png" alt="Flag">
        <img src="./icons/share.png" alt="Share">
        <img src="./icons/plus_one.png" alt="+1">
      </div>
    </footer>
  </article>`);
};

/**
 * Renders all the tweet objects in a given database
 * @param {array} tweetsArr
 */
const renderTweets = function(tweetsArr) {
  $.each(
    tweetsArr.sort((a, b) => b.created_at - a.created_at),
    (index, tweetObj) => {
      const $tweet = createTweetElement(tweetObj);
      $("#tweets-container").append($tweet);
    }
  );
};

/**
 * This function when called append all the tweets in the database to the
 * tweets-container
 */
const loadTweets = function() {
  $.ajax("/tweets", { method: "GET" }).then(function(tweetsArr) {
    $("#tweets-container").empty();
    renderTweets(tweetsArr);
  });
};
/**
 * This function append a given error message into the DOM. If no message is
 * given, it will empty the display area
 * @param {string} str
 */
const newTweetError = function(str) {
  const $errorDisplayArea = $("#new-tweet").find(".error");
  $errorDisplayArea.slideUp("slow");
  $errorDisplayArea.promise().done(function() {
    if (str) {
      $errorDisplayArea.text(str);
      $errorDisplayArea.slideDown("slow");
    } else {
      $errorDisplayArea.empty();
    }
  });
};

/**
 * When the document is ready, render all the tweets
 */
$(document).ready(function() {
  /**
   * This function adds a tweet to the database if it fits the character count
   * requirements
   */
  $(function() {
    $("form").on("submit", function(event) {
      event.preventDefault();

      const numOfChar = $("textarea").val().length;
      newTweetError();

      if (numOfChar <= 0) {
        newTweetError("You should type something first");
      } else if (numOfChar > 140) {
        newTweetError("You typed too much");
      } else {
        const newTweetContent = $(this).serialize();
        $("form").trigger("reset");
        $("#new-tweet").find(".counter").text("140");
        $.post("/tweets", newTweetContent, function() {
          loadTweets();
        });
      }
    });
  });
  loadTweets();
});
