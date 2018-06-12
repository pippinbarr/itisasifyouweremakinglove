/**********************************************

Slider
Pippin Barr

Sexy?

**********************************************/

var MAX = 10;
var MIN = 0;

const AROUSAL_PER_STROKE = 0.01;
const AROUSAL_ENTROPY = 0.0001;
var arousal = 0.0;

const ORGASM_START_FRAMES = 1000;
var orgasmFrames = 0;
var orgasm = false;
var gameOver = false;
var breatheRate = 0.5;
var breatheVolume = 0;
var breathDelay = 4000;
var breathingTimer = null;

var positiveFeedbackDialogs = [
  "That feels so good.",
  "More please.",
  "Oh yes.",
  "You are so good at this.",
  "Do not stop sliding me.",
  "I love the way you slide me.",
  "Keeping sliding me.",
  "Yes, yes, yes.",
  "That feels fantastic.",
  "Keep going.",
  "I love this.",
  "You are making me feel amazing, human lover."
];

var slowDownFeedbacks = [
  'Slow down.',
  'Go a little slower.',
  'Slide me more slowly.',
  'I want slower sliding right now.',
  'Slow down a bit.',
  'I need you to slow it down a little.',
  'Take it easy, slow down.',
  'There is no hurry, please slow down.',
  'Slow it down.',
  'Please slide me slower.',
  'Go slower.'
];

var speedUpFeedbacks = [
  'Faster.',
  'Go faster.',
  'Slide me faster.',
  'I want you to slide me faster.',
  'Speed up.',
  'Speed it up.',
  'Pick up the pace.',
  'Speed up a bit.',
  'Do it faster.',
  'I need you to go faster.'
];

var positiveFeedbackMessages = [
  "That's it.",
  "That feels so good.",
  "Mmmmmmmmm.",
  "Oh yes.",
  "I love the way you slide me.",
  "Yes, keeping sliding.",
  "Don't stop.",
  "Yes, that's good.",
  "That's right, human."
];

var orgasmMessages = [
  "111111101010101111011111111",
  "010111100100010101010101111",
  "010101111101001001011101000",
  "011000101000100100000001111",
  "010110111011010001000000000",
  "011111110000011111110000000",
  "011111110000100010000000101",
  "111110000101000101111111111",
  "011111100000010110101011111"
];

var textInputRequests = [
  {
    prompt: "Tell me that you love me.",
    response: "I love you"
  },
  {
    prompt: "Tell me that you need me.",
    response: "I need you"
  },
  {
    prompt: "Tell me that you want me.",
    response: "I want you"
  },
  {
    prompt: "Say my name.",
    response: "It is as if you were making love"
  },
  {
    prompt: "Tell me that this feels so good",
    response: "This feels so good"
  }
];
var MAX_TEXT_INPUT_REQUEST_ERRORS = 4;
var currentTextInputRequestErrors = 0;

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
var currentStrokeInstruction = '';

const MAX_STROKE_SPEED_ERRORS = 3;
const SLOW_STROKE_MIN_FRAMES = 50;
const FAST_STROKE_MAX_FRAMES = 30;
var desiredStrokeSpeeds = ["slowly","quickly"];
var currentDesiredStrokeSpeed = "slowly";
var strokeSpeedErrors = 0;
var strokeSpeedWarnings = 0;

var target;

var strokes = 0;
var currentStrokeTime = 0;
var strokeTimingOn = false;

var selected = 5;
const SELECTED_MINIMUM_FRAMES = 5;
var currentlySelected = false;
var selectedTimer = 0;

var allSounds = [];

$(document).ready(function () {

  loadSounds();
  createApp();
  createFeedbackDialog();
  createTextInputDialog();
  createGameOverDialog();
  // breathe();
  // openApp();

  startup();

  // showTextInputDialog();

  // Start the update loop
  window.requestAnimationFrame(update);

});


function breathe() {
  breatheSFX.rate(breatheRate);
  breatheSFX.volume(breatheVolume);
  breatheSFX.play();
  breathingTimer = setTimeout(breathe,breathDelay);
}


function startup() {
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
}

