// Define the YouTube video ID
const youtubeVideoId = 'KCiVG6mTor0';

// Initialize the YouTube video player
let youtubePlayer;

function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        videoId: youtubeVideoId,
        playerVars: {
            autoplay: 1,
            loop: 1,
            controls: 0,
            showinfo: 0,
            mute: 0,
        },
        events: {
            onReady: onPlayerReady
        }
    });
}

// Callback function when the YouTube player is ready
function onPlayerReady(event) {
  event.target.playVideo();
}

// Add the onYouTubeIframeAPIReady function to the global scope
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

// Define your music-related functionality
function playMusic() {
  // Call the onYouTubeIframeAPIReady function
  onYouTubeIframeAPIReady();
}

export { playMusic }