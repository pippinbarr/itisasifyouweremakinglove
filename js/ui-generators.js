var TYPE = {
  SELECTMENU: "selectmenu",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  SPINNER: "spinner",
  SLIDER: "slider",
  PROGRESSBAR: "progressbar",
  DATEPICKER: "datepicker",
  INPUT: "input"
}

const NUM_STOCK = 17;

var startupSFX;
var newDialogSFX;
var dialogSuccessSFX;
var dialogFailureSFX;
var promotionSFX;

var audioLoaded = false;

var music;

var breakoutDialog;

var quotes = [];



function createAboutDialog () {
  createSimpleDialog ("About", "about-dialog", "This is the time, and this is the record of the time", "Got it", true, 600, null, null);
}


function createSimpleDialog (title, id, content, closeButtonName, random, width, center, appendTo) {
  var div = $('<div class="dialog simple-dialog" id="'+id+'" title="'+title+'">'+content+'</div>');
  if (!appendTo) appendTo = 'body';
  var options = {
    appendTo: appendTo,
    resizable: false,
    height: "auto",
    width: '30vw',
    modal: false,
    autoOpen: true,
    buttons: {},
    closeOnEscape: false
  };

  if (closeButtonName) {
    options.buttons[closeButtonName] = function () {
      $(this).dialog('destroy');
    }
  }
  var d = createDialog(div,options,random);

  div.parent().find(".ui-dialog-titlebar-close").hide();

  return div;
}


function createDialog(div, options, random, stationary) {

  options.open = function () {
    var pos = div.data('position');
    if (pos) {
      div.parent().offset({
        top: pos.y,
        left: pos.x
      });
    }
  }

  var dialog = div.dialog(options);

  if (random) {
    var x = _.random(0,$(window).width() - div.parent().width());
    var y = _.random($('.menu-bar').height(),$(window).height() - div.parent().height());
    div.data('position',{x: x, y: y});
    div.parent().offset({
      top: y,
      left: x
    });
  }

  if (stationary) return;

  div.parent().draggable({
    containment: [0, $('.menu-bar').height(), $(window).width() - div.parent().width() - 10, $(window).height() - div.parent().height()]
  });

  return dialog;
}
