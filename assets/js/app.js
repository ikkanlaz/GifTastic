$(document).ready(function () {
    var reactionList = ["happy", "excited", "sad", "love", "thumbs up", "shrug", "surprised", "awkward", "angry", "confused"];
    var offset = 0;
    var limit = 36;
    var imageColumnHeights = [];
    var windowWidth = $(window).width();
    var currentSearch;


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

    function addGif(data) {
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
        var minIndex = indexOfMin(imageColumnHeights);
        $("#col-" + minIndex).append(newGifContainer);
        imageColumnHeights[minIndex] += parseInt(data.images.fixed_width_still.height);
    }

    function indexOfMin(arr) {
        if (arr.length === 0) {
            return -1;
        }
        var min = arr[0];
        var minIndex = 0;
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                minIndex = i;
                min = arr[i];
            }
        }
        return minIndex;
    }

    function setNumberOfColumns() {
        if (windowWidth >= 815) {
            imageColumnHeights = [0, 0, 0, 0];
        } else if (windowWidth < 815 && windowWidth >= 615) {
            imageColumnHeights = [0, 0, 0];
        } else if (windowWidth < 615) {
            imageColumnHeights = [0, 0];
        }
    }

    function getGifs() {
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + currentSearch + "&offset=" + offset + "&limit=" + limit + "&api_key=dc6zaTOxFJmzC";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            if (response.meta.status === 200) {
                var numGifs = response.pagination.count;
                for (var i = 0; i < numGifs; i++) {
                    addGif(response.data[i]);
                }
            }
        });
    }

    $("#reaction-submit").on("click", function (event) {
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
        pageNum = 0;
        setNumberOfColumns();
        currentSearch = this.value;
        getGifs();
    });

    $(document).on("click", ".gif", function () {
        var url = $(this).attr("src");
        if (url !== $(this).attr("data-gif")) {
            $(this).attr("src", $(this).attr("data-gif"));
        } else {
            $(this).attr("src", $(this).attr("data-still"));
        }
    });

    $(window).resize(function () {
        windowWidth = $(window).width();
    })

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            offset += limit;
            getGifs();
        }
    });

    renderButtons();
});
