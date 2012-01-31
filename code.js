$(function(){
  $("#holder").hide(); //hide SVG at first
  $("#chairQ").bind("submit", function(e) {
    var chairCheck = $("#addChairs").val(); //grab value from input
    var intRegex = /^\d+$/; //regex to verify it is a positive number
    var intCheck = intRegex.test(chairCheck); //test the regex

    if( !intCheck ||  chairCheck >= 13 || chairCheck <= 3 ) {
      $("div.error").text("Sorry, please enter a valid number between 4 and 12.");
      return false; //if not a number or not in range, start over!
    }

    $("form").fadeOut(100); //ah, finally! a number! fade me out!
    $("#holder").show().fadeIn(50); //now i can show chairs!
    startTables(chairCheck); //pass me through the function below
    e.preventDefault(); //prevent the form from submitting
  });

  var R = Raphael("holder", "100%", "100%"), //create Raphael SVG object
      tableRadius = 108,
      chairRadius = 20,
      radius_space = tableRadius + chairRadius,
      x = 500,
      y = 200,
      ox = 0,
      oy = 0,
      xArc = x,
      yArc = y/2,
      r = R.circle(x, y, tableRadius).attr({fill: "rgb(34, 102, 255)", stroke: "none", opacity: .8}),
      pi = Math.PI,
      dragging = false,
      numCircles;

  var startTables = function(chairs){
    var spacing = 2 * pi / chairs; //spacing between chairs; dependent on # of chairs

    var circs = [r]; //an array with the table already set (how nice of me)

    for(var i = 0; i < 2 * pi; i += spacing) {
      var b = R.circle(x + Math.cos(i) * radius_space, y + Math.sin(i) * radius_space, chairRadius).attr({fill: "rgb(136,221,255)", stroke: "#000", opacity: 0.8});
      circs.push(b); //add this circle to the array
    }

    var wholeTable = R.set(circs);  //place all circles in array in same canvas


    //the rest of these are for the table draggability; need to be optimized for primetime but good for testing
    wholeTable.mousedown(function(events){
      ox = events.screenX;
      oy = events.screenY;
      wholeTable.attr({
        opacity: 0.25
      });

      dragging = true;
    });

    wholeTable.mousemove(function(events){ //not the best but will change later to optimize
      if (dragging) {
        wholeTable.translate(events.screenX - ox, events.screenY - oy);
        ox = events.screenX;
        oy = events.screenY;
      }
    });

    wholeTable.mouseup(function(events){
      dragging = false;
      wholeTable.attr({ opacity:0.8 });
    });
  };

});
