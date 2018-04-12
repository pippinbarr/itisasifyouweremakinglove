/**********************************************

Slider
Pippin Barr

Sexy?

**********************************************/

var MAX = 100;
var MIN = 0;

var breathSFX;
var toneSFX;

var synth;
var baseFrequency = 110;

var selected = 50;

var upper = 70;
var lower = 40;
var previous = lower;
var slidesRequired = 10;
var slides = 0;

$(document).ready(function () {

  breathSFX = new Audio('audio/breath-mono.wav');
  breathSFX.onended = function () {
    breathSFX.play();
  }

  toneSFX = new Audio('audio/tone.wav');

  setupFlocking();

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

  generateInstruction();
});

function setupFlocking() {
  // To use flocking we have to initialise the (sound) environment
  var environment = flock.init();

  // ... and start it.
  environment.start();

  synth = flock.synth({
    synthDef: {
      id: "carrier", // A unique id
      ugen: "flock.ugen.sin", // The kind of synth
      freq: 110 // The frequency of the tone
    },
  });
}


function update() {
  window.requestAnimationFrame(update);

  // Set the frequency of our synth to the new frequency
  if (selected) {
    // synth.set({
    //   "carrier.freq": baseFrequency + 27.5 * selected/10,
    // });
  }
}


// slide()
//
// Called when the slider is moved
function slide(event,ui) {
  findSelected(ui);

  if (selected === upper && previous === lower) {
    previous = upper;
    slides++;
    synth.set({
      "carrier.freq": baseFrequency + 27.5 * selected/10,
    });
  }
  else if (selected === lower && previous === upper) {
    previous = lower;
    slides++;
    synth.set({
      "carrier.freq": baseFrequency + 27.5 * selected/10,
    });
  }

  if (slides >= slidesRequired) {
    slides = 0;
    generateInstruction();
  }
}

function generateInstruction() {
  lower = Math.floor((Math.random() * (MAX - 10))/10) * 10;
  upper = Math.floor((lower + 10 + Math.random() * (MAX - lower))/10) * 10;
  previous = lower;

  $('#instructions').text('Slide between ' + lower/10 + ' and ' + upper/10);
}

function findSelected(ui) {
  var tens = Math.round(ui.value / 10) * 10;
  var remainder = Math.abs(ui.value - tens);
  $('.ui-slider-pip').removeClass('ui-slider-pip-selected');
  if (remainder <= 3) {
    selected = tens;
    $('.ui-slider-pip-' + selected).addClass('ui-slider-pip-selected');
  }
  else {
    selected = undefined;
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
