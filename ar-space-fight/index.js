$(document).ready(function(){
  /*
  $('.slider-main').slick({
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    asNavFor: '.slider-main',
    dots: true,
    centerMode: true,
    focusOnSelect: true,
    arrows: true,
    variableWidth: true
  });
  */

  $(document).ready(function() {
    $("#emailListSignupForm").submit(function(e) {

      var green = "#5cb85c";
      var red = "#d9534f";

      console.log('submitting');
      e.preventDefault();
      var $form = $(this),
        url = $form.attr('action'); params = { name: $form.find('input[name="name"]').val(),
          email: $form.find('input[name="email"]').val(),
          list: $form.data().listId,
          boolean: true
        }
      window.message = function(text, color){
        $("#status").css("color", color).text(text);
      }
      $form.find('input').attr("disabled", "disabled");
      message('Signing up...', 'black');
      $.post(url, params,
        function(data) {
          console.dir(data);
          if (data) {
            $form.find('input').removeAttr("disabled");
            if (data == "Some fields are missing.") {
              message("Please fill in your name and email.", red);
            } else if (data == "Invalid email address.") {
              message("Uhoh - that doesn't look like an email address. Could you please enter your email again?", red);
            } else if (data == "Invalid list ID.") {
              message("Oops - something went wrong (I tried to sign you up for an email list that doesn't exist). To get added, send me an email at contact@protoxr.com instead!", red);
            } else if (data == "Already subscribed.") {
              message("You're already subscribed!", green);
            } else {
              $("#status").text("Please check your email to confirm your subscription.");
              $("#status").css("color", green);
              $form.find('input, button').hide();
            }
          } else {
            alert("Sorry, unable to subscribe. Please try again later!");
            message("Oops - something went wrong (email list server had an error). To get added, send an email at contact@protoxr.com instead!", red);
          }
        }
      );
    });
  });
});
