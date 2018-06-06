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
var target = lower;
var slidesRequired = 10;
var slides = 0;

const SELECTED_MINIMUM_FRAMES = 5;
var currentlySelected = false;
var selectedTimer = 0;

var progress = 0;
var lastValue = selected;

$(document).ready(function () {

  createApp();
  setTarget();

  $(window).on('resize',fitSliderToViewport);

  // Start the update loop
  window.requestAnimationFrame(update);
});

function createApp() {
  // Create app as a dialog
  $app = $('#app');
  $app.dialog({
    title: 'It is as if you were making love',
    // width: '80vw',
    width: '320px',
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
  fitSliderToViewport();

  $instruction = $('#instruction');

  $output = $('#output');
  $output.text('That feels good.');

  // Set up the progress bar
  $progress = $('#progress');
  $progress.progressbar();
  $progress.progressbar({
    value: progress*100
  });

  $talk = $('<div id="talk"></div>');
  $talk.append('<p id="talk-request">Tell me that you love me</p>');
  $talk.append('<input id="talk-input"></input>');
  $talk.dialog({
    title: 'Input required',
    width: '340px',
    height: 'auto',
    position: { my: "center", at: "center", of: window },
    resizable: false,
    draggable: false,
    autoOpen: false,
    modal: true,
    buttons: {
      Submit: function () {
        if ($('#talk-input').val() === 'I love you') {
          setTimeout(function () {
            $('#talk-input').val('');
            $talk.dialog('close');
          },300);
        }
        else {
          $talk.parent().effect('shake',{
            direction: 'left',
            distance: 3,
            times: 5
          });
          $('#talk-input').val('');
        }
      }
    },
    closeOnEscape: false
  });
  $talk.parent().find(".ui-dialog-titlebar-close").hide();

  setTimeout(function() {
    $slider.trigger('mouseup');
    $talk.dialog('open');
  },10000);

}

// update()
//
// Called every frame
function update() {
  window.requestAnimationFrame(update);
  if (currentlySelected) {
    selectedTimer++;
    if (selectedTimer > SELECTED_MINIMUM_FRAMES) {
      slides++;

      if (target == upper) {
        target = lower;
      }
      else {
        target = upper;
      }

      highlightTarget();
      selectedTimer = 0;
      currentlySelected = false;
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

}


// slide()
//
// Called when the slider is moved
function slide(event,ui) {

  findSelected(ui);

  if (selected == target) {
    currentlySelected = true;
  }
  else {
    currentlySelected = false;
    selectedTimer = 0;
  }
}


// generateInstruction()
//
// Choose a lower and upper bound for the range and tell the user
function setTarget() {
  lower = Math.floor((Math.random() * (MAX - 1)));
  upper = Math.floor((lower + 1 + Math.random() * (MAX - lower)));
  while (upper == selected) {
    upper = Math.floor((lower + 1 + Math.random() * (MAX - lower)));
  }
  target = upper;
  highlightTarget();
}


function highlightTarget() {
  // Issue instruction
  $instruction.text('Set me to ' + target + '.');

  // Clear formatting of pips
  $('.ui-slider-pip').css({
    fontWeight: 'normal',
    border: 'none',
    backgroundColor: 'transparent'
  });

  // Highlight the target pip
  $('.ui-slider-pip-' + target).css({
    // fontWeight: 'bold',
    border: 'solid 1px black',
    backgroundColor: 'white'
  });
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
