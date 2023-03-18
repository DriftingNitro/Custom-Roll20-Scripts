function CleanTableUrl(imgsrc) {
    if (imgsrc !== null){
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?(%[^\s]*)?$/);
        if(parts) {
            cleanImgUrl = parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
            cleanImgUrl = cleanImgUrl.replace(/%3A/g, ":").replace(/\.jpg%/g, ".jpg?");
            log(cleanImgUrl);
            return cleanImgUrl;
        }return;
    }return;
};

on("chat:message", function(msg) {
  if (msg.type == "api" && msg.content.startsWith("!simple-flip")) {
    //example: !simple-flip -NJlFLRj23xqgnvMYyrN 1000 2
    var args = msg.content.split(" ");
    var tokenId = args[1];
    var interval = args[2];
    var repeat = args[3];
    
    var count = 0;
    setInterval(function() {
      var token = getObj("graphic", tokenId);
      var currentSide = token.get("currentSide");
      var newSide = (currentSide + 1) % token.get("sides").split("|").length;
      
      // Get the array of image URLs for the token's sides
      var sides = token.get("sides").split("|");
      //clean the URL to set imgsrc later
      newSideImgSrc = CleanTableUrl(sides[newSide])
      // Set the new side of the token and update the imgsrc property
      token.set("currentSide", newSide);
      token.set("imgsrc", newSideImgSrc);
      
      count++;
      if (count >= repeat) {
        clearInterval(this);
      }
    }, interval);
  }
});