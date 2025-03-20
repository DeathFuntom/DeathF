// ==UserScript==
// @name         AnimeGO Provider for Lampa
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Интеграция animego.one в Lampa с поиском и выбором озвучки
// @author       Ваше имя
// @match        *://*/*lampa*  // URL, где работает Lampa
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Ждем полной загрузки Lampa
    const checkLampa = setInterval(() => {
        if (typeof Lampa !== 'undefined') {
            clearInterval(checkLampa);

            // Добавляем пункт меню
            Lampa.Menu.add('animego_provider', {
                title: 'AnimeGO', // Название пункта меню
                icon: 'https://animego.one/favicon.ico', // Иконка
                page: 'animego_page', // Страница для открытия
                priority: 3 // Позиция в меню (1-начало, 10-конец)
            });

            // Создаем страницу
            Lampa.Pages.add('animego_page', function () {
                return {
                    create() {
                        // Создаем интерфейс
                        this.container = $('<div>')
                            .addClass('animego-page')
                            .css({ padding: '20px', color: '#fff' })
                            .html(`
                                <h2 style="margin-bottom: 20px;">Поиск аниме</h2>
                                <input 
                                    type="text" 
                                    id="animego-search" 
                                    placeholder="Введите название..." 
                                    style="
                                        padding: 8px; 
                                        width: 80%; 
                                        margin-bottom: 15px;
                                        border: 1px solid #444;
                                        background: #222;
                                        color: #fff;
                                    "
                                />
                                <button 
                                    id="animego-search-btn" 
                                    style="
                                        padding: 8px 15px;
                                        background: #007bff;
                                        border: none;
                                        color: white;
                                        cursor: pointer;
                                    "
                                >Найти</button>
                                <div id="animego-results" style="margin-top: 20px;"></div>
                            `);

                        this.activity.body.append(this.container);

                        // Обработчик поиска
                        $('#animego-search-btn').on('click', () => {
                            const query = $('#animego-search').val().trim();
                            if (query) this.searchAnime(query);
                        });
                    },
                    searchAnime(query) {
                        // Очищаем предыдущие результаты
                        $('#animego-results').empty();

                        // Показываем индикатор загрузки
                        $('#animego-results').html('<p style="color: #ccc;">Загрузка...</p>');

                        // Выполняем запрос к API AnimeGO
                        fetch(`https://api.animego.one/search?query=${encodeURIComponent(query)}`)
                            .then(response => {
                                if (!response.ok) throw new Error('Ошибка сети');
                                return response.json();
                            })
                            .then(data => {
                                if (data.results && data.results.length > 0) {
                                    this.displayResults(data.results);
                                } else {
                                    $('#animego-results').html('<p style="color: #f00;">Ничего не найдено.</p>');
                                }
                            })
                            .catch(error => {
                                console.error('Ошибка при поиске:', error);
                                $('#animego-results').html('<p style="color: #f00;">Произошла ошибка при поиске.</p>');
                            });
                    },
                    displayResults(results) {
                        const resultsContainer = $('#animego-results').empty();

                        results.forEach(anime => {
                            const card = $(`
                                <div 
                                    class="animego-card" 
                                    style="
                                        display: inline-block;
                                        margin: 10px;
                                        width: 150px;
                                        text-align: center;
                                        cursor: pointer;
                                    "
                                >
                                    <img 
                                        src="${anime.poster}" 
                                        alt="${anime.title}" 
                                        style="
                                            width: 100%;
                                            height: auto;
                                            border-radius: 5px;
                                        "
                                    />
                                    <p style="margin-top: 5px; font-size: 14px; color: #fff;">${anime.title}</p>
                                </div>
                            `);

                            // Обработчик клика на карточку
                            card.on('click', () => {
                                this.openAnimeDetails(anime);
                            });

                            resultsContainer.append(card);
                        });
                    },
                    openAnimeDetails(anime) {
                        // Показываем детали аниме
                        const detailsPage = Lampa.Pages.add('animego_details', function () {
                            return {
                                create() {
                                    this.container = $('<div>')
                                        .css({ padding: '20px', color: '#fff' })
                                        .html(`
                                            <h2>${anime.title}</h2>
                                            <img 
                                                src="${anime.poster}" 
                                                alt="${anime.title}" 
                                                style="
                                                    width: 100%;
                                                    height: auto;
                                                    margin-bottom: 20px;
                                                    border-radius: 5px;
                                                "
                                            />
                                            <p>Выберите озвучку:</p>
                                            <div id="animego-dub-list"></div>
                                        `);

                                    this.activity.body.append(this.container);

                                    // Загружаем список озвучек
                                    this.loadDubList(anime.id);
                                },
                                loadDubList(animeId) {
                                    fetch(`https://api.animego.one/anime/${animeId}/dubs`)
                                        .then(response => {
                                            if (!response.ok) throw new Error('Ошибка сети');
                                            return response.json();
                                        })
                                        .then(data => {
                                            const dubList = $('#animego-dub-list').empty();

                                            if (data.dubs && data.dubs.length > 0) {
                                                data.dubs.forEach(dub => {
                                                    const dubItem = $(`
                                                        <div 
                                                            class="animego-dub-item" 
                                                            style="
                                                                padding: 10px;
                                                                margin: 5px 0;
                                                                background: #222;
                                                                border: 1px solid #444;
                                                                cursor: pointer;
                                                            "
                                                        >
                                                            ${dub.name}
                                                        </div>
                                                    `);

                                                    dubItem.on('click', () => {
                                                        this.openEpisodes(animeId, dub.id);
                                                    });

                                                    dubList.append(dubItem);
                                                });
                                            } else {
                                                dubList.html('<p style="color: #f00;">Озвучки не найдены.</p>');
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Ошибка при загрузке озвучек:', error);
                                            $('#animego-dub-list').html('<p style="color: #f00;">Произошла ошибка при загрузке озвучек.</p>');
                                        });
                                },
                                openEpisodes(animeId, dubId) {
                                    fetch(`https://api.animego.one/anime/${animeId}/episodes?dub=${dubId}`)
                                        .then(response => {
                                            if (!response.ok) throw new Error('Ошибка сети');
                                            return response.json();
                                        })
                                        .then(data => {
                                            const episodesPage = Lampa.Pages.add('animego_episodes', function () {
                                                return {
                                                    create() {
                                                        this.container = $('<div>')
                                                            .css({ padding: '20px', color: '#fff' })
                                                            .html('<h2>Список серий</h2>');

                                                        this.activity.body.append(this.container);

                                                        if (data.episodes && data.episodes.length > 0) {
                                                            data.episodes.forEach(episode => {
                                                                const episodeItem = $(`
                                                                    <div 
                                                                        class="animego-episode-item" 
                                                                        style="
                                                                            padding: 10px;
                                                                            margin: 5px 0;
                                                                            background: #222;
                                                                            border: 1px solid #444;
                                                                            cursor: pointer;
                                                                        "
                                                                    >
                                                                        Серия ${episode.number}
                                                                    </div>
                                                                `);

                                                                episodeItem.on('click', () => {
                                                                    Lampa.Player.play({
                                                                        title: `${anime.title} - Серия ${episode.number}`,
                                                                        url: episode.video_url,
                                                                        poster: anime.poster
                                                                    });
                                                                });

                                                                this.container.append(episodeItem);
                                                            });
                                                        } else {
                                                            this.container.append('<p style="color: #f00;">Серии не найдены.</p>');
                                                        }
                                                    }
                                                };
                                            });

                                            Lampa.Activity.push(episodesPage);
                                        })
                                        .catch(error => {
                                            console.error('Ошибка при загрузке серий:', error);
                                            alert('Произошла ошибка при загрузке серий.');
                                        });
                                }
                            };
                        });

                        Lampa.Activity.push(detailsPage);
                    }
                };
            });

            console.log('AnimeGO загружен!');
        }
    }, 500); // Проверяем каждые 0.5 секунды
})();
