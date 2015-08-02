/* global $: false */

$(document).ready(function () {
    'use strict';
    function displayScores(scores) {
        scores.forEach(function(score, index){
            var button = $('button[value='+(index+1)+']');
            $('.score'+index).remove();
            button.append('<p class="score'+index+'">'+score+'</p>');
        });
    }
    var scores = [];
    var currentChoice = 0;
    var currentChoiceElt = $('#currentChoice');
    if (currentChoiceElt.length > 0) {
        currentChoice = currentChoiceElt.text();
    }
    //choices start at 1, 0 means no choice
    if (currentChoice !== 0) {
        $('button[value='+currentChoice+']').addClass('active');
    }
    var choices = $('.btn-group-vertical').find('button');
    choices.each(function (i, elt) {
        scores.push(+$(elt).attr('data-votes'));
        displayScores(scores);
        $(elt).on('click', function () {
            if (elt.value !== currentChoice) {
                if (currentChoice-1 >= 0) {
                    scores[currentChoice - 1] -= 1;
                }
                currentChoice = elt.value;
                scores[currentChoice-1] += 1;
                displayScores(scores);
                $.ajax(
                    window.location.pathname,
                    {
                        type: 'POST',
                        data: {
                            choice: currentChoice
                        },
                        success: function (res) {
                            $('.vote').removeClass('active');
                            $('button[value='+currentChoice+']').addClass('active');

                        }

                    }
                );
            }
        });
    });
});
