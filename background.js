let isClicked = false;
chrome.browserAction.onClicked.addListener(function (tab) {
  isClicked = !isClicked;
  chrome.tabs.executeScript(tab.id, {
    code: isClicked === true ? 'isClicked = true;' : 'isClicked = false;'
  }, function () {
    chrome.tabs.executeScript(tab.id, {
      file: "fold.js"
    });
  });
  chrome.tabs.insertCSS(tab.id, {
    file: "style.css"
  });
});