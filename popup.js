document.addEventListener('DOMContentLoaded', function () {
    let input = document.querySelector('#duration');
    let filterBtn = document.querySelector('#filter-btn');
    let resetBtn = document.querySelector('#reset-btn');

    filterBtn.addEventListener('click', function (ev) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {minutes: input.value});
        });
    });


    resetBtn.addEventListener('click', function (ev) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'reset'})
        })
    });
});

