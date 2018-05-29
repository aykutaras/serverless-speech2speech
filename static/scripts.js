const API_ENDPOINT = "https://APIURL/dev/";

document.getElementById("sourceSelected").onchange = function(e) {
    let source = $(e.target).val();
    if (source !== 'en') {
        $("#targetSelected").children('option:not(:first)').hide();
    } else {
        $("#targetSelected").children('option:not(:first)').show();
    }
};

document.getElementById("translateButton").onclick = function() {
    let inputData = {
        "sourceLanguageCode": $("#sourceSelected").val(),
        "targetLanguageCode": $("#targetSelected").val(),
        "sourceText": $('#postTranslateText').val()
    };

    if (inputData.sourceLanguageCode === 'n/a') {
        return;
    }

    $.ajax({
        url: API_ENDPOINT + "translate",
        type: 'POST',
        data:  JSON.stringify(inputData)  ,
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $("#postText").val(response.body.translatedText);
            $('#voiceSelected').val($('#voiceSelected optgroup[label=' + inputData.targetLanguageCode + ']').children().first().val())
        },
        error: function () {
            alert("error");
        }
    });
};

document.getElementById("sayButton").onclick = function() {
    let inputData = {
        "voice": $('#voiceSelected option:selected').val(),
        "text" : $('#postText').val()
    };

    $.ajax({
        url: API_ENDPOINT,
        type: 'POST',
        data:  JSON.stringify(inputData)  ,
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $("#postIDreturned").val("Post ID: " + response.body.speechId);
        },
        error: function () {
            alert("error");
        }
    });
};


document.getElementById("searchButton").onclick = function() {
    let postId = $('#postId').val();

    $.ajax({
        url: API_ENDPOINT + (postId !== '' ? '?speechId='+postId : 'all'),
        type: 'GET',
        success: function (response) {

            $('#posts tr').slice(1).remove();

            jQuery.each(response.body, function(i,data) {
                let player = "<audio controls><source src='" + data['speechUrl'] + "' type='audio/mpeg'></audio>"

                $("#posts").append("<tr> \
                    <td>" + data['id'] + "</td> \
                    <td>" + data['vocalist'] + "</td> \
                    <td>" + data['speechText'] + "</td> \
                    <td>" + player + "</td> \
                    </tr>");
                });
        },
        error: function () {
            alert("error");
        }
    });
};

document.getElementById("postText").onkeyup = function() {
    let length = $(postText).val().length;
    $("#charCounter").val("Characters: " + length);
};
