const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const YoutubeMusicApi = require('youtube-music-api');

const downloadFile = (id, title, url, author) => {

  let starttime;

  const audio = ytdl(url, {filter: 'audioonly'});
  audio.pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'tmp', `${id}.mp3`)));
  audio.on('response', () => {
    starttime = Date.now();
  });

  audio.on('progress', (chunkLength, downloaded, total) => { 
    const percent = downloaded / total;
    const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
    const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
    const percentDownloaded = (percent * 100).toFixed(2);
    const atualDownload = (downloaded / 1024 / 1024).toFixed(2);
    const totalDownload = (total/1024/1024).toFixed(2);
    /*console.log(`
    ${title}\n
    ${percentDownloaded}%\n
    ${atualDownload}/${totalDownload}\n
    Tempo estimado: ${estimatedDownloadTime.toFixed(2)} min\n
    `);*/
  });

  audio.on('error', (err) => {
    console.log(`Erro no download: ${title}`)
    fs.unlinkSync(path.resolve(__dirname, '..', 'tmp', `${id}.mp3`));
    favDB.remove({id}, {}, (err, numRemoved) => {});
    mainWindow.webContents.send('message', err);
  })

  audio.on('end', () => {
    console.log(`Download finalizado: ${title}`)
    if(fs.existsSync(path.resolve(__dirname, '..', 'tmp', `${id}.mp3`))){
      try {
        fs.renameSync(path.resolve(__dirname, '..', 'tmp', `${id}.mp3`), path.resolve(__dirname, '..', 'musicas', `${id}.mp3`));
      } catch (err) {
        if(err) throw err;
      };
    }else{
      console.log('File does not exist');
      favDB.remove({id}, {}, (err, numRemoved) => {});
    };
  });
};

const searchSong = (query, event) => {
  if(query.lenght == 0) return
  const api = new YoutubeMusicApi();
  api.initalize()
  .then(info => {
    api.search(query, "song").then(result => {
      event.reply('search', result)
    })
  })
};

const getAudioUrl = async (id, event) => {
  const info = await ytdl.getInfo(id);
  const title = info.videoDetails.media.song;
  event.reply('geturl', info);
};

module.exports = {downloadFile, searchSong, getAudioUrl};