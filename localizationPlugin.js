// 1-29-2024 2:26AM
videojs.registerPlugin('localizationPlugin', function() {
  var myPlayer = this //Our video player
  let originalID; //Original videoID we loaded with, this is used for switching back to viewing from described video
  let describedVideoID;
  let tText = "" //Our transcript text
  let watchingOriginalVideo = true; //Tracks if we're watching the original video or the described video
  let viewingTranscript = false;
  let playlistArray;
  let nextVideo;

  console.log("localizationPlugin last updated @1/29/2024 2:48")

  setTimeout( function(){ //Delayed code
    describedVideoID = myPlayer.mediainfo.custom_fields.described_video_id
    originalID = myPlayer.mediainfo.id
    // console.log("Described video ID now set to", describedVideoID)
    //Playlist Code
    playlistArray = myPlayer.playlistMenu.items
    // console.log("Playlist items", playlistArray)
    myPlayer.catalog.getPlaylist(myPlayer.playlistinfo.id, function(error, playlist){
      myPlayer.catalog.load(playlist);
      myPlayer.on('playlistitem', function() { //When changing videos from playlist
        nextVideo = playlistArray[myPlayer.playlist.currentItem()] // Get index of video clicked
        myPlayer.catalog.getVideo(nextVideo.item.id, function(error, video) {
          myPlayer.catalog.load(video); // Load our video clicked
          setTimeout( function() { // Short Delay
            myPlayer.play()
            originalID = myPlayer.mediainfo.id // For our custom button
            describedVideoID = myPlayer.mediainfo.custom_fields.described_video_id
            // console.log("swapping original id to", originalID, "described video id to", describedVideoID)

            // Reset our buttons
            watchingOriginalVideo = true;
            const tBox = document.getElementById("transcriptBox")
            tBox.style.display = 'none'
            setTimeout(function(){
              myPlayer.getChild('ControlBar').removeChild('FullscreenToggle')
              myPlayer.getChild('ControlBar').removeChild('PlaybackRateMenuButton')
              myPlayer.getChild('ControlBar').removeChild('PictureInPictureToggle')
              myPlayer.getChild('ControlBar').removeChild('dvButton')
              myPlayer.getChild('ControlBar').removeChild('Button')
              //If we don't use trycatch, it will crash our script and the original buttons won't get added back
              try {
                if ( describedVideoID ){ //Check for a described video
                  dvButton()
                }
              }
              catch(err) {
                console.log("Error fetching described video", err)
              }
              try {
                if ( myPlayer.mediainfo.transcripts[0] && watchingOriginalVideo == true ){ // Only if we're not watching a described video
                  transcriptButton()
                }
              }
              catch(err) {
                console.log("Error fetching transcript", err)
              }
              //Add our buttons back after the new one(s)
              myPlayer.getChild('ControlBar').addChild('PlaybackRateMenuButton')
              myPlayer.getChild('ControlBar').addChild('PictureInPictureToggle')
              myPlayer.getChild('ControlBar').addChild('FullscreenToggle')
              
            })
          }, 600)
          // videojs.log("new video id", myPlayer.mediainfo.id, "nextvideo", nextVideo)
        })
      });
      // console.log('player options: ', myPlayer.options())
    });
  }, 600)


  //Setting our JSON dictionaries
  let deJSON = 
  {
    "Described Video": "Beschriebenes Video",
    "Original Video": "Original Video",
    "Transcript": "Transkript",
    "Play": "Wiedergabe",
    "Pause": "Pause",
    "Replay": "Erneut abspielen",
    "Current Time": "Aktueller Zeitpunkt",
    "Duration": "Dauer",
    "Remaining Time": "Verbleibende Zeit",
    "Stream Type": "Streamtyp",
    "LIVE": "LIVE",
    "Loaded": "Geladen",
    "Progress": "Status",
    "Fullscreen": "Vollbild",
    "Exit Fullscreen": "Vollbildmodus beenden",
    "Mute": "Stumm schalten",
    "Unmute": "Ton einschalten",
    "Playback Rate": "Wiedergabegeschwindigkeit",
    "Subtitles": "Untertitel",
    "subtitles off": "Untertitel aus",
    "Captions": "Untertitel",
    "captions off": "Untertitel aus",
    "Chapters": "Kapitel",
    "You aborted the media playback": "Sie haben die Videowiedergabe abgebrochen.",
    "A network error caused the media download to fail part-way.": "Der Videodownload ist aufgrund eines Netzwerkfehlers fehlgeschlagen.",
    "The media could not be loaded, either because the server or network failed or because the format is not supported.": "Das Video konnte nicht geladen werden, da entweder ein Server- oder Netzwerkfehler auftrat oder das Format nicht unterstützt wird.",
    "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "Die Videowiedergabe wurde entweder wegen eines Problems mit einem beschädigten Video oder wegen verwendeten Funktionen, die vom Browser nicht unterstützt werden, abgebrochen.",
    "No compatible source was found for this media.": "Für dieses Video wurde keine kompatible Quelle gefunden.",
    "Play Video": "Video abspielen",
    "Close": "Schließen",
    "Modal Window": "Modales Fenster",
    "This is a modal window": "Dies ist ein modales Fenster",
    "This modal can be closed by pressing the Escape key or activating the close button.": "Durch Drücken der Esc-Taste bzw. Betätigung der Schaltfläche \"Schließen\" wird dieses modale Fenster geschlossen.",
    ", opens captions settings dialog": ", öffnet Einstellungen für Untertitel",
    ", opens subtitles settings dialog": ", öffnet Einstellungen für Untertitel",
    ", selected": ", ausgewählt",
    "captions settings": "Untertiteleinstellungen",
    "subtitles settings": "Untertiteleinstellungen",
    "descriptions settings": "Einstellungen für Beschreibungen",
    "Close Modal Dialog": "Modales Fenster schließen",
    "Descriptions": "Beschreibungen",
    "descriptions off": "Beschreibungen aus",
    "The media is encrypted and we do not have the keys to decrypt it.": "Die Entschlüsselungsschlüssel für den verschlüsselten Medieninhalt sind nicht verfügbar.",
    ", opens descriptions settings dialog": ", öffnet Einstellungen für Beschreibungen",
    "Audio Track": "Tonspur",
    "Text": "Schrift",
    "White": "Weiß",
    "Black": "Schwarz",
    "Red": "Rot",
    "Green": "Grün",
    "Blue": "Blau",
    "Yellow": "Gelb",
    "Magenta": "Magenta",
    "Cyan": "Türkis",
    "Background": "Hintergrund",
    "Window": "Fenster",
    "Transparent": "Durchsichtig",
    "Semi-Transparent": "Halbdurchsichtig",
    "Opaque": "Undurchsichtig",
    "Font Size": "Schriftgröße",
    "Text Edge Style": "Textkantenstil",
    "None": "Kein",
    "Raised": "Erhoben",
    "Depressed": "Gedrückt",
    "Uniform": "Uniform",
    "Drop shadow": "Schlagschatten",
    "Font Family": "Schriftfamilie",
    "Proportional Sans-Serif": "Proportionale Sans-Serif",
    "Monospace Sans-Serif": "Monospace Sans-Serif",
    "Proportional Serif": "Proportionale Serif",
    "Monospace Serif": "Monospace Serif",
    "Casual": "Zwanglos",
    "Script": "Schreibschrift",
    "Small Caps": "Small-Caps",
    "Reset": "Zurücksetzen",
    "restore all settings to the default values": "Alle Einstellungen auf die Standardwerte zurücksetzen",
    "Done": "Fertig",
    "Caption Settings Dialog": "Einstellungsdialog für Untertitel",
    "Beginning of dialog window. Escape will cancel and close the window.": "Anfang des Dialogfensters. Esc bricht ab und schließt das Fenster.",
    "End of dialog window.": "Ende des Dialogfensters.",
    "Audio Player": "Audio-Player",
    "Video Player": "Video-Player",
    "Progress Bar": "Fortschrittsbalken",
    "progress bar timing: currentTime={1} duration={2}": "{1} von {2}",
    "Volume Level": "Lautstärke",
    "{1} is loading.": "{1} wird geladen.",
    "Seek to live, currently behind live": "Zur Live-Übertragung wechseln. Aktuell wird es nicht live abgespielt.",
    "Seek to live, currently playing live": "Zur Live-Übertragung wechseln. Es wird aktuell live abgespielt.",
    "Exit Picture-in-Picture": "Bild-im-Bild-Modus beenden",
    "Picture-in-Picture": "Bild-im-Bild-Modus",
    "No content": "Kein Inhalt",
    "Color": "Farbe",
    "Opacity": "Deckkraft",
    "Text Background": "Texthintergrund",
    "Caption Area Background": "Hintergrund des Untertitelbereichs",
    "Playing in Picture-in-Picture": "Wird im Bild-im-Bild-Modus wiedergegeben",
    "Skip forward {1} seconds": "{1} Sekunden vorwärts",
    "Skip backward {1} seconds": "{1} Sekunden zurück"
  }
  let esJSON = 
  {
    "Described Video": "Vídeo descrito",
    "Original Video": "Vídeo original",
    "Transcript": "Transcripción",
    "Play": "Reproducir",
    "Play Video": "Reproducir Vídeo",
    "Pause": "Pausa",
    "Current Time": "Tiempo reproducido",
    "Duration": "Duración total",
    "Remaining Time": "Tiempo restante",
    "Stream Type": "Tipo de secuencia",
    "LIVE": "DIRECTO",
    "Loaded": "Cargado",
    "Progress": "Progreso",
    "Fullscreen": "Pantalla completa",
    "Exit Fullscreen": "Pantalla no completa",
    "Mute": "Desactivar el sonido",
    "Unmute": "Activar el sonido",
    "Playback Rate": "Velocidad de reproducción",
    "Subtitles": "Subtítulos",
    "subtitles off": "Subtítulos desactivados",
    "Captions": "Subtítulos especiales",
    "captions off": "Subtítulos especiales desactivados",
    "Chapters": "Capítulos",
    "You aborted the media playback": "Ha interrumpido la reproducción del vídeo.",
    "A network error caused the media download to fail part-way.": "Un error de red ha interrumpido la descarga del vídeo.",
    "The media could not be loaded, either because the server or network failed or because the format is not supported.": "No se ha podido cargar el vídeo debido a un fallo de red o del servidor o porque el formato es incompatible.",
    "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "La reproducción de vídeo se ha interrumpido por un problema de corrupción de datos o porque el vídeo precisa funciones que su navegador no ofrece.",
    "No compatible source was found for this media.": "No se ha encontrado ninguna fuente compatible con este vídeo.",
    "Audio Player": "Reproductor de audio",
    "Video Player": "Reproductor de video",
    "Replay": "Volver a reproducir",
    "Seek to live, currently behind live": "Buscar en vivo, actualmente demorado con respecto a la transmisión en vivo",
    "Seek to live, currently playing live": "Buscar en vivo, actualmente reproduciendo en vivo",
    "Progress Bar": "Barra de progreso",
    "progress bar timing: currentTime={1} duration={2}": "{1} de {2}",
    "Descriptions": "Descripciones",
    "descriptions off": "descripciones desactivadas",
    "Audio Track": "Pista de audio",
    "Volume Level": "Nivel de volumen",
    "The media is encrypted and we do not have the keys to decrypt it.": "El material audiovisual está cifrado y no tenemos las claves para descifrarlo.",
    "Close": "Cerrar",
    "Modal Window": "Ventana modal",
    "This is a modal window": "Esta es una ventana modal",
    "This modal can be closed by pressing the Escape key or activating the close button.": "Esta ventana modal puede cerrarse presionando la tecla Escape o activando el botón de cierre.",
    ", opens captions settings dialog": ", abre el diálogo de configuración de leyendas",
    ", opens subtitles settings dialog": ", abre el diálogo de configuración de subtítulos",
    ", selected": ", seleccionado",
    "Close Modal Dialog": "Cierra cuadro de diálogo modal",
    ", opens descriptions settings dialog": ", abre el diálogo de configuración de las descripciones",
    "captions settings": "configuración de leyendas",
    "subtitles settings": "configuración de subtítulos",
    "descriptions settings": "configuración de descripciones",
    "Text": "Texto",
    "White": "Blanco",
    "Black": "Negro",
    "Red": "Rojo",
    "Green": "Verde",
    "Blue": "Azul",
    "Yellow": "Amarillo",
    "Magenta": "Magenta",
    "Cyan": "Cian",
    "Background": "Fondo",
    "Window": "Ventana",
    "Transparent": "Transparente",
    "Semi-Transparent": "Semitransparente",
    "Opaque": "Opaca",
    "Font Size": "Tamaño de fuente",
    "Text Edge Style": "Estilo de borde del texto",
    "None": "Ninguno",
    "Raised": "En relieve",
    "Depressed": "Hundido",
    "Uniform": "Uniforme",
    "Drop shadow": "Sombra paralela",
    "Font Family": "Familia de fuente",
    "Proportional Sans-Serif": "Sans-Serif proporcional",
    "Monospace Sans-Serif": "Sans-Serif monoespacio",
    "Proportional Serif": "Serif proporcional",
    "Monospace Serif": "Serif monoespacio",
    "Casual": "Informal",
    "Script": "Cursiva",
    "Small Caps": "Minúsculas",
    "Reset": "Restablecer",
    "restore all settings to the default values": "restablece todas las configuraciones a los valores predeterminados",
    "Done": "Listo",
    "Caption Settings Dialog": "Diálogo de configuración de leyendas",
    "Beginning of dialog window. Escape will cancel and close the window.": "Comienzo de la ventana de diálogo. La tecla Escape cancelará la operación y cerrará la ventana.",
    "End of dialog window.": "Final de la ventana de diálogo.",
    "{1} is loading.": "{1} se está cargando.",
    "Exit Picture-in-Picture": "Salir de imagen sobre imagen",
    "Picture-in-Picture": "Imagen sobre imagen",
    "No content": "Sin contenido",
    "Color": "Color",
    "Opacity": "Opacidad",
    "Text Background": "Fondo del texto",
    "Caption Area Background": "Fondo del área de subtítulos",
    "Skip forward {1} seconds": "Avanza {1} segundos",
    "Skip backward {1} seconds": "Retrocede {1} segundos"
  }
  let frJSON = 
  {
    "Described Video": "Vidéo descriptive",
    "Original Video": "Vidéo originale",
    "Transcript": "Transcription",
    "Audio Player": "Lecteur audio",
    "Video Player": "Lecteur vidéo",
    "Play": "Lecture",
    "Pause": "Pause",
    "Replay": "Revoir",
    "Current Time": "Temps actuel",
    "Duration": "Durée",
    "Remaining Time": "Temps restant",
    "Stream Type": "Type de flux",
    "LIVE": "EN DIRECT",
    "Seek to live, currently behind live": "Rechercher le direct, actuellement après le direct",
    "Seek to live, currently playing live": "Rechercher le direct, le direct actuellement en cours de lecture",
    "Loaded": "Chargé",
    "Progress": "Progression",
    "Progress Bar": "Barre de progression",
    "progress bar timing: currentTime={1} duration={2}": "{1} de {2}",
    "Fullscreen": "Plein écran",
    "Exit Fullscreen": "Fenêtré",
    "Mute": "Mettre en sourdine",
    "Unmute": "Activer le son",
    "Playback Rate": "Vitesse de lecture",
    "Subtitles": "Sous-titres",
    "subtitles off": "Sous-titres désactivés",
    "Captions": "Sous-titres transcrits",
    "captions off": "Sous-titres transcrits désactivés",
    "Chapters": "Chapitres",
    "Descriptions": "Descriptions",
    "descriptions off": "descriptions désactivées",
    "Audio Track": "Piste audio",
    "Volume Level": "Niveau de volume",
    "You aborted the media playback": "Vous avez interrompu la lecture de la vidéo.",
    "A network error caused the media download to fail part-way.": "Une erreur de réseau a interrompu le téléchargement de la vidéo.",
    "The media could not be loaded, either because the server or network failed or because the format is not supported.": "Cette vidéo n'a pas pu être chargée, soit parce que le serveur ou le réseau a échoué ou parce que le format n'est pas reconnu.",
    "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "La lecture de la vidéo a été interrompue à cause d'un problème de corruption ou parce que la vidéo utilise des fonctionnalités non prises en charge par votre navigateur.",
    "No compatible source was found for this media.": "Aucune source compatible n'a été trouvée pour cette vidéo.",
    "The media is encrypted and we do not have the keys to decrypt it.": "Le média est chiffré et nous n'avons pas les clés pour le déchiffrer.",
    "Play Video": "Lire la vidéo",
    "Close": "Fermer",
    "Close Modal Dialog": "Fermer la boîte de dialogue modale",
    "Modal Window": "Fenêtre modale",
    "This is a modal window": "Ceci est une fenêtre modale",
    "This modal can be closed by pressing the Escape key or activating the close button.": "Ce modal peut être fermé en appuyant sur la touche Échap ou activer le bouton de fermeture.",
    ", opens captions settings dialog": ", ouvrir les paramètres des sous-titres transcrits",
    ", opens subtitles settings dialog": ", ouvrir les paramètres des sous-titres",
    ", opens descriptions settings dialog": ", ouvrir les paramètres des descriptions",
    ", selected": ", sélectionné",
    "captions settings": "Paramètres des sous-titres transcrits",
    "subtitles settings": "Paramètres des sous-titres",
    "descriptions settings": "Paramètres des descriptions",
    "Text": "Texte",
    "White": "Blanc",
    "Black": "Noir",
    "Red": "Rouge",
    "Green": "Vert",
    "Blue": "Bleu",
    "Yellow": "Jaune",
    "Magenta": "Magenta",
    "Cyan": "Cyan",
    "Background": "Arrière-plan",
    "Window": "Fenêtre",
    "Transparent": "Transparent",
    "Semi-Transparent": "Semi-transparent",
    "Opaque": "Opaque",
    "Font Size": "Taille des caractères",
    "Text Edge Style": "Style des contours du texte",
    "None": "Aucun",
    "Raised": "Élevé",
    "Depressed": "Enfoncé",
    "Uniform": "Uniforme",
    "Drop shadow": "Ombre portée",
    "Font Family": "Famille de polices",
    "Proportional Sans-Serif": "Polices à chasse variable sans empattement (Proportional Sans-Serif)",
    "Monospace Sans-Serif": "Polices à chasse fixe sans empattement (Monospace Sans-Serif)",
    "Proportional Serif": "Polices à chasse variable avec empattement (Proportional Serif)",
    "Monospace Serif": "Polices à chasse fixe avec empattement (Monospace Serif)",
    "Casual": "Manuscrite",
    "Script": "Scripte",
    "Small Caps": "Petites capitales",
    "Reset": "Réinitialiser",
    "restore all settings to the default values": "Restaurer tous les paramètres aux valeurs par défaut",
    "Done": "Terminé",
    "Caption Settings Dialog": "Boîte de dialogue des paramètres des sous-titres transcrits",
    "Beginning of dialog window. Escape will cancel and close the window.": "Début de la fenêtre de dialogue. La touche d'échappement annulera et fermera la fenêtre.",
    "End of dialog window.": "Fin de la fenêtre de dialogue.",
    "Exit Picture-in-Picture": "Quitter le mode image dans l'image",
    "Picture-in-Picture": "Image dans l'image",
    "{1} is loading.": "{1} en cours de chargement.",
    "No content": "Aucun contenu",
    "Color": "Couleur",
    "Opacity": "Opacité",
    "Text Background": "Arrière-plan du texte",
    "Caption Area Background": "Arrière-plan de la zone de sous-titre",
    "Skip backward {1} seconds": "Reculer de {1} secondes",
    "Skip forward {1} seconds": "Avancer de {1} secondes"
  }

  videojs.addLanguage('de', deJSON);
  videojs.addLanguage('es', esJSON);
  videojs.addLanguage('fr', frJSON);

  // Used for HTML DOM placement of our transcript box
  function insertAfter(newNode, refNode){
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
   }

  // Remove buttons for reordering if we don't remove these, our custome button will appear at the end. We'll add these back at the bottom
  myPlayer.getChild('ControlBar').removeChild('FullscreenToggle')
  myPlayer.getChild('ControlBar').removeChild('PlaybackRateMenuButton')
  myPlayer.getChild('ControlBar').removeChild('PictureInPictureToggle')

  const Component = videojs.getComponent('Button');

  class MyComponent extends Component {
    constructor(player, options) {
      super(player, options);
    }
  }

  videojs.registerComponent('dvButton', MyComponent);  
 
  // Described/Original video button
  function dvButton(){
    myPlayer.getChild('controlBar').addChild('dvButton', {
      text: 'Described Video',
      controlText: 'Described Video',
      className: 'vjs-visible-text',
      clickHandler: function(event) {
        this.addClass('dvButton')
        //Load and play video based on what's already loaded
        if ( watchingOriginalVideo == true ) { //If we have the original video loaded and we click the button, load the described video
          myPlayer.catalog.getVideo(describedVideoID, function(error, video) {
            setTimeout( function(){
              myPlayer.catalog.load(video);
              myPlayer.play();
            }, 200)
          })
          this.controlText(myPlayer.localize("Original Video"))  //Change our button text
          watchingOriginalVideo = false; //Flip the switch so we know what we're currently watching
        }
        else {  //If we have the described video loaded and we click the button, load the original video
          myPlayer.catalog.getVideo(originalID, function(error, video) {
            setTimeout( function(){
              myPlayer.catalog.load(video);
              myPlayer.play();
            }, 200)
          })
          this.controlText(myPlayer.localize("Described Video")) //Change our button text
          watchingOriginalVideo = true; //Flip the switch so we know what we're currently watching
        }
      }
    })
  }

  // Transcript button code
  function transcriptButton(){
    // Create our transcriptBox div to add transcript text to
    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "transcriptBox")
    // var currentDiv = document.getElementById("myPlayerID");
    var currentDiv = document.getElementById("playlistUI");
    insertAfter(newDiv, currentDiv)
    
    //The button itself
    const transcriptButton = myPlayer.getChild('ControlBar').addChild('button', {
      controlText: myPlayer.localize("Transcript"),
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
    // If we don't use trycatch, it will crash our script and the original buttons won't get added back
    try {
      if ( describedVideoID ){ //Check for a described video
        dvButton()
      }
    }
    catch(err) {
      console.log("Error fetching described video", err)
    }

    try {
      if ( myPlayer.mediainfo.transcripts[0] ){ //Check for a transcript (the first one found)
        transcriptButton()
      }
    }
    catch(err) {
      console.log("Error fetching transcript", err)
    }
    //Add our buttons back after the new one(s)
    myPlayer.getChild('ControlBar').addChild('PlaybackRateMenuButton')
    myPlayer.getChild('ControlBar').addChild('PictureInPictureToggle')
    myPlayer.getChild('ControlBar').addChild('FullscreenToggle')
  }, 600) //300 is the time to wait, seems like the perfect amount of time to let all data load.

})
