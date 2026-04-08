// 輔助函式：用來隨機產生指定數量 (min 到 max) 的 a-z 小寫英文字母
function generateRandomChars(min, max) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    // 決定這次要產生幾個字元
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    
    for (let i = 0; i < length; i++) {
        // 隨機挑選 0~25 的索引值
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        result += alphabet[randomIndex];
    }
    return result;
}

// 2. 網頁載入完成時 (window.onload)
window.onload = function() {
    const container = document.getElementById("container");
    // 在 container 中亂數產生 0 到 2 個字元的字串
    container.textContent = generateRandomChars(0, 2);
};

// 新增字元的函式 (對應投影片的 add_new_chars)
function add_new_chars() {
    // 回傳 1 到 3 個隨機字元
    return generateRandomChars(1, 3);
}

// 4. 監聽鍵盤彈起事件 (keyup)
window.addEventListener("keyup", function(e) {
    const container = document.getElementById("container");
    let currentText = container.textContent;

    console.log("你按下的按鍵是: " + e.key);

    // 3. 檢查打入的字元是否和第一個字相等
    // 確保 currentText 有東西，且按下的鍵等於字串的第一個字 (索引為 0)
    if (currentText.length > 0 && e.key === currentText.charAt(0)) {
        // 消除該字元！(擷取從索引 1 開始到最後的字串，等於捨棄了第 0 個字元)
        currentText = currentText.substring(1);
    }

    // 將亂數產生的 1 到 3 個字元接在字串後面
    currentText += add_new_chars();

    // 更新畫面上的字串
    container.textContent = currentText;
});