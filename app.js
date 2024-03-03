const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const headerAuthor = $('.author');
const headerSong = $('.song-name');
const dashboardThumb = $('.dashboard-thumb');
const audio = $('#audio'); 
const playBtn =$('.btn-toggle-play');
const wrapper = $('.wrapper');
const progress = $('#progress');
const nextBtn = $('.btn-next'); 
const prevBtn = $('.btn-prev'); 
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const slider = $('.progress');
const min = slider.min;
const max = slider.max;
const value = slider.value;

slider.style.background = `linear-gradient(to right, #77baed 0%, #77baed ${(value-min)/(max-min)*100}%, #DEE2E6 ${(value-min)/(max-min)*100}%, #DEE2E6 100%)`

slider.oninput = function() {
  this.style.background = `linear-gradient(to right, #77baed 0%, #77baed ${(this.value-this.min)/(this.max-this.min)*100}%, #DEE2E6 ${(this.value-this.min)/(this.max-this.min)*100}%, #DEE2E6 100%)`
};

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: 'Tennessee Whiskey',
      singer: 'Chris Stapleton',
      path: './assets/music/whiskey.mp3',
      image: './assets/img/chris-stapleton.jpg'
    },
    {
      name: 'Beertalks',
      singer: 'Cá Hồi Hoang',
      path: './assets/music/beertalks.mp3',
      image: './assets/img/ca-hoi-hoang.jpg'
    },
    {
      name: 'Cơn Bão',
      singer: 'Cam',
      path: './assets/music/con-bao.mp3',
      image: './assets/img/cam.jpg'
    },
    {
      name: 'Hẹn Một Mai',
      singer: 'Bùi Anh Tuấn',
      path: './assets/music/hen-mot-mai.mp3',
      image: './assets/img/bui-anh-tuan.jpg'
    },
    {
      name: 'Hey Jude',
      singer: 'The Beatles',
      path: './assets/music/hey-jude.mp3',
      image: './assets/img/the_beatles.jpg'
    },
    {
      name: 'My Song',
      singer: 'Labi Siffre',
      path: './assets/music/my-song.mp3',
      image: './assets/img/labi-siffre.jpg'
    },
    {
      name: 'Những Lời Hứa Bỏ Quên',
      singer: 'Vũ',
      path: './assets/music/nhung-loi-hua-bo-quen.mp3',
      image: './assets/img/vu.jpg'
    },
    {
      name: 'Stay',
      singer: 'Laroi Kid & Justin Bieber',
      path: './assets/music/stay.mp3',
      image: './assets/img/laroi-kid.jpg'
    },
    {
      name: 'Thủy Triều',
      singer: 'Quang Hùng',
      path: './assets/music/thuy-trieu.mp3',
      image: './assets/img/quang-hung.jpg'
    }
  ],
  render: function()
  {
    function renderSongsWithMetadata(songs) {
      // Lưu trữ tham chiếu đến đối tượng hiện tại
      const _this = this;
  
      // Hàm đệ quy để xử lý từng bài hát một
      function renderNextSong(index) {
          if (index >= songs.length) {
              return; // Nếu đã xử lý hết các bài hát, thoát
          }
          const song = songs[index];
          const audio = new Audio(song.path);
          let duration = 'Unknown';
  
          // Thêm sự kiện loadedmetadata vào audio
          audio.addEventListener('loadedmetadata', function() {
              duration = formatTime(audio.duration);
              // Sau khi có thông tin về thời lượng, cập nhật phần HTML của bài hát
              const html = renderSong(song, duration, index);
              
              $('.playlist-song').insertAdjacentHTML('beforeend', html);
  
              // Tiếp tục xử lý bài hát tiếp theo
              renderNextSong(index + 1);
          });
      }
  
      // Bắt đầu xử lý từ bài hát đầu tiên
      renderNextSong(0);
  }
  
  // Gọi hàm để bắt đầu render
  renderSongsWithMetadata(this.songs);
  
  function renderSong(song, duration, index) {
      const isActive = index === 0 ? 'active' : ''; // Kiểm tra xem bài hát đầu tiên không
      return `
          <div class="song ${isActive}" data-index="${index}">
              <div class="song-wrapper">
                  <div class="song-thumb" style="background-image: url('${song.image}');"></div>
                  <div class="playlist-body">
                      <div class="playlist-song__name">${song.name}</div>
                      <div class="song-author">${song.singer}</div>
                  </div>
              </div>
              <div class="song-time">${duration}</div>
          </div>`;
  }
  
  function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  // Xử lý sự kiện khi bài hát được chọn
  $('.playlist-song').addEventListener('click', function(event) {
      const songElement = event.target.closest('.song');
      if (!songElement) return;
  
      const newIndex = parseInt(songElement.dataset.index);
      _this.currentIndex = newIndex;
  
      // Loại bỏ lớp active khỏi bài hát trước đó
      const activeSongElement = this.querySelector('.song.active');
      if (activeSongElement) {
          activeSongElement.classList.remove('active');
      }
  
      // Thêm lớp active cho bài hát được chọn
      songElement.classList.add('active');
      // Load và phát bài hát mới
      _this.loadCurrentSong();
      audio.play();
  });
  },

  defineProperties: function()
  {
    Object.defineProperty(this, 'currentSong', {
      get: function()
      {
        return this.songs[this.currentIndex];
      }
    })
  },

  handleEvents: function()
  {
    _this = this;
    // Zoom in and zoom out animation events
    const dashboardThumb = $('.dashboard-thumb-wrapper');
    const dashboardThumbWidth = dashboardThumb.offsetWidth
    const divToScroll = $('.playlist-song');

    const playlistMargin = $('.playlist');
    var style = window.getComputedStyle(playlistMargin);
    var marginTopOld = parseInt(style.getPropertyValue('margin-top'));
    
    divToScroll.addEventListener('scroll',() =>
    {
      const srollTop = divToScroll.scrollTop;
      const newThumbWidth = dashboardThumbWidth - srollTop;
      const newMarginTop = marginTopOld - srollTop;

      dashboardThumb.style.height = newThumbWidth > 0 ? newThumbWidth + 'px': 0;
      dashboardThumb.style.width = newThumbWidth > 0 ? newThumbWidth + 'px': 0;
      dashboardThumb.style.opacity = newThumbWidth / dashboardThumbWidth;
      
      // playlistMargin.style.marginTop = newMarginTop < 230 ? '192px' : marginTopOld + 'px';

      if(newMarginTop < 230)
      {
        playlistMargin.style.marginTop = '192px';
        playlistMargin.style.animation = 'slideIn 0.3s ease forwards';
        playlistMargin.style.animation = '';
      }
      else if(newMarginTop > 13)
      {
        playlistMargin.style.marginTop = marginTopOld + 'px';
      }
    });


    // Audio Play events
    playBtn.onclick = function()
    {
      if(_this.isPlaying)
      {
        audio.pause();
      }
      else
      {
        audio.play();
      }
    }

    // when song is playing
    audio.onplay = function()
    {
      _this.isPlaying = true;
      wrapper.classList.add('playing');
    };

    // when song is paused
    audio.onpause = function()
    {
      _this.isPlaying = false;
      wrapper.classList.remove('playing');
    };

    function updateProgressBarColor() {
      const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
      const min = progress.min;
      const max = progress.max;
      progress.style.background = `linear-gradient(to right, #77baed 0%, #77baed ${progressPercent}%, #DEE2E6 ${progressPercent}%, #DEE2E6 100%)`;
    }

    // on progress changing
    audio.ontimeupdate = function()
    {
      if(audio.duration)
      {
        updateProgressBarColor();
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent;
      }
    }

    // handle when rewind progress
    progress.oninput = function(e)
    {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    }

    // Update active song
    function updateActiveSong() {
      const activeSongElement = $('.playlist-song .song.active');
      if (activeSongElement) {
          activeSongElement.classList.remove('active');
      }
  
      const currentSongElement = $(`.playlist-song .song[data-index="${_this.currentIndex}"]`);
      if (currentSongElement) {
          currentSongElement.classList.add('active');
      }
    }

    // Next song
    nextBtn.onclick = function()
    {
      if(_this.isRandom)
      {
        _this.playRandomSong();
      }
      else
      {
        _this.loadNextSong();
      }
      
      audio.play();
      updateActiveSong();
      _this.scrollToActiveSong();
    }

    // Prev song
    prevBtn.onclick = function()
    {
      if(_this.isRandom)
      {
        _this.playRandomSong();
      }
      else
      {
        _this.loadPrevSong();
      }
      audio.play();
      updateActiveSong();
      _this.scrollToActiveSong();
    }

    // Random song toggle
    randomBtn.onclick = function()
    {
        _this.isRandom = !_this.isRandom;
        randomBtn.classList.toggle('active', _this.isRandom);
    }

    // Video on ended
    audio.onended = function()
    {
      if(_this.isRepeat)
      {
        audio.play();
      }
      else
      {
        nextBtn.click();
      }
    }

    // repeat song
    repeatBtn.onclick = function()
    {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat);
    }
  },

  scrollToActiveSong: function()
  {
    setTimeout(() => {
      const activeSong = $('.song.active');
      
      activeSong.scrollIntoView(
        {
          behavior:'smooth',
          block: 'end',
        }
      )

    }, 200);

  },

  loadNextSong: function()
  {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length)
    {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  loadPrevSong: function()
  {
    this.currentIndex--;
    if(this.currentIndex < 0)
    {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function()
  {
    let newIndex;
    do
    {
      newIndex = Math.floor(Math.random() * this.songs.length);
    }
    while(newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
    
  },

  loadCurrentSong: function()
  {
    headerAuthor.textContent = this.currentSong.singer;
    headerSong.textContent = this.currentSong.name;
    dashboardThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },



  start: function()
  {
    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();
  }
}

app.start();