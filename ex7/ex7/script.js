var container = document.getElementById('container');

window.onload = function() {
  container.textContent = add_new_chars(3);
};

function add_new_chars(x, b = true) {
  var n = x;
  if (b) {
    n = Math.floor(Math.random() * x) + 1;
  }
  var str = '';
  for (let i = 0; i < n; i++) {
    str += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }
  return str;
}

var counter = 0;

window.addEventListener("keyup", function(e) {
  var firstone = container.textContent.substring(0, 1);

  if (e.key == firstone) {
    // ✅ correct — remove first character
    container.textContent = container.textContent.substring(1, container.textContent.length);
  } else {
    // ❌ wrong key — append wrong key typed
    container.textContent += e.key;

    if (counter++ >= 2) {           // 3rd consecutive mistake
      container.textContent += add_new_chars(6, false);  // exactly 6 extra chars
      counter = 0;
    }
  }

  // always add penalty chars after any wrong key
  container.textContent += add_new_chars(3);  // 1–3 random chars
});