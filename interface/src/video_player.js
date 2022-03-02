// Constants
const VIDEO_CONTROLS_FADE_OUT_DELAY = 1;
const DISPLAY_TIME_VIDEO_CONTROLS = 5;

// Video elements
const videoContainer = document.querySelector('[data-video-container]');
const videoElement = document.querySelector('[data-video-player]');

// Video Controls
const videoControlsContainer = document.querySelector('[data-video-controls]');
const videoTimeBar = document.querySelector('[data-video-time-bar]');
const videoTimeBarProgress = document.querySelector('[data-video-time-bar-progress]');
const videoTimeBarBuffer = document.querySelector('[data-video-time-bar-buffer]');
const videoPlayPauseButton = document.querySelector('[data-video-play-pause-button]');

// Timeouts
let hideControlsTimeout;

// All the video player keys
const VIDEO_PLAYER_COMMANDS = {
  Enter: playPauseVideoSwitch,
  Space: playPauseVideoSwitch,
  KeyF: switchFullScreen,
  ArrowLeft: handleRemove5SecsFromVideo,
  ArrowRight: handleAdd5SecsToVideo,
}

// Handle document keydowns
function handleDocumentKeyDown(event) {
  const keyPressed = event.code;
  
  if(typeof VIDEO_PLAYER_COMMANDS[keyPressed] == 'function') {
    VIDEO_PLAYER_COMMANDS[keyPressed]();
  }
}

// Set video on full screen
function openFullscreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) { /* Safari */
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) { /* IE11 */
    videoContainer.msRequestFullscreen();
  }
}

// Close Fullscreen
function closeFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// Switch fullscreen between ative/inactive
function switchFullScreen() {
  if(window.fullScreen) {
    closeFullScreen();
  }
  else{
    openFullscreen();
  }
}


// Play/pause functions
function playPauseVideoSwitch() {
  const videoIsPlaying = ((videoElement.paused == false) && (videoElement.ended == false) && (videoElement.currentTime > 0));
    
    handleVideoControlsTimedDisplay();

    if(videoIsPlaying) {
      videoElement.pause();
      videoPlayPauseButton.classList.remove('fa-pause');
      videoPlayPauseButton.classList.add('fa-play');
    }
    else{
      videoElement.play();
      videoPlayPauseButton.classList.remove('fa-play');
      videoPlayPauseButton.classList.add('fa-pause');
    }
}

// Show and hide controls
function handleVideoControlsTimedDisplay() {
  showVideoControls();

  clearTimeout(hideControlsTimeout);
  hideControlsTimeout = setTimeout(hideVideoControls, DISPLAY_TIME_VIDEO_CONTROLS*1000)
}

function showVideoControls() {
  videoControlsContainer.classList.remove('hidded');
  videoControlsContainer.style.transition = ``;
  videoControlsContainer.style.opacity = 1;
}

function hideVideoControls() {
  videoControlsContainer.style.transition = `opacity ${VIDEO_CONTROLS_FADE_OUT_DELAY}s`;
  videoControlsContainer.style.opacity = 0;

  setTimeout(() => {
    videoControlsContainer.classList.add('hidded');
  }, (VIDEO_CONTROLS_FADE_OUT_DELAY+0.5) * 1000);
}

// Time change handling
function handleTimeChange() {
  var barPosition = videoElement.currentTime * 100 / videoElement.duration;

  videoTimeBarProgress.style.width = `${barPosition}%`;
}

// Handle buffering
function handleBufferChange() {
  var latestBuffer = videoElement.buffered.length - 1;
  var bufferedFromStart = videoElement.buffered.end(latestBuffer);
  var barPosition = bufferedFromStart * 100 / videoElement.duration;

  videoTimeBarBuffer.style.width = `${barPosition}%`;
}

videoElement.addEventListener('click', (event) => {
  if(event.detail > 1)
    return;
  playPauseVideoSwitch();
});

// Handle time adding/removing
function handleAdd5SecsToVideo() {
  showVideoControls();
  console.log(videoElement.currentTime);
  videoElement.currentTime = videoElement.currentTime + 5;
}

function handleRemove5SecsFromVideo() {
  showVideoControls();
  if(videoElement.currentTime >= 5) {
    videoElement.currentTime = videoElement.currentTime - 5;
  }
  else{
    videoElement.currentTime = 0;
  }
}

// Handle click on bar to change time
function handleClickOnTimeBar(event) {
  var xPosition = event.clientX;
  var newVideoPercentage = xPosition / videoTimeBar.offsetWidth;

  videoElement.currentTime = newVideoPercentage * videoElement.duration;
}

// Play/pause
videoPlayPauseButton.addEventListener('click', playPauseVideoSwitch);
videoElement.addEventListener('dblclick', switchFullScreen);

// Progress bars
videoTimeBar.addEventListener('click', handleClickOnTimeBar);
videoElement.addEventListener('timeupdate', handleTimeChange);
videoElement.addEventListener('progress', handleBufferChange);

// General key-detecting
document.addEventListener('keydown', handleDocumentKeyDown);
document.addEventListener('mousemove', handleVideoControlsTimedDisplay);