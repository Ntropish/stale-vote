/* global console: false, $: false */

$(document).ready(function () {
    'use strict';
    function savePoll(event, goLive) {
        event.preventDefault();
        var choices = [];
        $('.choice').each(function (i, elt) {
            choices.push(elt.value);
        });
        console.log(choices);
        $.ajax('/edit-poll/'+pollID,
            {
                type: 'POST',
                data: {choices: choices,
                    goLive: goLive
                },
                success: function (response) {
                    console.log(response);
                    if (response.success === true) {
                        //window.location.replace('/edit-poll/' + response.pollID);
                    }
                }
            }
        );

    }
    var pollID = $('#pollID').text();
    $('#addChoice').on('click', function(event) {
        $('#choicesList').append(
            $('<div class="input-group"><input type="text" class="form-control choice" placeholder="Choice"><span class="input-group-btn"><button class="btn btn-danger deleteChoice" type="button">X</button></span></div>')
        );
    });
    $('#savePoll').on('click', function(event){
        savePoll(event, false);
    } );
    $('#submitPoll').on('click', function(event){
        savePoll(event, true);
    } );

});
