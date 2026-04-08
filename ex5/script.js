var count = 1;

// 生成按鈕的函式
function addfunction() {
    // 1. 創建一個新的 BUTTON 元素
    var btn = document.createElement("BUTTON");
    
    // 2. 設定按鈕文字與屬性
    btn.innerHTML = `CLICK ME (${count})`;
    btn.setAttribute("id", "btn_" + count++);
    btn.setAttribute("class", "btn btn-outline-danger m-1");

    // 3. 印出 log 方便除錯
    console.log(btn);

    // 4. 將按鈕加入到 body 中 (或指定的 container)
    document.body.appendChild(btn);
};

// 刪除按鈕的函式
function delfunction() {
    // 1. 根據 ID 找到最後一個產生的按鈕 (注意：--count 會先減 1 再回傳)
    if (count > 1) {
        var btn = document.getElementById("btn_" + --count);
        
        // 2. 印出 log
        console.log(btn);

        // 3. 從 body 中移除該元素
        document.body.removeChild(btn);
    } else {
        console.log("沒有按鈕可以刪除囉！");
    }
};