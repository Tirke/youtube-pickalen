(function () {
    const VIDEO_TIME_ELEM = 'span.video-time';
    const PARENT_DIV_CLASS = 'yt-shelf-grid-item';
    let filteredItems = [];

    function hideLongerThan(time) {
        [...document.querySelectorAll(VIDEO_TIME_ELEM)].forEach(elem => {
            const totalTime = computeTotalTime(elem);

            if (totalTime > time) {
                let video = filterUntilShelf(elem);
                filteredItems.push(video);
                video.style.display = 'none';
            }
        });
    }

    function hideShorterThan(time) {
        [...document.querySelectorAll(VIDEO_TIME_ELEM)].forEach(elem => {
            const totalTime = computeTotalTime(elem);

            if (totalTime < time) {
                let video = filterUntilShelf(elem);
                filteredItems.push(video);
                video.style.display = 'none';
            }
        });
    }

    function hideBetween(minTime, maxTime) {
        [...document.querySelectorAll(VIDEO_TIME_ELEM)].forEach(elem => {
            const totalTime = computeTotalTime(elem);

            if (totalTime > maxTime || totalTime < minTime) {
                let video = filterUntilShelf(elem);
                filteredItems.push(video);
                video.style.display = 'none';
            }
        });
    }

    function computeTotalTime(videoTimeElement) {
        const videoTime = videoTimeElement.textContent.split(':').map(Number);
        let totalMinutes = 0;

        if (videoTime.length === 3) {
            totalMinutes += (videoTime[0] * 60) + videoTime[1];
        } else {
            totalMinutes += videoTime[0]
        }

        return totalMinutes;
    }

    function filterUntilShelf(elem) {
        let i = 0; // To prevent infinite looping if className changes

        while (!(elem.parentNode.className.includes(PARENT_DIV_CLASS)) && i < 6) {
            elem = elem.parentNode
        }

        return elem.parentNode;
    }


    function showVideosAgain() {
        filteredItems.forEach(function (video) {
            video.style.display = 'inline-block';
        });

        filteredItems = [];
    }

    chrome.runtime.sendMessage({action: 'showPageAction'});

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

        if (msg.bmax && msg.bmin) {
            showVideosAgain();
            hideBetween(msg.bmin, msg.bmax);
        } else if (msg.max) {
            showVideosAgain();
            hideLongerThan(msg.max);
        } else if (msg.min) {
            showVideosAgain();
            hideShorterThan(msg.min);
        }

        if (msg.action && msg.action === 'reset') {
            showVideosAgain()
        }
    });
})();

