$(document).ready(function () {
    var reactionList = ["happy", "excited", "sad", "love", "thumbs up", "shrug", "surprised", "awkward", "angry", "confused"];
    var pageNum = 0;

    function renderButtons() {
        $(".btn-container").empty();
        for (var i = 0; i < reactionList.length; i++) {
            var newBtn = $("<button></button>");
            newBtn.addClass("btn btn--reaction");
            newBtn.text(reactionList[i]);
            newBtn.attr("value", reactionList[i]);
            $(".btn-container").append(newBtn);
        }
    }

    function addGif(data, collumn) {
        var newGifContainer = $("<div></div>");
        newGifContainer.addClass("gif-container");
        var newGif = $("<img>");
        newGif.addClass("gif");
        newGif.attr("src", data.images.fixed_width_still.url);
        newGif.attr("data-gif", data.images.fixed_width.url)
        newGif.attr("data-still", data.images.fixed_width_still.url)
        newGifContainer.append(newGif);

        var newGifRating = $("<span></span>");
        newGifRating.addClass("gif-rating");
        newGifRating.text(data.rating.toUpperCase());
        newGifContainer.append(newGifRating);
        $(collumn).append(newGifContainer);
    }

    $(".reaction-submit").on("click", function (event) {
        event.preventDefault();
        var newReaction = $("#reaction-input").val().trim();
        if (newReaction.length !== 0) {
            reactionList.push(newReaction);
            renderButtons();
        }
        $("#reaction-input").val("");
    });

    $(document).on("click", ".btn--reaction", function () {
        $(".gif-column").empty();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + this.value + "&offset=" + pageNum + "&limit=24&api_key=dc6zaTOxFJmzC";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            if (response.meta.status === 200) {
                var numGifs = response.pagination.count;
                for (var i = 0; i < numGifs; i++) {
                    var data = response.data[i];
                    if (i < numGifs / 4) {
                        addGif(data, "#col-1");
                    } else if (i < numGifs / 2) {
                        addGif(data, "#col-2");
                    } else if (i < numGifs - (numGifs / 4)) {
                        addGif(data, "#col-3");
                    } else {
                        addGif(data, "#col-4");
                    }

                }
            }
        });
    });
    $(document).on("click", ".gif", function () {
        var url = $(this).attr("src");
        if (url !== $(this).attr("data-gif")) {
            $(this).attr("src", $(this).attr("data-gif"));
        } else {
            $(this).attr("src", $(this).attr("data-still"));
        }
    });

    renderButtons();


});
