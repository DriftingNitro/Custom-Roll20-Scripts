//-- Example command: !matchAttributes @{selected|character_id} hp @{target|character_id} gp
var CommandMatchAttributes = '!matchAttributes';

on('chat:message', function(msg) {
  if (msg.type === 'api' && msg.content.indexOf(CommandMatchAttributes) !== -1) {
    var args = msg.content.split(/\s+/);
    if (args.length === 5) {
      //specified character IDs and attribute names
      var characterAId = args[1];
      var attributeAName = args[2];
      var characterBId = args[3];
      var attributeBName = args[4];

      // Find Character-A and Character-B by their IDs
      var characterA = getObj('character', characterAId);
      var characterB = getObj('character', characterBId);

      if (characterA && characterB) {
        on('change:attribute', (obj)=>{
          log("setting " + attributeAName + " to match " + attributeBName + " " + obj)
          if (obj.get('_characterid') === characterAId && obj.get('name') === attributeAName) {
            // Get the new value of the attribute for Character-A
            var newValue = parseInt(obj.get('current'));
            log("New value for attribute " + newValue)
            // Update the matching attribute for Character-B
            var attributeBobj = findObjs({
                type: 'attribute',
                characterid: characterBId,
                name: attributeBName
            }, {caseInsensitive: true})[0];
            log(attributeBobj)
            attributeBobj.set('current', newValue);
          
            // Send a chat message notifying the GM of the match
            sendChat('API', '/w gm Matching ' + attributeAName + ' for ' + characterA.get('name') + ' with ' + attributeBName + ' for ' + characterB.get('name') + '.');
          }
        });

        sendChat('API', '/w gm Matching attributes for ' + characterA.get('name') + ' and ' + characterB.get('name') + '.');
      } else {
        sendChat('API', '/w gm Error: One or both characters not found.');
      }
    } else {
      sendChat('API', '/w gm Error: Incorrect command format. Use ' + CommandMatchAttributes + ' characterAId attributeAName characterBId attributeBName');
    }
  }
});
