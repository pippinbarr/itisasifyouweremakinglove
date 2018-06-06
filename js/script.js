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
var target = lower;
var slidesRequired = 10;
var slides = 0;

var selectionTimer = 0;

var progress = 0;
var lastValue = selected;

$(document).ready(function () {

  createApplication();
  setTarget();

  // Fit the slider in the window and handle resizing
  fitSliderToViewport();
  $(window).on('resize',fitSliderToViewport);

  // Start the update loop
  window.requestAnimationFrame(update);

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
    first: 'label',
    last: 'label',
    rest: 'label',
    // labels: ['<–'],
    labels: ['0','1','2','3','4','5','6','7','8','9','10'],
    // ⬅
  });

  $instruction = $('#instruction');

  $output = $('#output');
  $output.text('That feels good.');

  // Set up the progress bar
  $progress = $('#progress');
  $progress.progressbar();
  $progress.progressbar({
    value: progress*100
  });

}

// update()
//
// Called every frame
function update() {
  window.requestAnimationFrame(update);
  selectionTimer++;
}


// slide()
//
// Called when the slider is moved
function slide(event,ui) {

  findSelected(ui);
  if (selected == target) {
    if (target == upper) {
      target = lower;
    }
    else {
      target = upper;
    }
    $instruction.text('Set me to ' + target);
  }

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
    setTarget();
    progress += 0.1;
    $progress.progressbar({
      value: progress * 100
    })
  }
}


// generateInstruction()
//
// Choose a lower and upper bound for the range and tell the user
function setTarget() {
  lower = Math.floor((Math.random() * (MAX - 1)));
  upper = Math.floor((lower + 1 + Math.random() * (MAX - lower)));
  previous = lower;
  target = upper;
  console.log("Setting target to ",target);
  highlightTarget();
}


function highlightTarget() {
  $instruction.text("Set me to " + target + ".");
}


// findSelected()
//
// Work out which pip is selected right now (if any)
function findSelected(ui) {
  selected = ui.value;
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
