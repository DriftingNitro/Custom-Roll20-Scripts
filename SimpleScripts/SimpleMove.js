// This is an example Roll20 API script for moving a token in a specified direction
// when activated by a chat command

// Define a function that moves the object with the specified object ID in the specified direction
// by the specified distance
function moveToken(objectId, direction, distance) {
    // Get the Roll20 object for the specified object ID
    var object = getObj('graphic', objectId);
  
    // Check if the object was found
    if (object) {
      // Get the current position of the object
      var x = object.get('left');
      var y = object.get('top');
  
      // Calculate the new position of the object based on the direction and distance
      switch (direction) {
        case 'up':
          y -= distance; // Move the object up by the specified distance
          break;
        case 'down':
          y += distance; // Move the object down by the specified distance
          break;
        case 'left':
          x -= distance; // Move the object left by the specified distance
          break;
        case 'right':
          x += distance; // Move the object right by the specified distance
          break;
      }
  
      // Set the position of the object to the new position
      object.set('left', x);
      object.set('top', y);
  
      // Send a message to the chat log indicating that the object was moved
      sendChat('API', '/w gm Object ' + objectId + ' moved ' + direction + ' by ' + distance + ' pixels');
    } else {
      // Send a message to the chat log indicating that the object was not found
      sendChat('API', '/w gm Unable to move object: object not found');
      //sendChat('API', '/w gm Object ' + objectId + ' moved ' + direction + ' by ' + distance + ' pixels');
    }
  }
  
  // Register a listener for the '!move' chat command
  on('chat:message', function(msg) {
      // Check if the message is a chat command
    if (msg.type == 'api' && msg.content.startsWith('!simple-pos-move')) {
      // Get the selected objects
      var selected = msg.selected;
  
      // Check if any objects are selected
      if (selected) {
        // Loop through the selected objects
        for (var i = 0; i < selected.length; i++) {
          // Get the Roll20 object for the selected object
          var object = getObj('graphic', selected[i]._id);
  
          // Check if the object is a token
          if (object && object.get('_subtype') == 'token') {
            // Parse the x and y coordinates from the chat command arguments
            var args = msg.content.split(' ');
            var x = parseInt(args[1]);
            var y = parseInt(args[2]);
            var dir = parseInt(args[3]);
  
            // Set the position of the object to the specified coordinates
            object.set('left', x);
            object.set('top', y);
            object.set('rotation', dir);
            
            // Send a message to the chat log indicating that the object was moved
            sendChat('API', '/w gm Object ' + object.get('name') + ' moved to position (' + x + ', ' + y + ')');
          }
        }
      } else {
        // Send a message to the chat log indicating that no objects are selected
        sendChat('API', '/w gm No objects selected');
      }
    }
    // Check if the message is a chat command
    if (msg.type == 'api' && msg.content.startsWith('!simple-move')) {
      // Parse the object ID, direction, and distance from the chat command arguments
      var args = msg.content.split(' ');
      var objectId = args[1];
      var direction = args[2];
      var distance = parseInt(args[3]);
  
      // Call the function to move the object in the specified direction by the specified distance
      moveToken(objectId, direction, distance);
    }
    //SIMPLE ID GRABBER
    if (msg.type === "api" && msg.content.indexOf("!simple-ids") !== -1) {
      var selectedTokens = [];
      var commaDelineatedList = "";
  
      // Get all selected tokens
      selectedTokens = canvas.tokens.controlled;
  
      // Iterate through selected tokens and create a comma-delineated list of token IDs
      _.each(selectedTokens, function(token) {
        commaDelineatedList += token.id + ",";
      });
  
      // Remove the final comma from the list
      commaDelineatedList = commaDelineatedList.substring(0, commaDelineatedList.length - 1);
  
      // Output the list to the chat window
      sendChat("Selected Token IDs", "/w GM " + commaDelineatedList);
    }
    if(msg.type == "api" && msg.content.startsWith("!simple-positions")) {
      // Get the selected tokens
      var selectedTokens = msg.selected;
      if(selectedTokens === undefined || selectedTokens.length == 0) {
        // No tokens are selected, output an error message
        sendChat("API", "No tokens selected!");
      } else {
      // Iterate through each selected token
      selectedTokens.forEach(function(selectedToken) {
        // Get the selected token object
        var token = getObj(selectedToken._type, selectedToken._id);
  
        // Get the token ID, top, left, and rotation
        var id = token.get("_id");
        var top = Math.round(token.get("top"));
        var left = Math.round(token.get("left"));
        var rotation = Math.round(token.get("rotation"));
  
        // Output the command to modify the token
        log("!token-mod --ignore-selected --ids " + id + " --set top|" + top + " left|" + left + " rotation|" + rotation)
        sendChat("API", "Command: !token-mod --ignore-selected --ids " + id + " --set top|" + top + " left|" + left + " rotation|" + rotation);
        });
      }
    }
  });