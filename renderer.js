var audio_History = []

const favRemove = id => ipcRenderer.send('favRemove', id)

const newHistItem = (info) => {
    audio_History.push(info)
    console.log(audio_History)
}

ipcRenderer.on('setHistory', (event, args) => {
    const a = args.length - 1
    console.log(args)
    const b = args[a]
    console.log(b)
    $('#history').append(`
    <div class="col-lg-3 col-sm-6 col-md-4">
        <div class="card">
            <a href="#">
                <img class="card-img-top rounded-0 mb-3"
                    src="${b.img}" />
            </a>
            <div class="card-body p-0">
                <a href="#">
                    <h5 class="card-title">${b.title}</h5>
                    <p class="card-text">${b.author}</p>
                </a>
            </div>

            <div class="btn-play">
                <button class="d-flex justify-content-center align-items-center" onclick="searchSong('${b.title}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        </div>
    </div>
`)
})

ipcRenderer.on('favRemove', (event, args) => loadLibrary())

ipcRenderer.on('message', (event, msg) => console.log(msg))

ipcRenderer.on('listFavs', (event, args) => {
    $('.library-list').empty()
    console.log(args)
    if(args.length === 0) return $('.library-list').append('<h3 class="text-center text-light"></h3>')
    args.map(file => {
        const {_id, id, title, author, thumblink} = file
        $('.library-list').append(`
            <div class="row audio-list py-2">
                <div class="ml-2 col-0 play-ico favorite-play" id="${id}" title="${title}" author="${author}" thumb="${thumblink}">
                    <i data-feather="play-circle" width="35" height="35" stroke-width="1"></i>
                </div>
                <div class="col text-nowrap" style='overflow:hidden;align-self:center'>${title}</div>
                <div class="col-auto text-nowrap" style='overflow:hidden;align-self:center'>
                    ${author}
                </div>
                <div class="col-1 text-right remove-song" onclick="favRemove('${_id}')">
                    <i data-feather="x-circle" width="35" height="35" stroke-width="1"></i>
                </div>
            </div>
        `)
    })
    favElements = document.querySelectorAll('.favorite-play')
    favElements.forEach(e => e.onclick = () => loadFav(e))
    feather.replace()
})

const loadLibrary = () => ipcRenderer.send('listFavs')

if(navigator.onLine) ipcRenderer.send('HomePl')
ipcRenderer.on('HomePl', (event, info) => {
    $('#mainpl').empty()
    console.log(info)
    for (let i = 0; i < info.content.length; i++) {
        const x = info.content[i]
        const artist = Array.isArray(x.author) ? x.author[0].name : x.author.name
        const thumb = Array.isArray(x.thumbnails) ? x.thumbnails[1].url : x.thumbnails.url
        const playThumb = Array.isArray(x.thumbnails) ? x.thumbnails[0].url : x.thumbnails.url
        $('#mainpl').append(`
        <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
            <div class="card">
                    <img class="card-img-top rounded-circle mb-3"
                        src="${thumb}" />
                <div class="card-body p-0">
                    <h5 class="card-title">${x.name}</h5>
                    <p class="card-text">${artist}</p>
                </div>

                <div class="btn-play">
                    <button class="d-flex justify-content-center align-items-center" v_id="${x.videoId}" v_title="${x.name}" v_artist="${artist}" v_thumb="${playThumb}">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
        </div>  
        `)
    }
    document.querySelectorAll('.btn-play > button').forEach(el => el.onclick = function(e) {loadMusic(e)})
})

let main = document.getElementById('main');
let header = document.getElementById('header-overlay');
main.onscroll = function (event) {
    const scroll = this.scrollTop;
    if (scroll < 60) {
        header.style.opacity = '.' + scroll;
    } else {
        header.style.opacity = 1;
    }
}