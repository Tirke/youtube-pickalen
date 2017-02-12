(function () {
    const GRID_VIDEO = '.yt-shelf-grid-item';
    const LIST_VIDEO = 'ol.section-list>li';
    const PL_VIDEO = 'tr.pl-video';
    const VIDEO_TIME_ELEM = 'span.video-time';
    const PLAYLIST_VIDEO_TIME = '.timestamp span';

    const curry2 = f => x => y => f(x, y);

    const compose = ([f, ...fs]) => x =>
        f === undefined ? x : f(compose(fs)(x));

    const filter = curry2((f, xs) => xs.filter(f));

    const map = curry2((f, xs) => xs.map(f));

    const getVideos = _ => [GRID_VIDEO, LIST_VIDEO, PL_VIDEO].reduce((a, b) => {
        const videos = [...document.querySelectorAll(b)];
        if (videos.length && !a.length) return videos; // We check a.length bcof conflict between GRID and LIST
        return a;
    }, []);

    const getTimeElem = video => {
        return video.querySelector(VIDEO_TIME_ELEM) || video.querySelector(PLAYLIST_VIDEO_TIME);
    };

    const totalTime = (videoTimeElement) => {
        const videoTime = videoTimeElement.textContent.split(':').map(Number);
        let totalMinutes = 0;

        if (videoTime.length === 3) {
            totalMinutes += (videoTime[0] * 60) + videoTime[1];
        } else {
            totalMinutes += videoTime[0]
        }

        return totalMinutes;
    };

    const filterLongerThan = time => {
        return filter((video) => {
            const timeElem = getTimeElem(video);
            return timeElem === null ? true : totalTime(timeElem) > time;
        });
    };

    const filterShortThan = time => {
        return filter((video) => {
            const timeElem = getTimeElem(video);
            return timeElem === null ? true : totalTime(timeElem) < time;
        });
    };

    const filterBetween = (minTime, maxTime) => {
        return filter((video) => {
            const timeElem = getTimeElem(video);
            const time = totalTime(timeElem);
            return timeElem === null ? true : time > maxTime || time < minTime;
        });
    };

    const switchDisplay = video => video.classList.toggle('hideVideo');

    const showVideosAgain = _ => [...document.querySelectorAll('.hideVideo')].map(switchDisplay);

    chrome.runtime.sendMessage({action: 'showPageAction'});

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

        if (msg.bmax && msg.bmin) {
            showVideosAgain();
            compose([map(switchDisplay), filterBetween(msg.bmin, msg.bmax), getVideos])();
        } else if (msg.max) {
            showVideosAgain();
            compose([map(switchDisplay), filterLongerThan(msg.max), getVideos])();
        } else if (msg.min) {
            showVideosAgain();
            compose([map(switchDisplay), filterShortThan(msg.min), getVideos])();
        }

        if (msg.action && msg.action === 'reset') {
            showVideosAgain()
        }
    });
})();