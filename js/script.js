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

  loadSounds();
  createApp();
  createInputDialog();

  openApp();
  // showInputDialog();

  // $('#app-icon').on('click', function () {
  //   setTimeout(function () {
  //     $('#title-screen').fadeIn(250);
  //     setTimeout(function () {
  //       openApp();
  //       $('#title-screen').hide();
  //     },5000);
  //   },500);
  //   startupSFX.play();
  // });

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
    autoOpen: false,
    buttons: {},
    closeOnEscape: false
  });
  // Get rid of the 'x' button on the menu bar
  $app.parent().find(".ui-dialog-titlebar-close").hide();

  // Make the app stay centred on window shenanigans
  $(window).resize(function() {
    console.log("Yay");
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

  $('#music-on').on('click',function () {
    music.play();
  });
  $('#music-off').on('click',function () {
    music.pause();
  });

}

function openApp() {
  $app.dialog('open');
  // chimesSFX.play();
  // music.play();
}

function showInputDialog() {
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

// update()
//
// Called every frame
function update() {
  window.requestAnimationFrame(update);
  if (currentlySelected) {
    selectedTimer++;
    if (selectedTimer > SELECTED_MINIMUM_FRAMES) {
      slides++;

      clickSFX.play();

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
