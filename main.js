const {app, BrowserWindow, Tray, Menu, ipcMain, dialog} = require('electron')
const {autoUpdater} = require('electron-updater')
const path = require('path')
const ytsr = require('ytsr')
const ytdl = require('ytdl-core')
const fs = require('fs')
const slugify = require('slugify')
const YoutubeMusicApi = require('youtube-music-api')
const api = new YoutubeMusicApi()
const pathIcon = path.resolve(__dirname, 'assets', 'img', 'ico.png');
const {newFavorite, listFavorite, removeFavorite} = require('./modules/db')
const {downloadFile, searchSong, getAudioUrl} = require('./modules/services')
const { afterReady } = require('./modules/afterReady')

const Datastore = require('nedb')
, favDB = new Datastore({filename: 'config/fav.data', autoload: true})

let appIcon = null
let mainWindow = null

let history = []

ipcMain.on('setHistory', (event, args) => {
  const {id, title, author, img} = args
  ytdl.getBasicInfo()
  history.push(args)
  event.reply('setHistory', history)
})

ipcMain.on('search', (event, query) => searchSong(query, event))

ipcMain.on('geturl', async (event, id) => getAudioUrl(id, event))

ipcMain.on('addfav', async (event, info) => {
  const {id, title, author, thumblink} = info
  const url = 'https://www.youtube.com/watch?v=' + id;
  
  downloadFile(id, title, url, author, thumblink)
  newFavorite(favDB, id, title, author, thumblink)

})

ipcMain.on('favRemove', (event, id) => removeFavorite(favDB, id, event))

ipcMain.on('listFavs', (event) => listFavorite(favDB, event))

ipcMain.on('getthumb', async (event, id) => {
  console.log('*** GetThumb', id);
  const url = 'https://www.youtube.com/watch?v=' + id;
  const info = await ytdl.getBasicInfo(url);
  event.reply('getthumb', info.videoDetails.author.avatar);
})

ipcMain.on('HomePl', (event) => {
  api.initalize()
  .then(info => {
    api.getPlaylist('PL4fGSI1pDJn7rGBE8kEC0CqTa1nMh9AKB').then(result => {
      event.reply('HomePl', result)
    })
  })
})

const reloadLb = () => mainWindow.webContents.send('reload')

ipcMain.on('progress', (event, args) => mainWindow.setProgressBar(args));

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 768,
    minHeight: 565,
    center: true,
    backgroundColor: '#333',
    title: 'Electron Music',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    }
  });
  mainWindow.maximize()
  mainWindow.loadFile('index.html');

  mainWindow.on('close', (e) => {

  })
 
  appIcon.on('double-click', () => {
    mainWindow.show();
  })
};

app.on('ready', () => {
  appIcon = new Tray(pathIcon)
  appIcon.setToolTip('Electron Music');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Close app', click () {
      app.quit()
    }
    },
  ])
  appIcon.setContextMenu(contextMenu)
  afterReady(favDB)
  createWindow()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin'){
    appIcon.destroy();
    app.quit();
  }
  return appIcon.destroy()
})

// Auto Updater //

autoUpdater.autoDownload = true

function sendStatusToWindow(text) {
  mainWindow.webContents.send('message', text);
}

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
  console.log(log_message)
})

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? "Erro desconhecido" : (error.stack || error).toString())
})

autoUpdater.on('update-avalible', () => {
  //dosth
})

autoUpdater.on('update-not-available', () => {
  //dosth
})

autoUpdater.on('update-downloaded', () => {
  const notify = new Notification('Atualização', {
    body: 'Uma atualização foi baixada e será instalada ao sair ou clique aqui para instar agora.'
  })
  notify.onclick = () => autoUpdater.quitAndInstall(true, true)
})