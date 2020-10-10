const fs = window.fs = require('fs')
const ytdl = window.ytdl = require('ytdl-core')
const ytsr = window.ytsr = require('ytsr')
const path = window.path = require('path')
const slugify = window.slugify = require('slugify');
const Toastify = window.Toastify = require('toastify-js')
const ipcRenderer = window.ipcRenderer = require('electron').ipcRenderer
const lPath = window.lpath = __dirname