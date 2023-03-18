function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function resetPos(segment1,segment2,pageHeight) {
      log("reset tile pos");
      segment1.set("left", -70);
      //log("Segment1 reset: " + segment1.get("left"));
      segment2.set("left", pageHeight - 70);
      //log("Segment2 reset: " + segment2.get("left"));
  }
  
  function sendToStart (segment, pageHeight) {
      segment.set("left", -(pageHeight - (pageHeight/2)) - 175 );
      segment.set("layer", "map");
  }
  
  function moveMap(segment,pageHeight,segmentPos) {
      log("Segment current position " + segmentPos);
      log("Page height: " + pageHeight);
      
      if (segmentPos + 280 > (pageHeight + (pageHeight/2))) {
          sendToStart(segment, pageHeight);
          log("Sending segment to start");
      } else if (segmentPos + 280 > (pageHeight + (pageHeight/2)) - 70) {
          segment.set("layer", "walls");
          toBack(segment);
      }
      segment.set("left", segment.get("left")+70);
      log("Segment moved");
  }
  
  on("ready", function() {
      
      var masterPage = findObjs({type: 'page', name: 'ScrollMap'})[0];
      //var pageHeight = parseInt(masterPage.get('height')) * 70;
      var pageHeight = 1750;
      
      runTreadmill = false;
      
      on("chat:message", function(msg) {
          if(msg.type == "api" && msg.content == "!move") {
              log("command start");
              
              runTreadmill = true;
              
              var segment1 = findObjs({_type: "graphic", name: "scroll3"})[0];
              var segment2 = findObjs({_type: "graphic", name: "scroll4"})[0];
              
              resetPos(segment1,segment2,pageHeight);
              
              log("Page height in pixels: " + pageHeight);
              
              setInterval(function() {
                  if (runTreadmill) {
                      log("Loop Cycle");
                      moveMap(segment1, pageHeight,parseInt(segment1.get("left")-70));
                      moveMap(segment2, pageHeight,parseInt(segment2.get("left")-70));
                  } else {return}
              }, 3000);
              
          }	
          
          if(msg.type == "api" && msg.content == "!stopmove") {
              runTreadmill = false;
              log("Scrolling Stopped");
          }
          
          if(msg.type == "api" && msg.content == "!resetscroll") {
              var segment1 = findObjs({_type: "graphic", name: "scroll3"})[0];
              var segment2 = findObjs({_type: "graphic", name: "scroll4"})[0];
              
              resetPos(segment1,segment2,pageHeight);
          }
      });
   });