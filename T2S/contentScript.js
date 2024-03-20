//onMsg
chrome.runtime.onMessage.addListener(function (apiUrl) {
  console.log(apiUrl);
  x = document.createElement("AUDIO");
  x.autoplay = true;
  x.src = apiUrl;
});
