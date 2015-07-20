/* global console: false, $: false */
$(document).ready(function(){
    'use strict';
    $('.delete-link').each(function(i, elt){
        $(elt).on('click', function(event){
            event.preventDefault();
            $.ajax('/delete-poll',{
                type: 'POST',
                data: {
                    pollId: $(elt).attr('data-poll-id')
                },
                success: function(res){
                    if (res.success === true) {
                        window.location.reload();
                    } else {
                        console.log(res);
                    }
                }
            });
        });
    });
});