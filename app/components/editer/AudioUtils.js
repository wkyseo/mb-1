let AudioUtils = {};

AudioUtils.CONNECT = 'connectAudio.wav';
AudioUtils.DISCONNECT = 'disconnectAudio.wav';

AudioUtils._lastSound = '';
AudioUtils._audio = null;

AudioUtils.play = function (audioSrc) {
  // let audio = document.getElementById('audio-id'); 
  if(AudioUtils._audio == null) {
    AudioUtils._audio = document.createElement('audio');
    AudioUtils._audio.id = 'audio-id';
    AudioUtils._audio.preload = 'auto';
    AudioUtils._audio.src = './audio/' + audioSrc;
    document.body.appendChild(AudioUtils._audio);
  }

  if(AudioUtils._audio == null) {
    return;
  }
  if(AudioUtils._lastSound != audioSrc) {
    AudioUtils._audio.src = './audio/' + audioSrc;
    AudioUtils._lastSound = AudioUtils._audio.src;
  }
  
  AudioUtils._audio.currentTime = 0;
  AudioUtils._audio.play();
};


export { AudioUtils };