const cfgWindow = document.querySelector('.window-config')

const ErrConn = () => {
  Toastify({
      text: "Verifique a conexão",
      duration: 5000, 
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      backgroundColor: "linear-gradient(to right, #ff7c0b, #0eff63)",
      stopOnFocus: false, // Prevents dismissing of toast on hover
      onClick: function(){
        //
      }
    }).showToast();
}

const setOff = () => {
  Toastify({
      text: "Você está offline",
      duration: 5000, 
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      backgroundColor: "linear-gradient(to right, #ff7c0b, #0eff63)",
      stopOnFocus: false, // Prevents dismissing of toast on hover
      onClick: function(){
        //
      }
    }).showToast();
    
  return console.log('*** Connection status: Offline')
}

const setOn = () => {
  Toastify({
      text: "Conectado novamente",
      duration: 5000, 
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      backgroundColor: "linear-gradient(to right, #ff7c0b, #0eff63)",
      stopOnFocus: false, // Prevents dismissing of toast on hover
      onClick: function(){
        //
      }
    }).showToast();
  
  return console.log('*** Connection status: Online')
}

window.ononline = () => setOn()
window.onoffline = () => setOff()

cfgWindow.onclick = () => ipcRenderer.send('window-config')
