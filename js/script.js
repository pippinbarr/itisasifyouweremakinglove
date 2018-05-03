/**********************************************

Slider
Pippin Barr

Sexy?

**********************************************/

var MAX = 10;
var MIN = 0;

var breathSFX;
var toneSFX;

var synth;
var baseFrequency = 110;

var selected = 5;

var upper = 7;
var lower = 4;
var previous = lower;
var slidesRequired = 10;
var slides = 0;

var lastValue = selected;

var erotica = ['submit','commit','success','save'];

$(document).ready(function () {

  breathSFX = new Audio('audio/breath-mono.wav');
  breathSFX.onended = function () {
    breathSFX.play();
  }

  toneSFX = new Audio('audio/tone.wav');

  setupFlocking();
  setupAnnyang();

  // Set up the jQuery UI slider along with its pips
  $("#slider").slider({
    orientation: "vertical",
    min: 0,
    max: 10,
    value: selected,
    // step: 10,
    slide: slide,
  })
  .slider('pips', {
    step: 1,
    // rest: 'label',
    // labels: ['0','','','','','','','','','','1','','','','','','','','','','2','','','','','','','','','','3','','','','','','','','','','4','','','','','','','','','','5','','','','','','','','','','6','','','','','','','','','','7','','','','','','','','','','8','','','','','','','','','','9','','','','','','','','','','10']
  });

  // This isn't quite working yet, but I'm trying to avoid the ability
  // to click on pips and slider locations to move the slider.
  // $('.ui-slider-pips').not('#slider').unbind('mousedown');

  // Fit the slider in the window and handle resizing
  fitSliderToViewport();
  $(window).on('resize',fitSliderToViewport);

  // Listen for keys (for testing)
  $(window).on('keydown',handleKeyDown);

  // Start the update loop
  window.requestAnimationFrame(update);

  // Remember the slider
  $slider = $('#slider');

  // Generate our first instruction
  generateInstruction();

  setTimeout(function () {
    createAboutDialog();
  },2000);
});

// setupFlocking()
//
// Set up a basic tone
function setupFlocking() {
  // To use flocking we have to initialise the (sound) environment
  var environment = flock.init();

  // ... and start it.
  environment.start();

  // synth = flock.synth({
  //   synthDef: {
  //     id: "carrier", // A unique id
  //     ugen: "flock.ugen.pinkNoise", // The kind of synth
  //     mul: {
  //       id: "mod",                      // Name this one "mod"
  //       ugen: "flock.ugen.sinOsc",      // Also of type Sine Oscillator
  //       freq: 0.1
  //     }
  //   },
  // });

  // synth = flock.synth({
  //   synthDef: {
  //     id: "carrier", // A unique id
  //     ugen: "flock.ugen.pinkNoise", // The kind of synth
  //     mul: 0
  //   },
  // });

  synth = flock.synth({
    synthDef: {
      id: "carrier", // A unique id
      ugen: "flock.ugen.sinOsc", // The kind of synth
      freq: 220
    },
  });


}

// setupAnnyang()
//
// We set up annyang to listen for individual words and then we'll
// check those words against our list of erotic bedroom talk
function setupAnnyang() {
  if (annyang) {
    var commands = {
      // If annyang hears "red" it will call makeDivsRed()
      ':word': handleUserSpeech,
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}

// update()
//
// Called every frame
function update() {
  window.requestAnimationFrame(update);

  // var sliderValue = $('#slider').slider('option','value');
  // var newMul = Math.abs(sliderValue - lastValue)/5;
  // synth.set({
  //     "carrier.mul": newMul,
  // });
  // lastValue = sliderValue;

  // Set the frequency of our synth to the new frequency
  if (selected) {
    synth.set({
      "carrier.freq": baseFrequency + 27.5 * selected/10,
    });
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
      "carrier.freq": baseFrequency + 27.5 * selected,
    });
  }
  else if (selected === lower && previous === upper) {
    previous = lower;
    slides++;
    synth.set({
      "carrier.freq": baseFrequency + 27.5 * selected,
    });
  }

  if (slides >= slidesRequired) {
    slides = 0;
    generateInstruction();
  }
}

// generateInstruction()
//
// Choose a lower and upper bound for the range and tell the user
function generateInstruction() {
  lower = Math.floor((Math.random() * (MAX - 1)));
  upper = Math.floor((lower + 1 + Math.random() * (MAX - lower)));
  previous = lower;

  $('#instructions').text('Slide between ' + lower + ' and ' + upper);
}

// findSelected()
//
// Work out which pip is selected right now (if any)
function findSelected(ui) {
  // var tens = Math.round(ui.value / 10) * 10;
  // var remainder = Math.abs(ui.value - tens);
  $('.ui-slider-pip').removeClass('ui-slider-pip-selected');
  // if (remainder <= 3) {
    // selected = tens;
    selected = ui.value;
    // $('.ui-slider-pip-' + selected).addClass('ui-slider-pip-selected');
  // }
  // else {
    // selected = undefined;
  // }
}

// handleUserSpeech()
//
// Handles user speech
function handleUserSpeech(word) {
  word = word.toLowerCase();
  console.log(word);
  if (erotica.indexOf(word) !== -1) {
    console.log("Erotic word.");
  }
  else {
    console.log("Non-erotic word.");
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


// handleKeyDown()
//
// Just some key-based triggers for testing
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
