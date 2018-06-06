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

  createApplication();

  // Set up the jQuery UI slider along with its pips
  // $("#slider").slider({
  //   orientation: "vertical",
  //   min: 0,
  //   max: 10,
  //   value: selected,
  //   // step: 10,
  //   slide: slide,
  // })
  // .slider('pips', {
  //   step: 1,
  //   // rest: 'label',
  //   // labels: ['0','','','','','','','','','','1','','','','','','','','','','2','','','','','','','','','','3','','','','','','','','','','4','','','','','','','','','','5','','','','','','','','','','6','','','','','','','','','','7','','','','','','','','','','8','','','','','','','','','','9','','','','','','','','','','10']
  // });

  // This isn't quite working yet, but I'm trying to avoid the ability
  // to click on pips and slider locations to move the slider.
  // $('.ui-slider-pips').not('#slider').unbind('mousedown');

  // Fit the slider in the window and handle resizing
  fitSliderToViewport();
  $(window).on('resize',fitSliderToViewport);

  // Start the update loop
  window.requestAnimationFrame(update);

  // Remember the slider
  // $slider = $('#slider');

  // Generate our first instruction
  generateInstruction();

  setTimeout(function () {
    // createAboutDialog();
  },2000);
});

function createApplication() {

  // Create app as a dialog
  $app = $('#app');
  $app.dialog({
    title: 'It is as if you were making love',
    width: '80vw',
    height: 'auto',
    position: { my: "center", at: "center", of: window },
    resizable: false,
    draggable: false,
    autoOpen: true,
    buttons: {},
    closeOnEscape: false
  });
  // Get rid of the 'x' button on the menu bar
  $app.parent().find(".ui-dialog-titlebar-close").hide();

  // Set up the slider
  $slider = $('#slider');
  $slider.slider({
    orientation: "vertical",
    min: 0,
    max: 10,
    value: selected,
    slide: slide,
  });
  $slider.slider('pips',{
    step: 1,
    labels: ['1','2','3','4','5','6','7','8','9','10']
  });

  // Set up the feedback panel
  $feedback = $('#feedback');
  $feedback.text('That feels so good baby oh my god you\'re the one');

  // Set up the progress bar
  $progress = $('#progress');
  $progress.progressbar();
  $progress.progressbar({
    value: 37
  });
}

// update()
//
// Called every frame
function update() {
  window.requestAnimationFrame(update);
}


// slide()
//
// Called when the slider is moved
function slide(event,ui) {

  findSelected(ui);

  if (selected === upper && previous === lower) {
    previous = upper;
    slides++;
  }
  else if (selected === lower && previous === upper) {
    previous = lower;
    slides++;
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


// fitSliderToViewport()
//
// Called on resize. Moves the slider to the centre of the viewport.
function fitSliderToViewport() {
  $('#slider').offset({
    // top: $(window).height()/2 - $('#slider').height()/2,
    left: $(window).width()/2 - $('#slider').width()/2,
  })
}
