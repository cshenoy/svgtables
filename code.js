$(function(){

  $("#chairQ").bind("submit", function(e) {
    var chairCheck = $("#addChairs").val();
    var intRegex = /^\d+$/;
    var intCheck = intRegex.test(chairCheck);

    if( !intCheck ||  chairCheck >= 13 || chairCheck <= 3 ){
      $("div.error").text("Sorry, please enter a valid number between 4 and 12.");
      return false;
    }

    $("form, div.error").fadeOut(100);
    e.preventDefault();

    var R = Raphael("holder", "100%", "100%"),
        tableRadius = 108,
        chairRadius = 20,
        radius_space = tableRadius + chairRadius,
        x = 250,
        y = 250,
        ox = 0,
        oy = 0,
        xArc = x,
        yArc = y/2,
        r = R.circle(x, y, tableRadius).attr({fill: "rgb(34, 102, 255)", stroke: "none", opacity: .8}),
        pi = Math.PI,
        dragging = false,
        numCircles;

    var spacing = 2 * pi / chairCheck;

    var circs = [r];

    for(var i = 0; i < 2 * pi; i += spacing) {
      var b = R.circle(x + Math.cos(i) * radius_space, y + Math.sin(i) * radius_space, chairRadius).attr({fill: "rgb(136,221,255)", stroke: "#000", opacity: 0.8});
      circs.push(b); //add this circle to the array
    }


    var wholeTable = R.set(circs);  //place all circles in array in same canvas

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

  });

});
