// when clicked on the extension icon, it created a new tab (as extension) for index.html
chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: "../index.html" });
});
