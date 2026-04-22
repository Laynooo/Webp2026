const apiKey = 'ca370d51a054836007519a00ff4ce59e';

const imglist_Url =
  `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${apiKey}&per_page=10&format=json&nojsoncallback=1`;

function getimg() {
  fetch(imglist_Url, { method: 'GET' })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('getRecent 回傳:', data);

      const dataset = data.photos.photo;
      add_new_img(dataset);
    })
    .catch(err => {
      console.error(err);
      alert('取得 Flickr 清單失敗');
    });
}

async function add_new_img(dataset) {
  const gal = document.getElementById("gallery");
  gal.innerHTML = "";

  for (const item of dataset) {
    try {
      const img_Url =
        `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${apiKey}&photo_id=${item.id}&format=json&nojsoncallback=1`;

      const res = await fetch(img_Url, { method: 'GET' });
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      console.log('getSizes 回傳:', data);

      // sizes.size 是陣列，挑一個適合的尺寸
      const sizeList = data.sizes.size;

      // 優先找 Medium，找不到就取最後一個
      let chosen = sizeList.find(s => s.label === 'Medium');
      if (!chosen) {
        chosen = sizeList[sizeList.length - 1];
      }

      const img = document.createElement("img");
      img.setAttribute("src", chosen.source);
      img.setAttribute("alt", item.title || "flickr image");
      gal.appendChild(img);

    } catch (err) {
      console.error(`photo_id=${item.id} 取得圖片失敗`, err);
    }
  }
}