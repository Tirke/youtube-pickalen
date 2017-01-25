document.addEventListener('DOMContentLoaded', function () {
    let max = document.querySelector('#max');
    let min = document.querySelector('#min');
    let bmin = document.querySelector('#bmin');
    let bmax = document.querySelector('#bmax');
    let filterBtn = document.querySelector('#filter-btn');
    let resetBtn = document.querySelector('#reset-btn');

    filterBtn.addEventListener('click', function (ev) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                max: max.value,
                min: min.value,
                bmin: bmin.value,
                bmax: bmax.value
            });
        });
    });


    resetBtn.addEventListener('click', function (ev) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'reset'})
        })
    });
});

