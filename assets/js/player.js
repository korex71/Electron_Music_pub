const audio = document.createElement('audio'); 
      audio.setAttribute('autoplay', '');
const slider = document.querySelector('#range-time');
const volume = document.querySelector('#range-volume');
const back = document.querySelector('.back');
const next = document.querySelector('.next');
const trigger = document.querySelector('#playb');
const mute = document.querySelector('.mute-volume');
const repeat = document.querySelector('.repeat');
const heart = document.querySelector('.save-song');

const testBTN = document.querySelector('#header > div.d-flex.ml-auto > div > button')

var music = document.querySelectorAll('.music');
var localPlay = document.querySelectorAll('.local-play');
var favElements = document.querySelectorAll('.favorite-play');
var startTime = document.querySelector('.tempo-atual');
var endTime = document.querySelector('.tempo-final');

audio.afterMute = 100;

audio.data = {
  favorite: false,
  song: document.querySelector('.default-song'),
  author: document.querySelector('.default-author'),
  img: document.querySelector('.cover > img'),
  id: null,
}

audio.control = {
  trigger() {
    audio.paused ? audio.play() : audio.pause();
  },
  back() {
    console.log('Back song');
  },
  next() {
    console.log('Next song');
  },
  mute() {
    if(audio.muted){
      audio.muted = false;
      audio.volume = audio.afterMute;
      volume.value = (audio.afterMute*100);
      setVolumeIco(volume.value);
      feather.replace();
      console.log(`*** Event: Mute off, back to ${audio.volume*100}%`);
      volume.style.background = `linear-gradient(to right, var(--green) 0%, var(--green) ${volume.value}%, var(--dark) ${volume.value}%, var(--dark) 100%)`
    }else{
      audio.muted = true;
      audio.afterMute = audio.volume;
      volume.value = 0;
      audio.volume = 0;
      console.log(`*** Event: Mute on, changed to 0% and saved old value ${volume.afterMute*100}%`);
      mute.innerHTML = '<i data-feather="volume-x" width="16" height="24"></i>'; feather.replace();
      volume.style.background = `linear-gradient(to right, var(--green) 0%, var(--green) 0%, var(--dark) 0%, var(--dark) 100%)`;
    }
  }

};

audio.onerror = (e) => {
  console.log(e)
}

trigger.onclick = () => audio.control.trigger();
back.onclick = () => audio.control.back();
next.onclick = () => audio.control.next();

audio.onloadedmetadata = (e) => {
  console.log('*** Event: MetaData');
  slider.setAttribute('max', audio.duration)
  endTime.textContent = convertTime(audio.duration)
};

audio.onplay = (e) => {
  trigger.innerHTML = '<i data-feather="pause-circle" width="38" height="38" stroke-width="1"></i>'; feather.replace();
  console.log('*** Event: Play');
  ytdl.getBasicInfo(audio.id).then(data => {
    const thumb = data.videoDetails.thumbnail.thumbnails
    let img
    thumb.map(x => {
      if(x.width > 300 || x.width < 500) return x.url
    })
    const info = {
      title: audio.data.song.textContent,
      author: audio.data.author.textContent,
      img,
      id: audio.id,
    }
    newHistItem(info)
  })
};

audio.onpause = (e) => {
  trigger.innerHTML = '<i data-feather="play-circle" width="38" height="38" stroke-width="1"></i>'; feather.replace();
  console.log('*** Event: Pause');
};

audio.onended = (e) => {
  trigger.innerHTML = '<i data-feather="play-circle" width="38" height="38" stroke-width="1"></i>'; feather.replace();
  console.log('*** Event: Audio finalizado.');
};

mute.onclick = (e) => audio.control.mute();

audio.ontimeupdate = () => {
  ipcRenderer.send('progress', parseFloat((audio.currentTime / audio.duration).toFixed(1)));
  startTime.textContent = convertTime(audio.currentTime)
  slider.value = Math.round(audio.currentTime)
  const sliderProgress = slider.value/slider.max*100
  slider.style.background = `linear-gradient(to right, var(--green) 0%, var(--green) ${sliderProgress}%, var(--dark) ${sliderProgress}%, var(--dark) 100%)`
  //
  if(startTime.textContent == convertTime(audio.currentTime)) return false
  console.log('*** Time Update:', startTime.textContent + ' / ' + endTime.textContent, `(${audio.currentTime.toFixed(2)} / ${audio.duration.toFixed(2)}) Seconds`);
  };

