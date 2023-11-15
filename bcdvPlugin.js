// 11-15-2023 8:52AM
videojs.registerPlugin('bcdvPlugin', function() {
  var myPlayer = this //Our video player
  let originalID = myPlayer.mediainfo.id //Original videoID we loaded with, this is used for switching back to viewing from described video
  let describedVideoID;
  setTimeout(function(){
    describedVideoID = myPlayer.mediainfo.custom_fields.described_video_id}, 500)
  let tText = "" //Our transcript text
  let watchingOriginalVideo = true; //Tracks if we're watching the original video or the described video
  let viewingTranscript = false;

  // Used for HTML DOM placement of our transcript box
  function insertAfter(newNode, refNode){
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
   }

  // Remove buttons for reordering if we don't remove these, our custome button will appear at the end. We'll add these back at the bottom
  myPlayer.getChild('ControlBar').removeChild('FullscreenToggle')
  myPlayer.getChild('ControlBar').removeChild('PlaybackRateMenuButton')
  myPlayer.getChild('ControlBar').removeChild('PictureInPictureToggle')
 
  // Described/Original video button
  function dvButton(){
    const dvButton = myPlayer.getChild('ControlBar').addChild('button', {
      controlText: 'Described Video',
      className: 'vjs-visible-text',
      clickHandler: function() {
        try{
          //Load and play video based on what's already loaded
          if ( watchingOriginalVideo == true ) { //If we have the original video loaded and we click the button, load the described video
            myPlayer.catalog.getVideo(describedVideoID, function(error, video) {
              myPlayer.catalog.load(video);
              myPlayer.play();
            })
            dvButton.controlText("Original Video") //Change our button text
            watchingOriginalVideo = false; //Flip the switch so we know what we're currently watching
          }
          else {  //If we have the described video loaded and we click the button, load the original video
            myPlayer.catalog.getVideo(originalID, function(error, video) {
              myPlayer.catalog.load(video);
              myPlayer.play();
            })
            dvButton.controlText("Described Video") //Change our button text
            watchingOriginalVideo = true; //Flip the switch so we know what we're currently watching
          }
        }
        catch(err) {
          console.log(err)
        }
      }

    });
  }

  // Transcript button code
  function transcriptButton(){
    // Create our transcriptBox div to add transcript text to
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", "transcriptBox")
    const currentDiv = document.getElementById("myPlayerID");
    insertAfter(newDiv, currentDiv)

    //The button itself
    const transcriptButton = myPlayer.getChild('ControlBar').addChild('button', {
      controlText: 'Transcript',
      className: 'vjs-visible-text',
      clickHandler: function(event) { //What the button does upon being clicked
        if  ( viewingTranscript ){ //If we can already see the transcript, hide the transcript div
          const tBox = document.getElementById("transcriptBox")
          tBox.style.display = 'none'
          viewingTranscript = false;
        }
        else { //If we're not viewing the transcript, show the transcript div
          const tBox = document.getElementById("transcriptBox")
          tBox.style.display = 'block'
          viewingTranscript = true;
        }
      }
    })

    //Check the transcript URL linked and retrieve the text
    let tURL = myPlayer.mediainfo.transcripts[0].src.replace("http://", "https://") // Make transcript secure, otherwise we error
    fetch(tURL)
      .then(function(response) {
        response.text().then(function(text) {
          tText = text
          const tBox = document.getElementById("transcriptBox")
          tBox.innerText = tText
        })
      })
        
  }

  //Check for transcript and described video, add buttons if found, do it in a timely manner so the data is fully loaded before we try
  setTimeout(function(){
    //If we don't use trycatch, it will crash our script and the original buttons won't get added back
    try {
      if ( describedVideoID ){ //Check for a described video
        dvButton()
      }
    }
    catch(err) {
      console.log(err)
    }
    try {
      if ( myPlayer.mediainfo.transcripts[0] ){ //Check for a transcript (the first one found)
        transcriptButton()
      }
    }
    catch(err) {
      console.log(err)
    }
    //Add our buttons back after the new one(s)
    myPlayer.getChild('ControlBar').addChild('PlaybackRateMenuButton')
    myPlayer.getChild('ControlBar').addChild('PictureInPictureToggle')
    myPlayer.getChild('ControlBar').addChild('FullscreenToggle')
  }, 1000) //500 is the time to wait, seems like the perfect amount of time to let all data load.

})
