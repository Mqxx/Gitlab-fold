chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(tab.id, {
    file: "fold.js"
  });
  chrome.tabs.insertCSS(tab.id, {
    file: "style.css"
  });
});