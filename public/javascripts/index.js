/* global console: false, $: false */

$(document).ready(function(){
    'use strict';
    $('#newPoll').submit(function(event){
        event.preventDefault();
        $.ajax('/new-poll',
            {
                type: 'POST',
                data: {question: $('#pollQuestion').val()},
                success: function(response) {
                    if (response.success === true) {
                        window.location.replace('/edit-poll/'+response.pollID);
                    }
                }
            }
        );

    });

});