class CustomHttp{
    constructor(url,cb, body,headers,){
        this.cb = cb
        this.url = url;
        this.body = body;
        this.headers = headers;
    }
    get(){
        try{
            const xhr = new XMLHttpRequest();
            xhr.open('GET', this.url);
            xhr.addEventListener('load', () => {
                if (Math.floor(xhr.status / 100) !== 2) {
                  this.cb(`Error. Status code: ${xhr.status}`, xhr);
                  return;
                }
                const response = JSON.parse(xhr.responseText);
                this.cb(null, response);
              });

              xhr.addEventListener('error', () => {
                this.cb(`Error. Status code: ${xhr.status}`, xhr);
              });
      
              xhr.send();
        }catch(error){
            this.cb(error)
        }
    }

    post(){
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.url);
            xhr.addEventListener('load', () => {
              if (Math.floor(xhr.status / 100) !== 2) {
                cb(`Error. Status code: ${xhr.status}`, xhr);
                return;
              }
              const response = JSON.parse(xhr.responseText);
              this.cb(null, response);
            });
    
            xhr.addEventListener('error', () => {
              this.cb(`Error. Status code: ${xhr.status}`, xhr);
            });
    
            if (this.headers) {
              Object.entries(this.headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
              });
            }
    
            xhr.send(JSON.stringify(this.body));
          } catch (error) {
            this.cb(error);
          }
    }
    
}

//* UI ELEMENTS

const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const categorySelect = form.elements['category']
const searchInput = form.elements['search'];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
})

document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    loadNews()
  });


  const newsService = (function (){
    
    const apiUrl = 'https://newsapi.org/v2';
    const apiKey = 'ff95b6e4589740cea5ffe89360375f5e';
  
    return{
      topHeadLines(country = 'us',category,cb){
        const top = new CustomHttp(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,cb)
        top.get()
      },
      everything(query, cb){
        const every = new CustomHttp(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,cb)
        every.get()
      }
    }
  })()

  function loadNews(){
    showLoader()
    const search = searchInput.value;
    const country = countrySelect.value;
    const category = categorySelect.value;
  
    if(!search){
      newsService.topHeadLines(country,category,onGetResponse)
  
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