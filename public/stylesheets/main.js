// const currentSong = document.querySelectorAll('#current-song');
const icon          = document.querySelectorAll('#icon');
let songlength      = document.querySelectorAll('#songlength');
const audioPlay     = document.querySelector('#audio-play');
const currentAudio  = document.querySelectorAll('#current-audio');
const playBar       = document.querySelector('#play-bar');
const sliderbar     = document.querySelector('.bar');
const imgSong       = document.querySelectorAll('#img-song');
const imgInBar      = document.querySelector('#img-inbar');
const nameSong      = document.querySelectorAll('#name-song');
const songInBar     = document.querySelector('#nameSong-inbar');
const nameArtist    = document.querySelectorAll('#name-artist');
const artistInBar   = document.querySelector('#nameArtist-inbar');
const hide          = document.querySelector('#hide-playbar');
const minimum       = document.querySelector('#minimum');
const phone         = document.querySelector('#phone');
const volume        = document.querySelector('.volume');
const volOption     = document.querySelector('.volume-option');
const slideVol      = document.querySelector('#slide-vol');
const mute          = document.querySelector('#mute');
const nextButton    = document.querySelector('#next');
const prevButton    = document.querySelector('#prev');
let currentVolume;
let iconInPlayBar;
let audioTime;
let buffer = 0;
const audio = [];
let next = 0;
let prev = 0;
audioPlay.volume = 0.08;
currentVolume = audioPlay.volume;

for(let i=0; i<icon.length; i++){
    audio[i] = new Audio();
    audio[i].src = currentAudio[i].getAttribute('data-song');
    audio[i].load();
    audio[i].preload = 'metadata';
    audio[i].addEventListener('loadedmetadata', function(){
        songlength[i].textContent = cal(Math.floor(audio[i].duration));
    });
    icon[i].addEventListener('click', function play(){
        if(decodeURIComponent(audioPlay.src) === window.location.protocol + "//" + window.location.host + currentAudio[i].getAttribute('data-song')){
            if(audioPlay.paused){
                audioPlay.play();
                audioTime = setInterval(rangeSong, 100);
                iconInPlayBar = icon[i];
                playBar.classList.remove('fa-play');
                playBar.classList.add('fa-pause');
                icon[i].classList.remove('fa-play');
                icon[i].classList.add('fa-pause');
                imgInBar.classList.add('rotate');
                imgInBar.src = imgSong[i].src;
                artistInBar.textContent = nameArtist[i].textContent;
                songInBar.textContent   = nameSong[i].textContent;
            }
            else{
                audioPlay.pause();
                iconInPlayBar = icon[i];
                console.log(iconInPlayBar);
                playBar.classList.remove('fa-pause');
                playBar.classList.add('fa-play');
                icon[i].classList.remove('fa-pause');
                icon[i].classList.add('fa-play');
            }
        }
        else{
            for(let j=0; j<icon.length; j++){
                if(i !== j){
                    icon[j].classList.remove('fa-pause');
                    icon[j].classList.add('fa-play');
                }
            }
            audioPlay.pause();
            audioPlay.src = currentAudio[i].getAttribute('data-song');
            audioPlay.load();
            audioPlay.preload = 'metadata';
            audioPlay.addEventListener('loadedmetadata',function(){ 
            sliderbar.max = audioPlay.duration;
            console.log(sliderbar.max);
            console.log(audioPlay.duration)
            });
            audioPlay.play();
            next = i;
            prev = i;
            iconInPlayBar = icon[i];
            audioTime = setInterval(rangeSong, 100);
            
            playBar.classList.remove('fa-play');
            playBar.classList.add('fa-pause');
            icon[i].classList.remove('fa-play');
            icon[i].classList.add('fa-pause');
            imgInBar.classList.add('rotate');
            imgInBar.src = imgSong[i].src;
            artistInBar.textContent = nameArtist[i].textContent;
            songInBar.textContent   = nameSong[i].textContent;
            if(i !== audio.length-1){
                prevButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318276.png';
                nextButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318275.png';
            }
            else{
                prevButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318276.png';
                nextButton.src = 'https://cdn-user-icons.flaticon.com/26450/26450250/1652775507444.svg?token=exp=1652776409~hmac=7d62f879bc8c5466fdb3336ca8458138';
                nextButton.style.cursor = 'default';
            }
            if(i !== 0){
                prevButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318276.png';
            }
            else{
                prevButton.src = 'https://cdn-user-icons.flaticon.com/26450/26450250/1652775563211.svg?token=exp=1652776464~hmac=c3914a9a5516f459965ad86e362eabd8';
                prevButton.style.cursor = 'default';
            }
        }    
    });
}

