// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var Station = function(){
  var $el = $("#tracklist"),
      $nextTrack = $("#next-track"),
      $pausePlay = $("#pause-play"),
      current_track = null, // init
      tracks = [],
      init = function() {
        var $tracks = $("#tracklist").find("li.track");
        $.each($tracks, function(index, value) {
          tracks.push(new Track({
            id: $(value).data("track-id"),
            stream_url: $(value).data("track-stream-url"),
            title: $(value).find(".title").text(),
            username: $(value).find(".username").text(),
            artwork_url: $(value).find("img.artwork").attr("src"),
            waveform_url: $(value).find("img.waveform").attr("src"),
            permalink_url: $(value).find("a.permalink").attr("href"),

            el: value
          }));
        });
        addListeners();
        playNextTrack();
      },
      addListeners = function () {
        $nextTrack.bind("click", function(ev){
          ev.preventDefault();
          console.log("next track clicked");
          playNextTrack();
        });
        $pausePlay.bind("click", function(ev){
          ev.preventDefault();
          console.log("pause/play called");
          pausePlayToggle();
        });
      },
      playNextTrack = function() {
        console.log("playNextTrack() called");
        if (tracks.length === 0) return false;
        // hide currently playing track if it exists, and set current track
        if (current_track !== null) {
          //tracks[current_track].stop();
          soundManager.destroySound(tracks[current_track].getId());
          tracks[current_track].hide();
          current_track = current_track + 1;
        } else {
          // starting at the beginning
          current_track = 0;
        }
        tracks[current_track].show();
        tracks[current_track].play();
      },
      pausePlayToggle = function() {
        console.log("pausePlayToggle() called");
        if (current_track !== null) {
          tracks[current_track].pausePlay();
        }
      };
  return {
    playNext: function() {
      playNextTrack();
    },
    pausePlayToggle: function() {
      pausePlayToggle();
    },
    init: function() {
      init();
    }
  };
};
var station = Station();

var Track = function(params){
  var soundcloud = {
    id:             params["id"],
    stream_url:     params["stream_url"],
    title:          params["title"],
    username:       params["username"],
    artwork_url:    params["artwork_url"],
    waveform_url:   params["waveform_url"],
    permalink_url:  params["permalink_url"]
  },
  $el = $(params["el"]),
  $trackTitle = $("#track-info .track-title"),
  soundObject = null, // Will hold sound object
  hide = function(){
    $($el).hide();
  },
  show = function(){
    $($el).show();
  },
  // Pauses or plays [toggle] the track
  pausePlay = function() {
    if (soundObject.paused) {
      soundObject.resume();
    } else {
      soundObject.pause();
    }
  },
  play = function() {
    soundObject = soundManager.createSound({
      id: soundcloud.id,
      url: soundcloud.stream_url,
      autoLoad: true,
      autoPlay: false,
      onload: events.onload,
      onfinish: events.onfinish,
      whileplaying: events.whileplaying,
      volume: 100
    });
    soundObject.play();
    // update 'now playing' title and link
    $trackTitle.html($el.find("h3").html());
    $trackTitle.attr("href", $el.find("a.permalink").attr("href"));
  },
  events = {
    onfinish: function () {
      console.log("the sound is finished. onfinish was called");
      console.log(station);
      station.playNext();
    },
    onload: function() {
      console.log('The sound '+this.sID+' loaded!');
    },
    whileplaying: function() {
      //console.log("whileplaying called");
      //console.log(soundObject.waveformData);
      // console.log(soundObject.eqData);
      //console.log(soundObject.peakData);
      // console.log(soundObject.position);
      // console.log(soundObject.duration);
      //soundObject.peakData.left
      //soundObject.peakData.right
      // Update position bar
      var pos_pct;
      if (soundObject.readyState == 3) {
        // 3 means fully loaded
        pos_pct = Math.round(soundObject.position / soundObject.duration * 100000) / 1000;
      } else {
        // not fully loaded, so use durationEstimate
        pos_pct = Math.round(soundObject.position / soundObject.durationEstimate * 100000) / 1000;
      }
      // console.log(soundObject.position);
      // console.log(soundObject.duration);
      // console.log(soundObject.durationEstimate);
      //console.log(pos_pct + "%");
      $("#progress-position").width(pos_pct + "%");
      // peak data
      
      var threshold = 0.45; // peaks above this will trigger viz change
      if (soundObject.peakData.left > threshold || soundObject.peakData.right > threshold) {
        // $("#peak").html("<pre>left:  " + soundObject.peakData.left + "\nright: " + soundObject.peakData.right + "</pre>");

        // color stuff is a real quick hackjob.
        // need to find a better way to pick colors
        var colors1 = ["#b01f15", // red
            "#b0671b", // orange
            "#b0ac24", // yellow
            "#53af1f", // green
            "#0022af", // blue
            "#b02a8e" // purple
            ],
            colors2 = ["#3955ff",
            "#636eff"
            ],
            colors = (Math.floor(Math.random()*2)==1) ? colors1 : colors2;
            num_colors = colors.length,
            rand_color = Math.floor(Math.random()*num_colors);
        if (!$("body").hasClass("animating")) {
          $("body").animate({"background-color": colors[rand_color]}, 100, "linear", function(){
            $("body").removeClass("animating");
          });
          $("body").addClass("animating");
        }

      }
    }
  },
  stop = function() {
      console.log("Track.stop called");
      soundObject.stop();
  };
  return {
    /* PUBLIC API METHODS */
    hide: function () {
      hide();
    },
    show: function () {
      show();
    },
    play: function() {
      play();
    },
    stop: function() {
      stop();
    },
    pausePlay: function() {
      pausePlay();
    },
    getId: function() {
      return soundcloud.id;
    }
  };
};

soundManager.url = '/assets/lib/soundmanager/swf/';

soundManager.flashVersion = 9;

soundManager.useHighPerformance = true;
soundManager.useFastPolling = true;

soundManager.allowScriptAccess = 'always';

soundManager.flash9Options.useWaveformData = false;
soundManager.flash9Options.useEQData = false;
soundManager.flash9Options.usePeakData = true;

if (soundManager.flash9Options.useWaveformData || soundManager.flash9Options.useEQData || soundManager.flash9Options.usePeakData) {
  // even if HTML5 supports MP3, prefer flash so the visualization features can be used.
  soundManager.preferFlash = true;
}


soundManager.onready(function() {
  // Ready to use; soundManager.createSound() etc. can now be called.
  station.init();
});


// Keyboard Shortcuts
key('shift+/', function(){ // handle ?
  $("#keyboard-shortcuts-overlay").toggle();
});

key('space, v', function(){
  console.log("space or v key pressed");
  station.pausePlayToggle();
});

key('right, n', function(){
  console.log("right or n key pressed");
  station.playNext();
});




