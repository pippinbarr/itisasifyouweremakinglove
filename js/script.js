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

$(document).ready(function () {

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
    startShiver();
    break;

    case 'b':
    shivering = false;
    break;

    case 'c':
    startPulse();
    break;

    case 'd':
    pulsing = false;
    break;
  }
}

function startShiver() {
  if (shivering) return;
  shivering = true;
  shiver();
}

function shiver() {
  $('#slider').effect('shake',{
    distance: shiverAmount,
    times: shiverFrequency
  },function () {
    if (shivering) {
      shiver();
    }
  });
}

function startPulse() {
  $('#slider').addClass('pulse');

  // if (pulsing) return;
  // pulsing = true;
  // pulse();
}

function pulse() {
  $('#slider').animate({
    height: pulseSize + 'vh'
  },function () {
    if (pulsing) {
      pulse();
    }
  });
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
