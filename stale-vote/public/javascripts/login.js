/* global console: false, $: false */

$(document).ready(function(){
    'use strict';
    $('#loginUser').on('click', function(event){
        event.preventDefault();
        $.ajax({
                type: 'POST',
                data: {
                    username: $('#name').val(),
                    password: $('#password').val()
                },
                success: function(res){
                    if (res.success) {
                        window.location.replace('/');
                    }
                }
            }
        );
    });
});