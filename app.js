// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp(

);


//* UI ELEMENTS

const newsService = (function (){
  const apiUrl = 'https://newsapi.org/v2';
  const apiKey = 'ff95b6e4589740cea5ffe89360375f5e';

  return{
    topHeadLines(country = 'us',cb){
      http.get(`${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,cb)
    },
    everything(query, cb){
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,cb)
    }
  }
})()

const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
})

//  init selects
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadNews()
});

//! LOAD NEWS FUNCTION

function loadNews(){
  showLoader()
  const search = searchInput.value;
  const country = countrySelect.value;

  if(!search){
    newsService.topHeadLines(country,onGetResponse)
  }else{
    newsService.everything(search,onGetResponse)
  }


}

//! CHECK RESPONSE

function onGetResponse(err,res){
  removeLoader()
  if(err){
    showAlert(err, 'error-msg');
    return
  }
  if(!res.articles.length){
    showAlert('По вашему запросу ничего не было найдено');
    return;
  }
  renderNews(res.articles)
}

//! RENDER NEWS

function renderNews(news){
  const newsContainer = document.querySelector('.news-container .row');
  newsContainer.innerHTML = "";
  let fragment = '';

  news.forEach(newsItem => {
    const el = newsTemplate(newsItem)
    fragment += el;
  })

  newsContainer.insertAdjacentHTML('afterbegin', fragment)
}

//! ERROR ALERTS

function showAlert(msg = 'error', type = 'success'){
  M.toast({html: msg, type: type})
}

//! LOADER

function showLoader(){
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="progress">
      <div class="indeterminate"></div>
  </div>
  `)
}

function removeLoader(){
  const loader = document.querySelector('.progress')
  if(loader){
    loader.remove();
  }
}

//! newsItem template function

function newsTemplate({urlToImage, title, url,description}){

  return `
  <div class="col s12">
    <div class="card">
        <div class="card-image">
            <img src="${urlToImage || 'https://i.pinimg.com/originals/b5/32/67/b53267023f6490aa188a22b9eae92045.jpg'}" alt="">
            <span class="card-title">${title || ''}</span>
        </div>
    <div class="card-content">
       <p>${description || ''}</p>
    </div>
    <div class="card-action">
        <a href="${url}">Read More</a>
    </div>
    </div>
  </div>
  `;

}