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

var selected = 50;

$(document).ready(function () {

  breathSFX = new Audio('audio/breath-mono.wav');
  breathSFX.onended = function () {
    breathSFX.play();
  }

  // Set up the jQuery UI slider
  $("#slider").slider({
      orientation: "vertical",
      min: 0,
      max: 100,
      value: selected,
      // step: 10,
      slide: slide,
    }).slider('pips', {
      step: 10,
      rest: 'label',
      labels: ['0','','','','','','','','','','1','','','','','','','','','','2','','','','','','','','','','3','','','','','','','','','','4','','','','','','','','','','5','','','','','','','','','','6','','','','','','','','','','7','','','','','','','','','','8','','','','','','','','','','9','','','','','','','','','','10']
    });

    // This isn't quite working
    $('.ui-slider-pips').not('#slider').unbind('mousedown');

  // Fit the slider in the window and handle resizing
  fitSliderToViewport();
  $(window).on('resize',fitSliderToViewport);

  $(window).on('keydown',handleKeyDown);

  window.requestAnimationFrame(update);

  $slider = $('#slider');

});


function update() {
  window.requestAnimationFrame(update);

  console.log(selected);
}


// slide()
//
// Called when the slider is moved
function slide(event,ui) {
  var tens = Math.round(ui.value / 10) * 10;
  var remainder = Math.abs(ui.value - tens);
  $('.ui-slider-pip').removeClass('ui-slider-pip-selected');
  if (remainder <= 3) {
    selected = tens;
    $('.ui-slider-pip-' + selected).addClass('ui-slider-pip-selected');
  }
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
