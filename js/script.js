/**********************************************

Slider
Pippin Barr

Sexy?

**********************************************/

var shivering = false;
var shiverAmount = 2;
var shiverFrequency = 5;

var pulsing = false;
var pulseSize = 52;

var breathSFX;

$(document).ready(function () {

  breathSFX = new Audio('audio/breath-mono.wav');
  breathSFX.onended = function () {
    breathSFX.play();
  }

  // Set up the jQuery UI slider
  $( "#slider" ).slider({
    orientation: "vertical",
    min: 0,
    max: 100,
    value: 100,
    slide: slide,
  });

  // Fit the slider in the window and handle resizing
  fitSliderToViewport();
  $(window).on('resize',fitSliderToViewport);

  $(window).on('keydown',handleKeyDown);

  window.requestAnimationFrame(update);

  $slider = $('#slider');

});


function update() {
  window.requestAnimationFrame(update);
}


// slide()
//
// Called when the slider is moved
function slide(event,ui) {
  console.log(ui.value);
}


function handleKeyDown(event) {
  switch (event.key) {
    case 'a':
    $('#shiver').toggleClass('shiver');
    break;

    case 'b':
    $('#pulse').toggleClass('pulse');
    break;

    case 'c':
    $('#twist').toggleClass('twist');
    break;

    case 'd':
    $('body').toggleClass('gradient');
    break;

    case 'e':
    $('.ui-slider-handle').toggleClass('knob');
    break;

    case 'f':
    $('#blink').animate({
      opacity: 1
    },250,function() {
      $('#blink').animate({
        opacity: 0
      },250)
    });

    case 'g':
    if (!breathSFX.paused || breathSFX.currentTime) {
      breathSFX.pause();
      breathSFX.currentTime = 0;
    }
    else {
      breathSFX.play();
    }

  }
}


// fitSliderToViewport()
//
// Called on resize. Moves the slider to the centre of the viewport.
function fitSliderToViewport() {
  $('#slider').offset({
    top: $(window).height()/2 - $('#slider').height()/2,
    left: $(window).width()/2 - $('#slider').width()/2,
  })
}
