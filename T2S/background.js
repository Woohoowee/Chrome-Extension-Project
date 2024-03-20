chrome.contextMenus.create({
  id: "en-us",
  title: "TTS-English-US",
  contexts: ["selection"],
});
chrome.contextMenus.create({
  id: "ja-jp",
  title: "TTS-Japan",
  contexts: ["selection"],
});
chrome.contextMenus.create({
  id: "zh-hk",
  title: "TTS-Chinese (Hong Kong)",
  contexts: ["selection"],
});
chrome.contextMenus.create({
  id: "ko-kr",
  title: "TTS-Korean",
  contexts: ["selection"],
});
chrome.contextMenus.create({
  id: "es-es",
  title: "TTS-Spanish (Spain)",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener((info) => {
  let sltText = encodeURIComponent(info.selectionText);
  let url = `http://api.voicerss.org/?key=abe36672d92945aa80e54976f5a8efc3&hl=${info.menuItemId}&src=${sltText}`;
  //sendMsg
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, url);
  })();
});