playBar.addEventListener('click', function(){
    if(audioPlay.paused){
        audioPlay.play();
        audioTime = setInterval(rangeSong, 100);
        console.log(iconInPlayBar);
        imgInBar.classList.add('rotate');
        playBar.classList.remove('fa-play');
        playBar.classList.add('fa-pause');
        iconInPlayBar.classList.remove('fa-play');
        iconInPlayBar.classList.add('fa-pause');
    }
    else{
        audioPlay.pause();
        playBar.classList.remove('fa-pause');
        playBar.classList.add('fa-play');
        iconInPlayBar.classList.remove('fa-pause');
        iconInPlayBar.classList.add('fa-play');
    }
});

sliderbar.addEventListener('change', function(){
    audioPlay.currentTime = sliderbar.value;
    clearInterval(audioTime);
    rangeSong();
    audioTime = setInterval(rangeSong, 1000);
});

volOption.addEventListener('click', function(){
    if(volume.classList.contains('hide')){
        volume.classList.remove('hide');
    }
    else{
        volume.classList.add('hide');
    }
});

slideVol.addEventListener('change', function(){
    audioPlay.volume = slideVol.value;
    currentVolume = audioPlay.volume;
    clearInterval(audioTime);
    rangeSong();
    audioTime = setInterval(rangeSong, 1000);
});


mute.addEventListener('click', function(){
    (mute.src = mute.src === 'https://cdn-icons.flaticon.com/png/128/2985/premium/2985082.png?token=exp=1652682477~hmac=541b235ac88f1780c74dc51cd066ca54'?  'https://cdn-icons-png.flaticon.com/128/608/608387.png': 'https://cdn-icons.flaticon.com/png/128/2985/premium/2985082.png?token=exp=1652682477~hmac=541b235ac88f1780c74dc51cd066ca54');
    (volOption.childNodes[1].src = volOption.childNodes[1].src === 'https://cdn-icons.flaticon.com/png/128/2985/premium/2985082.png?token=exp=1652682477~hmac=541b235ac88f1780c74dc51cd066ca54'?  'https://cdn-icons-png.flaticon.com/128/608/608387.png': 'https://cdn-icons.flaticon.com/png/128/2985/premium/2985082.png?token=exp=1652682477~hmac=541b235ac88f1780c74dc51cd066ca54');
    if(buffer === 0){
        audioPlay.volume = 0;
        buffer = 1;
    }
    else{
        audioPlay.volume = currentVolume;
        buffer = 0;
    }
    
});

