// Парсинг видео с HQPorner
function parseHQPornerVideo(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const videoElement = doc.querySelector('video');
                if (videoElement) {
                    const videoUrl = videoElement.querySelector('source').getAttribute('src');
                    resolve(videoUrl);
                } else {
                    reject('Видео не найдено');
                }
            })
            .catch(error => reject(error));
    });
}

// Поиск по тегам на HQPorner
function searchHQPornerByTag(tag) {
    return new Promise((resolve, reject) => {
        const searchUrl = `https://hqpornerxxx.com/tags/${encodeURIComponent(tag)}`;
        fetch(searchUrl)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const videoElements = doc.querySelectorAll('.video-item');
                const results = [];

                videoElements.forEach(element => {
                    const title = element.querySelector('.title').textContent.trim();
                    const url = element.querySelector('a').getAttribute('href');
                    const thumbnail = element.querySelector('img').getAttribute('src');
                    results.push({ title, url, thumbnail });
                });

                resolve(results);
            })
            .catch(error => reject(error));
    });
}

// Интеграция в метод play
function play(element) {
    if (element.source === 'hqporner') {
        parseHQPornerVideo(element.url)
            .then(videoUrl => {
                const video = {
                    title: element.name,
                    url: videoUrl,
                    quality: { 'default': videoUrl }
                };
                Lampa.Player.play(video);
            })
            .catch(error => {
                Lampa.Noty.show('Ошибка при загрузке видео: ' + error);
            });
    } else {
        // Остальная логика для других источников
    }
}

// Добавление поиска по тегам в меню
Api.menu(function(data) {
    data.push({
        title: 'Поиск по тегам (HQPorner)',
        onSelect: function() {
            Lampa.Input.edit({
                title: 'Введите тег',
                value: '',
                free: true,
                nosave: true
            }, function(tag) {
                if (tag) {
                    searchHQPornerByTag(tag)
                        .then(results => {
                            Lampa.Activity.push({
                                url: `https://hqpornerxxx.com/tags/${tag}`,
                                title: `Результаты поиска: ${tag}`,
                                component: 'sisi_view_' + Defined.use_api,
                                results: results,
                                page: 1
                            });
                        })
                        .catch(error => {
                            Lampa.Noty.show('Ошибка при поиске: ' + error);
                        });
                }
            });
        }
    });
    // Остальная логика для отображения меню
});