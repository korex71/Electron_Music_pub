const search = document.querySelector('input.custom-search')
const btnSearch = document.querySelector('.btn-search')
const listVideos = document.querySelector('.list-videos')

const sendSearch = (query) => {
    if(!navigator.onLine) return ErrConn()
    if(query) value = query
    PageHome.style.display = 'none'
    PageSearch.style.display = 'block'
    PageLibrary.style.display = 'none'
    document.querySelector('.active').classList.remove('active')
    document.querySelector('li.nav-item:nth-child(2)').classList.add('active')
    search.value = ""
    ipcRenderer.send('search', value); buscando = true; setLoading()

    console.log('*** Event: Search', value)
}

btnSearch.onclick = function(e) {
    sendSearch(search.value)
}

search.onkeypress = function(e) {
    if(e.keyCode === 13)
        sendSearch(this.value)
}

const emptySearch = () => {
    listVideos.innerHTML = `<h3 class='search-text'>Sem resultados para sua pesquisa</h3>`
}

ipcRenderer.on('search', (event, args) => {
    if(args.length === 0) return emptySearch()
    execute(args.content)
})

function execute(info) {
    $('.list-videos').empty()
    console.log(info)
    info.map(video => {
    let artist;
    
    if(Array.isArray(video.artist)){
        artist = video.artist[0].name
    }else{
        artist = video.artist.name
    }

    $('.list-videos').append(`
    <div class="row audio-list py-2 music" id="${video.videoId}" title="${video.name}" author="${artist}" thumb="${video.thumbnails[0].url}">
      <div class="ml-2 col-0 play-ico">
        <i data-feather="play-circle" width="35" height="35" stroke-width="1"></i>
      </div>
      <div class="col text-nowrap" style='overflow:hidden;align-self:center'>${artist} - ${video.name}</div>
      <div class="col-1 text-right" style='align-self: center;'>
          ${Math.floor(video.duration/60000)}:${Math.floor(video.duration / 1000 % 60)}
      </div>
    </div>
    `)
    })
    music = document.querySelectorAll('.music')
    music.forEach(e => {
        return e.onclick = () => load(e)
    })
    feather.replace()
}