// update()
//
// Called every frame
function update() {

  window.requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  if (arousal >= 1.0 && orgasm) {
    orgasmFrames = Math.max(0,orgasmFrames - 1);

    var orgasmEventProbability = orgasmFrames/ORGASM_START_FRAMES;

    if (Math.random() < orgasmEventProbability) {
      if (!$('#messages').is(':animated')) {
        setMessage(getRandom(orgasmMessages));
      }
    }
    if (Math.random() < orgasmEventProbability) {
      $slider.slider('value',Math.floor(Math.random() * 11));
    }
    if (Math.random() < orgasmEventProbability) {
      $progress.progressbar('value',Math.floor(Math.random() * 100));
    }
    if (Math.random() < orgasmEventProbability) {
      target = Math.floor(Math.random() * 11);
      highlightTarget();
    }
    if (Math.random() < orgasmEventProbability) {
      allSounds[Math.floor(Math.random() * allSounds.length)].play();
    }
    if (Math.random() < orgasmEventProbability) {
      $('#music-on').prop('checked',Math.random() < 0.5);
      $('#music-off').prop('checked',Math.random() < 0.5);
    }

    if (orgasmFrames == 0) {
      $slider.slider('value',10);
      $app.dialog('close');
      $('#app-icon').hide();
      for (var i = 0; i < allSounds.length; i++) {
        allSounds[i].pause();
      }
      if (breathingTimer) clearTimeout(breathingTimer);
      orgasm = false;
      setTimeout(function () {
        fanfareSFX.currentTime = 0;
        fanfareSFX.play();
        dingSFX.currentTime = 0;
        showGameOverDialog("Thanks for playing!");
      },2000);
    }
    return;
  }

  if (arousal >= 1.0) {
    return;
  }


  // Increase the stroke time
  if (strokeTimingOn) currentStrokeTime++;

  // If they're not interacting for too long
  if (arousal < 1.0 && currentStrokeTime > 300) {
    arousal = Math.max(0,arousal - AROUSAL_ENTROPY);
    updateProgress();
  }

  // Check if a pip is selected
  // (Do I need to worry about this happening behind a modal?)
  if (currentlySelected) {
    // Increase the time the selection has been held
    selectedTimer++;
    // Check if it's been held long enough
    if (selectedTimer > SELECTED_MINIMUM_FRAMES) {

      // Check the stroke time
      if (currentDesiredStrokeSpeed == "slowly" && currentStrokeTime < SLOW_STROKE_MIN_FRAMES) {
        strokeSpeedErrors++;
        setMessage(currentStrokeInstruction  + ' ' +  getRandom(slowDownFeedbacks));
        if (strokeSpeedErrors > MAX_STROKE_SPEED_ERRORS) {
          showFeedbackDialog(getRandom(slowDownFeedbacks));
          strokeSpeedErrors = 1;
          strokes = 0; // Reset strokes at this point, they need to work on it!
        }
      }
      else if (currentDesiredStrokeSpeed == "quickly" && currentStrokeTime > FAST_STROKE_MAX_FRAMES) {
        strokeSpeedErrors++;
        setMessage(currentStrokeInstruction  + ' ' +  getRandom(speedUpFeedbacks));
        if (strokeSpeedErrors > MAX_STROKE_SPEED_ERRORS) {
          showFeedbackDialog(getRandom(speedUpFeedbacks));
          strokeSpeedErrors = 1;
          strokes = 0; // Reset strokes at this point, they need to work on it
        }
      }
      else {
        // Good stroke
        // Arousal goes up!
        arousal = Math.min(1.0, arousal + AROUSAL_PER_STROKE);
        updateProgress();

        if (arousal >= 1.0) {
          fanfareSFX.play();
          orgasmFrames = ORGASM_START_FRAMES;
          breathDelay = 250;
          breatheRate = 0.75;
          breatheVolume = 1.0;
          orgasm = true;
          music.pause();
          return;
        }

        // This counts as a stroke of the slider
        strokes++;

        if (strokeSpeedErrors != 0 || (strokes > 2*currentStrokesRequired/3 && Math.random() < 0.25)) {
          setMessage(currentStrokeInstruction + ' ' + getRandom(positiveFeedbackMessages));
        }

        strokeSpeedErrors = 0;
      }

      // Reset the stroke time
      currentStrokeTime = 0;

      handleBreathing();

      // Feedback sound
      clickSFX.play();

      // Check if this most recent slide brought us to the end of this sequence
      if (strokes >= strokesRequired[currentStrokesRequired]) {
        strokes = 0;
        setNewStroke();
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

function updateProgress() {
  $progress.progressbar({
    value: arousal * 100
  });
}

function setMessage(text) {
  $messages.text(text);
  $messages.effect('highlight',{color: '#dddd33'});
}

function showFeedbackDialog(text) {
  $('#feedback-text').text(text);
  $feedback.dialog('open');
}

function handleBreathing() {
  // Update the breathing sound to match the current arousal
  if (arousal >= 1.0) {
    // Handle the orgasm!
    breathDelay = 500;
    breatheVolume = 1.0;
    breatheRate = 1.0;
    return;
  }
  else if (arousal > 0.9) {
    breatheRate = 1.0;
    breatheVolume = 0.9;
    breathDelay = 750;
  }
  else if (arousal > 0.75) {
    breatheRate = 0.9;
    breatheVolume = 0.8;
    breathDelay = 1000;
  }
  else if (arousal > 0.5) {
    breatheRate = 0.8;
    breatheVolume = 0.7;
    breathDelay = 2000;
  }
  else if (arousal > 0.25) {
    breatheRate = 0.7;
    breatheVolume = 0.6;
    breathDelay = 3000;
  }
  else if (arousal > 0) {
    breatheRate = 0.6;
    breatheVolume = 0.5;
    breathDelay = 4000;
  }
}


// slide()
//
// Called when the slider is moved
function slide(event,ui) {

  if (arousal >= 1.0) {
    return;
  }

  findSelected(ui);

  if (selected == target) {
    currentlySelected = true;
  }
  else {
    currentlySelected = false;
    selectedTimer = 0;
  }
}


// setNewStroke()
//
// Choose a lower and upper bound for the range and tell the user
function setNewStroke() {

  currentStrokeRange = Math.floor(Math.random() * strokeRanges.length);
  currentStrokesRequired = Math.floor(Math.random() * strokesRequired.length);

  if (Math.random() < 0.5) {
    target = strokeRanges[currentStrokeRange].high;
    if (target == selected) {
      target = strokeRanges[currentStrokeRange].low;
    }
  }
  else {
    target = strokeRanges[currentStrokeRange].low;
    if (target == selected) {
      target = strokeRanges[currentStrokeRange].high;
    }
  }

  // If they're stroking well we should occasionally change up the speed
  currentDesiredStrokeSpeed = getRandom(desiredStrokeSpeeds);

  // Specific stroke speeds for low and high arousal
  if (arousal <= 0.25) {
    currentDesiredStrokeSpeed = "slowly";
  }
  if (arousal >= 0.8) {
    currentDesiredStrokeSpeed = "quickly";
  }

  currentStrokeInstruction = 'Slide me ' + currentDesiredStrokeSpeed + ' between ' + strokeRanges[currentStrokeRange].low + ' and ' + strokeRanges[currentStrokeRange].high + '.';
  $messages.text(currentStrokeInstruction);

  highlightTarget();

  // Feedback that a new range has been selected
  notifySFX.play();

  strokeTimingOn = true;

  // Display an input or feedback dialog
  var r = Math.random();
  if (arousal > 0.4 && r < 0.1) {
    showTextInputDialog();
  }
  else if (arousal > 0.2 && r < 0.2) {
    showFeedbackDialog();
  }
}


function highlightTarget() {
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
  breathe();
  setNewStroke();
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
  breatheSFX = new Howl({
    src: ['audio/ir_begin.wav'],
    // loop: true,
    volume: 0.5,
    rate: 0.5
  });

  chimesSFX = new Audio('audio/chimes.wav');
  dingSFX = new Audio('audio/ding.wav');
  negativeSFX = new Audio('audio/chord.wav');
  fanfareSFX = new Audio('audio/tada.wav');
  clickSFX = new Audio('audio/start.wav');
  startupSFX = new Audio('audio/startup.wav');
  shutdownSFX = new Audio('audio/shutdown.wav');
  notifySFX = new Audio('audio/notify.wav');

  allSounds = [chimesSFX,dingSFX,negativeSFX,fanfareSFX,clickSFX,startupSFX,shutdownSFX,notifySFX];
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

  // Remember the messages panel
  $messages = $('#messages');
  // $messages.text('Slide me.');

  // Set up the progress bar
  $progress = $('#progress');
  $progress.progressbar();
  $progress.progressbar({
    value: arousal*100
  });

  // Listen for clicks on the music radio buttons
  $('#music-on').on('click',function () {
    if (!orgasm && !arousal >= 1.0) {
      music.play();
    }
  });
  $('#music-off').on('click',function () {
    if (!orgasm && !arousal >= 1.0) {
      music.pause();
    }
  });
}

function showTextInputDialog() {
  // Trigger a mouseup on the slider to avoid the user continuing to use it
  $slider.trigger('mouseup');
  currentTextInputRequest = getRandom(textInputRequests);
  $('#text-input-request').text(currentTextInputRequest.prompt);
  $textInput.dialog('open');
  chimesSFX.play();
  strokeTimingOn = false;
}


function createTextInputDialog() {
  $textInput = $('<div id="text-input"></div>');
  $textInput.append('<p id="text-input-request"></p>');
  $textInput.append('<input id="text-input-field"></input>');
  $textInput.dialog({
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
          $textInput.dialog('close');
        },300);
      }
    },
    beforeOpen: function () {
      chimesSFX.play();
      strokeTimingOn = false;
    },
    beforeClose: function () {
      // Convert the input to lower case with no punctuation
      var inputText = $('#text-input-field').val();
      inputText = inputText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      inputText = inputText.replace(/\s{2,}/g," ");
      inputText = inputText.toLowerCase();
      // Convert the correct response to lower case too
      var correctResponse = currentTextInputRequest.response.toLowerCase();
      // Compare them
      if (inputText === correctResponse) {
        $('#text-input-field').val('');
        dingSFX.play();
        currentTextInputRequestErrors = 0;
        strokeTimingOn = true;
        return true;
      }
      else {
        $('#text-input-field').val('');
        negativeSFX.play();
        $textInput.parent().effect('shake',{
          direction: 'left',
          distance: 3,
          times: 5
        });
        currentTextInputRequestErrors++;
        if (currentTextInputRequestErrors === MAX_TEXT_INPUT_REQUEST_ERRORS) {
          $('#text-input-request').append(" (Type: \"" + currentTextInputRequest.response + "\".)");
        }
        return false;
      }
    },
    closeOnEscape: false
  });
  $textInput.parent().find(".ui-dialog-titlebar-close").hide();
}

