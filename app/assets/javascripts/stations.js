// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var Station = function(params){
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

            $el: value
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
          tracks[current_track].pausePlay();
        });
      },
      playNextTrack = function() {
        // hide currently playing track if it exists, and set current track
        if (current_track !== null) {
          tracks[current_track].stop();
          tracks[current_track].hide();
          current_track = current_track + 1;
        } else {
          // starting at the beginning
          current_track = 0;
        }
        tracks[current_track].show();
        tracks[current_track].play();

        console.log("playNextTrack() called");
      },
      asdf=1;
  init();
  return {

  };
};

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
  $el = params["$el"],
  soundObject = null, // Will hold soundManager object
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
      autoPlay: true,
      onload: function() {
        console.log('The sound '+this.sID+' loaded!');
      },
      volume: 50
    });
    soundObject.play();
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
    }
  };
};

soundManager.url = '/assets/lib/soundmanager/swf/';

soundManager.onready(function() {
  // Ready to use; soundManager.createSound() etc. can now be called.
  var station = new Station({});
  //soundManager.createSound({

  //});
});





// SC.initialize({
//   client_id: "7f77beae3d19100f293b7647d2e6c8e5",
//   redirect_uri: "http://soundcloud.dev/testing.html"
// });
// SC.stream("/tracks/293", function(sound) {
//   return sound.play();
// });
