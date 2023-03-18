function LoadingCleanTableUrl(imgsrc) {
    if (imgsrc !== null){
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?(%[^\s]*)?$/);
        if(parts) {
            cleanImgUrl = parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
            cleanImgUrl = cleanImgUrl.replace(/%3A/g, ":").replace(/\.(jpg|png)%/g, ".$1?");
            log(cleanImgUrl);
            return cleanImgUrl;
        }return;
    }return;
};
 
//Script use instructions:
//create a page called "loading"
//create a rollable table called "loading_tip"
//create a rollable table called "loading_image"
//use the command "!loading" & the MapChange api command "!mc moveall --target loading"
//to move players to the page and randomize the images
 
on("chat:message", function(msg) {
  if (msg.type == "api" && msg.content.startsWith("!loading")) {
      
        var loadingPage = findObjs({_type: "page", name: "loading"}, {caseInsensitive: true})[0];
        if (!loadingPage) {
            sendChat("loading screen", "Loading page not found, make sure the page is named 'loading'.");
            return;
        };
        
        var graphics = findObjs({_type: "graphic", _pageid: loadingPage.get("_id")});
        _.each(graphics, function(graphic) {
        if (graphic.get("name") === "loading_tip") {
          loadingTip = getObj("graphic", graphic.get("_id"));
        } else if (graphic.get("name") === "loading_image") {
          loadingImage = getObj("graphic", graphic.get("_id"));
        }
        });
        if (!loadingTip) {
            sendChat("loading screen", "Loading tip not found, make sure it is named 'loading_tip' in the token settings.");
            return;
        };
        if (!loadingImage) {
            log("loading screen", "Loading image not found, make sure it is named 'loading_image' in the token settings.");
            return;
        };
        
        lengthTips = loadingTip.get("sides").split("|").length;
        lengthImages = loadingImage.get("sides").split("|").length;
        
        var newTip = Math.floor(Math.random() * (lengthTips))
        var newImage = Math.floor(Math.random() * (lengthImages))
        log(newTip + " tip number, " + newImage + " image number");
        // Get the array of image URLs for the token's sides
        var tipSides = loadingTip.get("sides").split("|");
        var imageSides = loadingImage.get("sides").split("|");
        //clean the URL to set imgsrc later
        newTipImgSrc = LoadingCleanTableUrl(tipSides[newTip])
        newImageImgSrc = LoadingCleanTableUrl(imageSides[newImage])
        // Set the new side of the token and update the imgsrc property
        loadingTip.set("currentSide", newTip);
        loadingTip.set("imgsrc", newTipImgSrc);
        
        loadingImage.set("currentSide", newImage);
        loadingImage.set("imgsrc", newImageImgSrc);
        log(newTipImgSrc)
    }
});