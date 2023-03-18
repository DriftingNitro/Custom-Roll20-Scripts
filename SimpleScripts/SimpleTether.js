on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!imgsrc") !== -1) {
        // Get the selected token
        var selectedToken = getObj("graphic", msg.selected[0]._id);
    
        // Get the image source (imgsrc) URL of the selected token
        var imgsrcURL = selectedToken.get("imgsrc");
    
        // Send a message to the chat with the imgsrc URL
        sendChat("", "The imgsrc URL of the selected token is: ```" + imgsrcURL + "``");
    }
    
    if(msg.type == "api" && msg.content.indexOf("!imgtest") !== -1) {
        // Split the message into an array of arguments
        var args = msg.content.split(" ");
    
        // Get the imgsrc URL argument
        var imgsrcURL = args[1];
    
        // Create the new token
        var newToken = createObj("graphic", {
          imgsrc: imgsrcURL,
          pageid: Campaign().get("playerpageid"),
          left: 100,
          top: 100,
          width: 70,
          height: 70,
          layer: "objects"
        });
    }
});

// Set up a global variable to hold the arrow graphic object
var arrow;

on("chat:message", function(msg) {
  // Check if the chat message begins with the command "!point"
  if (msg.content.startsWith("!point")) {
    // Split the message into an array of words
    var words = msg.content.split(" ");

    // Set up variables to hold the imgsrc and token_id of the arrow graphic, and the token_id of token1 and token2
    var imgsrc, token1_id, token2_id;

    // Parse the imgsrc and token_id values from the chat message
    imgsrc = words[1];
    token1_id = words[2];
    token2_id = words[3];

    // Get the token objects for token1 and token2 using their token_id values
    var token1 = getObj("graphic", token1_id);
    var token2 = getObj("graphic", token2_id);

    // Set up variables to hold the coordinates and width of token1 and token2
    var x1, y1, w1, x2, y2;

    // Get the x and y coordinates and width of token1
    x1 = token1.get("left");
    y1 = token1.get("top");
    w1 = token1.get("width");

    // Get the x and y coordinates of token2
    x2 = token2.get("left");
    y2 = token2.get("top");

    // Calculate the angle between token1 and token2 using the arctangent function
    var angle = Math.atan2(y2 - y1, x2 - x1);

    // Convert the angle from radians to degrees
    angle = angle * 180 / Math.PI;

    // Calculate the distance between token1 and token2 using the Pythagorean theorem
    var distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    // Calculate the x and y coordinates of the middle point between token1 and token2
    var x = (x1 + x2) / 2;
    var y = (y1 + y2) / 2;

    // Draw the arrow graphic using the createObj function, using the calculated x and y coordinates as the position
    // and the angle calculated above as the rotation
    arrow = createObj("graphic", {
      pageid: Campaign().get("playerpageid"),
      layer: "objects",
      left: x,
      top: y,
      width: w1,
      height: distance,
      imgsrc: imgsrc,
      rotation: (angle+90)
    });
  }
  on("change:graphic", function(obj) {
      // Check if the changed object is either token1 or token2
      if (obj.id == token1_id || obj.id == token2_id) {
        // Set up variables to hold the coordinates and width of token1 and token2
        var x1, y1, w1, x2, y2;
        
        // Get the x and y coordinates and width of token1
        x1 = token1.get("left");
        y1 = token1.get("top");
        w1 = token1.get("width");
    
        // Get the x and y coordinates of token2
        x2 = token2.get("left");
        y2 = token2.get("top");
    
        // Calculate the angle between token1 and token2 using the arctangent function
        var angle = Math.atan2(y2 - y1, x2 - x1);
    
        // Convert the angle from radians to degrees
        angle = angle * 180 / Math.PI;
    
        // Calculate the distance between token1 and token2 using the Pythagorean theorem
        var distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    
        // Calculate the x and y coordinates of the middle point between token1 and token2
        var x = (x1 + x2) / 2;
        var y = (y1 + y2) / 2;
    
        arrow.set("left", x);
        arrow.set("top", y);
        arrow.set("width", w1);
        arrow.set("height", distance);
        arrow.set("rotation", (angle+90));
      }
    });
});


