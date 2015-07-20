/**
 * Created by Justin on 7/16/2015.
 */


/* global $: false */
$(document).ready(function(){
    'use strict';

    var pathname = document.location.pathname;

    if (pathname === '/') {
        $('.header-links').find('#main-page-link').addClass('active');
    } else if (pathname === '/login') {
        $('.header-links').find('#login-page-link').addClass('active');
    } else if (pathname === '/register') {
        $('.header-links').find('#register-page-link').addClass('active');
    } else if (pathname === '/register') {
        $('.header-links').find('#register-page-link').addClass('active');
    }

    $('#logout-page-link').on('click', function(){
        $.ajax('/logout',
            {
                type: 'POST',
                success: function(res) {
                    if (res.success === true) {
                        window.location.replace('/');
                    }
                }
            }
        );
    });
});


function pageMessage(strMessage) {
    //in the future this should set a message in the dom, not an alert
    alert(strMessage);
}