function createFeedbackDialog() {
  $feedback = $('<div id="feedback"></div>');
  $feedback.append('<p id="feedback-text">That feels so good.</p>');
  $feedback.dialog({
    title: 'Alert',
    width: '340px',
    height: 'auto',
    position: { my: "center", at: "center", of: window },
    resizable: false,
    draggable: false,
    autoOpen: false,
    modal: true,
    buttons: {
      Okay: function () {
        setTimeout(function () {
          $feedback.dialog('close');
        },300);
      }
    },
    beforeOpen: function () {
      chimesSFX.play();
      strokeTimingOn = false;
    },
    beforeClose: function () {
      dingSFX.play();
      strokeTimingOn = true;
    },
    closeOnEscape: false
  });
  $feedback.parent().find(".ui-dialog-titlebar-close").hide();
}

function createGameOverDialog() {
  $gameover = $('<div id="game-over"></div>');
  $gameover.append('<p id="game-over-text">Thanks for playing!</p>');
  $gameover.dialog({
    title: 'Game Over',
    width: '340px',
    height: 'auto',
    position: { my: "center", at: "center", of: window },
    resizable: false,
    draggable: false,
    autoOpen: false,
    modal: true,
    buttons: {
      Okay: function () {
        setTimeout(function () {
          $gameover.dialog('close');
        },300);
      }
    },
    beforeOpen: function () {
    },
    beforeClose: function () {
      dingSFX.play();
      shutdownSFX.currentTime = 0;
      // setTimeout(function () {
        shutdownSFX.play();
      // },500);
    },
    closeOnEscape: false
  });
  $feedback.parent().find(".ui-dialog-titlebar-close").hide();
}

function showGameOverDialog() {
  // Trigger a mouseup on the slider to avoid the user continuing to use it
  $slider.trigger('mouseup');
  $gameover.dialog('open');
}


function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
