$(document).ready(() => {
  /**
   * This function edits the DOM to display the number of character left to type
   * by the user
   */
  $("#tweet-text").on("input", function() {
    // Grab input and compute num of characters left
    const inputLength = $(this).val().length;
    const numCharLeft = 140 - inputLength;

    // Select counter
    // TODO: Change counter pinpoint for ID?
    const counter = $(this)
      .siblings(".new-tweet-statusbar")
      .children(".counter");

    // Edit the counter in the DOM
    counter.text(numCharLeft);

    // Chnage the color of the counter if negative
    if (numCharLeft >= 0) {
      counter.css("color", "inherit");
    } else {
      counter.css("color", "red");
    }
  });
});
