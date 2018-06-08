/**********************************************

Slider
Pippin Barr

Sexy?

**********************************************/

var MAX = 10;
var MIN = 0;

const AROUSAL_PER_STROKE = 0.01;
var arousal = 0;

var strokesRequired = [5,10,10,10,15,15,16,20,20,25];
var currentStrokesRequired;

var strokeRanges = [
  { low: 0, high: 10 },
  { low: 0, high: 5 },
  { low: 0, high: 2 },
  { low: 5, high: 10 },
  { low: 0, high: 3 },
  { low: 0, high: 2 },
  { low: 2, high: 10 },
  { low: 5, high: 7 },
  { low: 8, high: 10 },
  { low: 9, high: 10 },
  { low: 3, high: 7 },
  { low: 4, high: 8 },
  { low: 2, high: 6 },
];
var currentStrokeRange;

var target;


var strokes = 0;
var currentStrokeTime = 0;

var selected = 5;
const SELECTED_MINIMUM_FRAMES = 5;
var currentlySelected = false;
var selectedTimer = 0;

$(document).ready(function () {

  loadSounds();
  createApp();
  createInputDialog();

  // openApp();

  // showInputDialog();

  $('#app-icon').on('click', function () {
    setTimeout(function () {
      $('#title-screen').fadeIn(100);
      setTimeout(function () {
        $('#title-screen').fadeOut(100,function () {
          setTimeout(openApp,500);
        });
      },5000);
    },500);
    startupSFX.play();
  });

  // Start the update loop
  window.requestAnimationFrame(update);

});



// update()
//
// Called every frame
function update() {

  window.requestAnimationFrame(update);

  // Increase the stroke time
  currentStrokeTime++;

  // Check if a pip is selected
  // (Do I need to worry about this happening behind a modal?)
  if (currentlySelected) {
    // Increase the time the selection has been held
    selectedTimer++;
    // Check if it's been held long enough
    if (selectedTimer > SELECTED_MINIMUM_FRAMES) {
      // Arousal goes up!
      arousal += AROUSAL_PER_STROKE;
      $progress.progressbar({
        value: arousal * 100
      });

      if (arousal >= 1.0) {
        // Handle the orgasm!
      }

      // This counts as a stroke of the slider
      strokes++;

      // Check the stroke time
      console.log(currentStrokeTime);

      // Reset the stroke time
      currentStrokeTime = 0;

      // Feedback sound
      clickSFX.play();

      // Check if this most recent slide brought us to the end of this sequence
      if (strokes >= strokesRequired[currentStrokesRequired]) {
        strokes = 0;
        setNewStrokeRange();
      }
      else {
        // Check if this slide was to the upper or lower end of the range
        // and swap the target based on that
        if (target == strokeRanges[currentStrokeRange].high) {
          target = strokeRanges[currentStrokeRange].low;
        }
        else {
          target = strokeRanges[currentStrokeRange].high;
        }
      }

      // Highlight the new target
      highlightTarget();

      // Reset the timer and the selection tracking
      selectedTimer = 0;
      currentlySelected = false;
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
function setNewStrokeRange() {

  currentStrokeRange = Math.floor(Math.random() * strokeRanges.length);
  currentStrokesRequired = Math.floor(Math.random() * strokesRequired.length);

  if (Math.random() < 0.5) {
    target = strokeRanges[currentStrokeRange].high;
  }
  else {
    target = strokeRanges[currentStrokeRange].low;
  }

  highlightTarget();

  // Feedback that a new range has been selected
  notifySFX.play();
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

function openApp() {
  $app.dialog('open');
  setNewStrokeRange();
}


/////////////////////////////////////////////////////////////////////////////
//
// SETUP
//




// Loading the sound effects

function loadSounds() {
  music = new Howl({
    src: ['audio/music.wav'],
    loop: true,
    volume: 0.5
  });
  chimesSFX = new Audio('audio/chimes.wav');
  dingSFX = new Audio('audio/ding.wav');
  negativeSFX = new Audio('audio/chord.wav');
  fanfareSFX = new Audio('audio/tada.wav');
  clickSFX = new Audio('audio/start.wav');
  climaxAlertSFX = new Audio('audio/ir_inter.wav');
  startupSFX = new Audio('audio/startup.wav');
  shutdownSFX = new Audio('audio/shutdown.wav');
  notifySFX = new Audio('audio/notify.wav');
}


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
    autoOpen: false,
    buttons: {},
    closeOnEscape: false
  });

  // Get rid of the 'x' button on the menu bar
  $app.parent().find(".ui-dialog-titlebar-close").hide();

  // Make the app stay centred on window shenanigans
  $(window).resize(function() {
    $app.dialog("option", "position", { my: "center", at: "center", of: window });
  });

  // Set up the slider
  $slider = $('#slider');
  $slider.slider({
    orientation: "vertical",
    min: 0,
    max: 10,
    value: selected,
    slide: slide,
  });

  // Set up the pips on the slider
  $slider.slider('pips',{
    step: 1,
    first: 'label',
    last: 'label',
    rest: 'label',
    labels: ['0','1','2','3','4','5','6','7','8','9','10'],
  });

  // Remember the instructions panel
  $instruction = $('#instruction');

  // Remember the output panel
  $output = $('#output');
  $output.text('');

  // Set up the progress bar
  $progress = $('#progress');
  $progress.progressbar();
  $progress.progressbar({
    value: arousal*100
  });

  // Listen for clicks on the music radio buttons
  $('#music-on').on('click',function () {
    music.play();
  });
  $('#music-off').on('click',function () {
    music.pause();
  });
}

function showInputDialog() {
  // Trigger a mouseup on the slider to avoid the user continuing to use it
  $slider.trigger('mouseup');
  $talk.dialog('open');
  chimesSFX.play();
}


function createInputDialog() {
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
        setTimeout(function () {
          $talk.dialog('close');
        },300);
      }
    },
    beforeOpen: function () {
      chimesSFX.play();
    },
    beforeClose: function () {
      if ($('#talk-input').val() === 'I love you') {
        $('#talk-input').val('');
        dingSFX.play();
        return true;
      }
      else {
        $('#talk-input').val('');
        negativeSFX.play();
        $talk.parent().effect('shake',{
          direction: 'left',
          distance: 3,
          times: 5
        });
        return false;
      }
    },
    closeOnEscape: false
  });
  $talk.parent().find(".ui-dialog-titlebar-close").hide();
}