function rangeSong(){
    sliderbar.value = audioPlay.currentTime;
    if(audioPlay.ended){
        if(next !== audio.length-1){
            audioPlay.src = currentAudio[next+1].getAttribute('data-song');
            console.log(audioPlay.src);
            audioPlay.play();
            iconInPlayBar = icon[next+1];
            playBar.classList.remove('fa-play');
            playBar.classList.add('fa-pause');
            icon[next+1].classList.remove('fa-play');
            icon[next+1].classList.add('fa-pause');
            imgInBar.classList.add('rotate');
            imgInBar.src = imgSong[next+1].src;
            artistInBar.textContent = nameArtist[next+1].textContent;
            songInBar.textContent   = nameSong[next+1].textContent;
            icon[next].classList.remove('fa-pause');
            icon[next].classList.add('fa-play');
            next++;
            prev++;
            nextButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318275.png';
        }
        else{
            playBar.classList.remove('fa-pause');
            playBar.classList.add('fa-play');
            iconInPlayBar.classList.remove('fa-pause');
            iconInPlayBar.classList.add('fa-play');
            imgInBar.classList.remove('rotate');
        }
        
    }
    if(next === audio.length-1){
        prevButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318276.png';
        nextButton.src = 'https://cdn-user-icons.flaticon.com/26450/26450250/1652775507444.svg?token=exp=1652776409~hmac=7d62f879bc8c5466fdb3336ca8458138';
        nextButton.style.cursor = 'default';
    }
    else{
        nextButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318275.png';
    }
    if(prev === 0){
        nextButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318275.png';
        prevButton.src = 'https://cdn-user-icons.flaticon.com/26450/26450250/1652775563211.svg?token=exp=1652776464~hmac=c3914a9a5516f459965ad86e362eabd8';
        prevButton.style.cursor = 'default';
    }
    else{
        prevButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318276.png';
    }
}

hide.addEventListener('click', function(){
    phone.classList.add('hide');
    minimum.classList.remove('hide');
});

minimum.addEventListener('click', function(){
    phone.classList.remove('hide');
    minimum.classList.add('hide');
});

function cal(cal){
    let min = Math.floor(cal/60);
    let sec = cal-min*60;
    return (min + ':' + sec.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
}

nextButton.addEventListener('click', function(){
    if(next !== audio.length-1){
        audioPlay.src = currentAudio[next+1].getAttribute('data-song');
        console.log(audioPlay.src);
        audioPlay.play();
        iconInPlayBar = icon[next+1];
        playBar.classList.remove('fa-play');
        playBar.classList.add('fa-pause');
        icon[next+1].classList.remove('fa-play');
        icon[next+1].classList.add('fa-pause');
        imgInBar.src = imgSong[next+1].src;
        artistInBar.textContent = nameArtist[next+1].textContent;
        songInBar.textContent   = nameSong[next+1].textContent;
        icon[next].classList.remove('fa-pause');
        icon[next].classList.add('fa-play');
        next++;
        prev++;
        nextButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318275.png';
    }
    else{
        prevButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318276.png';
        nextButton.src = 'https://cdn-user-icons.flaticon.com/26450/26450250/1652775507444.svg?token=exp=1652776409~hmac=7d62f879bc8c5466fdb3336ca8458138';
        nextButton.style.cursor = 'default';
    }
});

prevButton.addEventListener('click', function(){
    if(prev !== audio[0]){
        audioPlay.src = currentAudio[prev-1].getAttribute('data-song');
        audioPlay.play();
        iconInPlayBar = icon[prev-1];
        playBar.classList.remove('fa-play');
        playBar.classList.add('fa-pause');
        icon[prev-1].classList.remove('fa-play');
        icon[prev-1].classList.add('fa-pause');
        imgInBar.src = imgSong[prev-1].src;
        artistInBar.textContent = nameArtist[prev-1].textContent;
        songInBar.textContent   = nameSong[prev-1].textContent;
        icon[prev].classList.remove('fa-pause');
        icon[prev].classList.add('fa-play');
        prev--;
        next--;
        prevButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318276.png';
    }
    else{
        nextButton.src = 'https://cdn-icons-png.flaticon.com/128/318/318275.png';
        prevButton.src = 'https://cdn-user-icons.flaticon.com/26450/26450250/1652775563211.svg?token=exp=1652776464~hmac=c3914a9a5516f459965ad86e362eabd8';
        prevButton.style.cursor = 'default';
    }
});
