(function ($) {
  'use strict';

  ////////////////////////////////////////////////////////////////
  //Page cursors
  ////////////////////////////////////////////////////////////////

  document
    .getElementsByTagName('body')[0]
    .addEventListener('mousemove', function (n) {
      (t.style.left = n.clientX + 'px'),
        (t.style.top = n.clientY + 'px'),
        (e.style.left = n.clientX + 'px'),
        (e.style.top = n.clientY + 'px'),
        (i.style.left = n.clientX + 'px'),
        (i.style.top = n.clientY + 'px');
    });
  var t = document.getElementById('cursor'),
    e = document.getElementById('cursor2'),
    i = document.getElementById('cursor3');
  function n(t) {
    e.classList.add('hover'), i.classList.add('hover');
  }
  function s(t) {
    e.classList.remove('hover'), i.classList.remove('hover');
  }
  s();
  for (
    var r = document.querySelectorAll('.hover-target'), a = r.length - 1;
    a >= 0;
    a--
  ) {
    o(r[a]);
  }
  function o(t) {
    t.addEventListener('mouseover', n), t.addEventListener('mouseout', s);
  }

  //Navigation

  var app = (function () {
    var body = undefined;
    var menu = undefined;
    var menuItems = undefined;
    var init = function init() {
      body = document.querySelector('body');
      menu = document.querySelector('.menu-icon');
      menuItems = document.querySelectorAll('.nav__list-item');
      applyListeners();
    };
    var applyListeners = function applyListeners() {
      menu.addEventListener('click', function () {
        return toggleClass(body, 'nav-active');
      });
    };
    var toggleClass = function toggleClass(element, stringClass) {
      if (element.classList.contains(stringClass))
        element.classList.remove(stringClass);
      else element.classList.add(stringClass);
    };
    init();
  })();

  //Switch light/dark
  // let txt = document.getElementsByClassName('projects__row-content-desc');

  $('#switch').on('click', function () {
    if ($('body').hasClass('light')) {
      $('body').removeClass('light');
      $('#switch').removeClass('switched');
      $('.section').addClass('switched');
      $('.cc-profile-image').removeClass('whiteShade');
      $('.projects__row-content-desc').addClass('white__txt');
    } else {
      $('body').addClass('light');
      $('#switch').addClass('switched');
      $('.section').removeClass('switched');
      $('.cc-profile-image').addClass('whiteShade');
      $('.projects__row-content-desc').removeClass('white__txt');
    }
  });
})(jQuery);
////////////////////////////////////////////////////////////////
// CODEPEN JS
////////////////////////////////////////////////////////////////

$(document).ready(function () {
  AOS.init({
    // uncomment below for on-scroll animations to played only once
    once: true,
  }); // initialize animate on scroll library
});

// Smooth scroll for links with hashes
$('a.smooth-scroll').click(function (event) {
  // On-page links
  if (
    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
    location.hostname == this.hostname
  ) {
    // Figure out element to scroll to
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      event.preventDefault();
      $('html, body').animate(
        {
          scrollTop: target.offset().top,
        },
        1000,
        function () {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(':focus')) {
            // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          }
        }
      );
    }
  }
});
