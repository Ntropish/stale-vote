/* global $: false, console: false */

$(document).ready(function(){
    'use strict';
    $('#registerUser').on('click', registerUser);

});

function registerUser() {
    'use strict';
    var username = $('#name').val();
    var password = $('#password').val();
    if (password !== $('#confirm').val()) {
        pageMessage('Password doesn\'t match');
        return false;
    }
    $.ajax(
        {
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(response){
                if (response.success === true) {
                    pageMessage("Registered!");
                    $.ajax( '/login',
                        {
                            type: 'POST',
                            data: {
                                username: username,
                                password: password
                            },
                            success: function(res) {
                                if (res.success === true) {
                                    window.location.replace('/');
                                }
                            }
                        }
                    );
                } else {
                    console.log(response);
                }
            }
        }
    );
}
