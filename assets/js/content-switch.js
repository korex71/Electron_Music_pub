const PageHome = document.querySelector('#home')
const PageSearch = document.querySelector('#search')
const PageLibrary = document.querySelector('#library')

const toggle = document.querySelectorAll('.toggle-page')

toggle.forEach(el => {
  el.onclick = (e) => {
    if(e.target.localName == 'span'){
      document.querySelector('.active').classList.remove('active')
      showPage(e.path[1].getAttribute('ref'), e.path[1])
    }else{
      document.querySelector('.active').classList.remove('active')
      showPage(e.target.getAttribute('ref'), e.target)
    }
  }
})

const showPage = (ref, element) => {
  if(element.classList.contains('active')) return
  element.classList.add('active')

  PageHome.style.display = 'none'
  PageSearch.style.display = 'none'
  PageLibrary.style.display = 'none'
  switch (ref) {
    case 'home':
      PageHome.style.display = 'block';
      break;
    case 'search':
      PageSearch.style.display = 'block';
      break;
    case 'library':
      PageLibrary.style.display = 'block';
      loadLibrary()
      break;
    default:
      break;
  }
}

const setLoading = () => {
  document.querySelector('h3.search-text').innerText = search.value
  document.querySelector('.list-videos').innerHTML = (`
  <div class="d-flex justify-content-center" style='margin-top:9rem!important'>
      <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
      </div>
  </div>`)
}
