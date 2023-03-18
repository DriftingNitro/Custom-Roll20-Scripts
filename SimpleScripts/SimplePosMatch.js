// Define a function that moves the object with the specified object ID to the position of the object
// with the specified target ID
function moveObject(objectId, targetId) {
    // Get the Roll20 objects for the specified object and target IDs
    var object = getObj('graphic', objectId);
    var target = getObj('graphic', targetId);
  
    // Check if the objects were found
    if (object && target) {
      // Set the position of the object to the position of the target
      object.set('left', target.get('left'));
      object.set('top', target.get('top'));
  
      // Send a message to the chat log indicating that the object was moved
      sendChat('API', '/w gm Object ' + object.get('name') + ' moved to position of object ' + target.get('name'));
    } else {
      // Send a message to the chat log indicating that the object or target was not found
      sendChat('API', '/w gm Unable to move object: object or target not found');
    }
  }
  
  // Register a listener for the '!move' chat command
  on('chat:message', function(msg) {
    // Check if the message is a chat command
    if (msg.type == 'api' && msg.content.startsWith('!moveto')) {
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
  
            // Set the position of the object to the specified coordinates
            object.set('left', x);
            object.set('top', y);
            
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
    if (msg.type == 'api' && msg.content.startsWith('!position')) {
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
            // Get the current position of the object
            var x = object.get('left');
            var y = object.get('top');
            // Shorten the number of decimal points for the x and y values to 0
            x = x.toFixed(0);
            y = y.toFixed(0);
            // Send a message to the chat log indicating the current position of the object
            sendChat('API', '/w gm Object ' + object.get('name') + ' is at position (' + x + ', ' + y + ')');
          }
        }
      } else {
        // Send a message to the chat log indicating that no objects are selected
        sendChat('API', '/w gm No objects selected');
      }
    }
    // Check if the message is a chat command
    if (msg.type == 'api' && msg.content.startsWith('!move')) {
      // Parse the object and target IDs from the chat command arguments
      var args = msg.content.split(' ');
      var objectId = args[1];
      var targetId = args[2];
  
      // Call the function to move the object to the position of the target
      moveObject(objectId, targetId);
    }
  });