const convertTime = (seconds, ms) => {
  if(ms){
    let sec = ms/1000;
    return Math.floor(sec % 60);
  };
  let m = Math.floor(seconds / 60);
  let s = Math.floor(seconds % 60);
  if(s < 10) s = "0" + s;
  return `${m}:${s}`;
}

slider.oninput = () => {
  const sliderProgress = slider.value/slider.max*100
  slider.style.background = `linear-gradient(to right, var(--green) 0%, var(--green) ${sliderProgress}%, var(--dark) ${sliderProgress}%, var(--dark) 100%)`;
}

slider.onchange = () => {
  console.log('*** Event: Change, Audio duration');
  audio.currentTime = slider.value;
  const sliderProgress = slider.value/slider.max*100
  slider.style.background = `linear-gradient(to right, var(--green) 0%, var(--green) ${sliderProgress}%, var(--dark) ${sliderProgress}%, var(--dark) 100%)`;
}

volume.oninput = () => {
  volume.style.background = `linear-gradient(to right, var(--green) 0%, var(--green) ${volume.value}%, var(--dark) ${volume.value}%, var(--dark) 100%)`;
  audio.volume = (volume.value/100);
  setVolumeIco(volume.value)
  feather.replace();
  console.log(`*** Event: Change, Volume value: ${volume.value}%`);
}

repeat.onclick = () => {
  if(audio.loop) {
    repeat.style.color = 'var(--white)';
    audio.loop = false; console.log('*** Event: Loop, off');
  }else {
    repeat.style.color = 'var(--green)';
    audio.loop = true; console.log('*** Event: Loop, on');
  };
};

const setVolumeIco = (value) => {
  if(value > 0 && value <= 25){
    $('.mute-volume').html('<i data-feather="volume" width="16" height="24"></i>');
  }else if(value > 25 && value <= 60){
    $('.mute-volume').html('<i data-feather="volume-1" width="16" height="24"></i>');
  }else if(value > 60){
    $('.mute-volume').html('<i data-feather="volume-2" width="16" height="24"></i>');
  }else if(value == 0){
    $('.mute-volume').html('<i data-feather="volume-x" width="16" height="24"></i>');
  };
  feather.replace();
};

ipcRenderer.on('geturl', (event, info) => {
  const {url} = ytdl.chooseFormat(info.formats, 'audioonly');
  audio.src = url;
});

function loadFav(e) {
  if(!navigator.onLine) return ErrConn();
  const {id, title} = e;
  audio.id = id
  const author = e.getAttribute('author')
  audio.data.img.src = e.getAttribute('thumb');
  audio.data.song.innerText = title;
  audio.data.author.innerText = author;
  heart.innerHTML = '';
  if(fs.existsSync(path.resolve(lpath, 'musicas', `${title}.mp3`))){
    audio.src = path.resolve(lpath, 'musicas', `${title}.mp3`);
  }else{
    ipcRenderer.send('geturl', id);
  }
};

const executeFav = (info) => {
  console.log(info)
}

function load(e) {
  const {id, title} = e; console.log('Song ID:', id); 
  audio.id = id
  console.log(e)
  if(!navigator.onLine) return ErrConn();
  heart.innerHTML = '<i class="fas fa-heart"></i>';
  audio.data.song.innerText = title;
  audio.data.author.innerText = e.getAttribute('author');
  audio.data.img.src = e.getAttribute('thumb');
  ipcRenderer.send('geturl', id);

};

function loadMusic(e) {
  console.log(e)
  const info = e.target
  audio.id = info.getAttribute('v_id')
  console.log(info)
  console.log(info.getAttribute('v_title'), info.getAttribute('v_artist'), info.getAttribute('v_id'))
  audio.data.author.innerText = info.getAttribute('v_artist')
  audio.data.song.innerText = info.getAttribute('v_title')
  audio.data.img.src = info.getAttribute('v_thumb')
  ipcRenderer.send('geturl', info.getAttribute('v_id'))
}

function executeData(args) {
  const {info} = args
  console.log('*** Info', info)
 
  heart.innerHTML = '<i data-feather="heart" width="16" height="24"></i>'; feather.replace()
  console.log(info);
  const {url} = ytdl.chooseFormat(info.formats, 'audioonly');
  console.log(url);
};

heart.onclick = (e) => {
  if(audio.id == "") return;
  if(!navigator.onLine) return ErrConn();
  ipcRenderer.send('addfav', {
    id: audio.id,
    title: audio.data.song.textContent,
    author: audio.data.author.textContent,
    thumblink: audio.data.img.src
  });
  heart.innerHTML = "";
};

testBTN.onclick = (e) => {

}

const renderHeart = (e) => {

}
