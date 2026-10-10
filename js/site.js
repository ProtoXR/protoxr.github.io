(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Solid nav background once the page scrolls.
  var nav = document.querySelector('.nav');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal sections as they enter the viewport.
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Only one video plays at a time.
  var allVideos = Array.prototype.slice.call(document.querySelectorAll('video'));
  function pauseOthers(current) {
    allVideos.forEach(function (video) {
      if (video !== current && !video.paused) video.pause();
    });
  }
  allVideos.forEach(function (video) {
    video.addEventListener('play', function () { pauseOthers(video); });
  });

  function safePlay(video) {
    var promise = video.play();
    if (promise && promise.catch) promise.catch(function () {});
  }

  // Featured video autoplays (muted) while on screen.
  var feature = document.querySelector('.feature-video');
  var soundToggle = document.querySelector('.sound-toggle');
  if (feature) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          // Don't interrupt an archive preview the visitor started.
          var previewPlaying = allVideos.some(function (video) {
            return video !== feature && !video.paused;
          });
          if (entry.isIntersecting && !previewPlaying) safePlay(feature);
          else if (!entry.isIntersecting) feature.pause();
        });
      }, { threshold: 0.35 }).observe(feature);
    }

    soundToggle.addEventListener('click', function () {
      var unmute = feature.muted;
      feature.muted = !unmute;
      soundToggle.setAttribute('aria-pressed', String(unmute));
      soundToggle.setAttribute('aria-label', unmute ? 'Mute video' : 'Unmute video');
      if (unmute) safePlay(feature);
    });
  }

  // Archive previews play on hover, or on tap for touch screens.
  document.querySelectorAll('.card').forEach(function (card) {
    var media = card.querySelector('.card-media');
    var video = card.querySelector('.card-video');

    function start() {
      card.classList.add('is-playing');
      safePlay(video);
    }
    function stop() {
      card.classList.remove('is-playing');
      video.pause();
    }

    video.addEventListener('pause', function () { card.classList.remove('is-playing'); });

    if (canHover) {
      card.addEventListener('mouseenter', start);
      card.addEventListener('mouseleave', stop);
    } else {
      media.addEventListener('click', function () {
        if (video.paused) start();
        else stop();
      });
    }
  });
})();
