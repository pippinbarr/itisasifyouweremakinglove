/**********************************************

Slider
Pippin Barr

Sexy?

**********************************************/

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
  $(window).on('resize',fitSliderToViewport)
});

// slide()
//
// Called when the slider is moved
function slide(event,ui) {
  console.log(ui.value);
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
