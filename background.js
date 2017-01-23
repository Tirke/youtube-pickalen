chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
    }
});
