// ==UserScript==
// @name         AnimeGO Provider for Lampa
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Интеграция animego.one в Lampa с поиском, фильтрацией и выбором озвучки
// @author       Ваше имя
// @match        *://*/*lampa*  // URL, где работает Lampa
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Проверка, загружена ли Lampa
    if (typeof Lampa !== 'undefined') {
        // Добавление пункта меню "AnimeGO"
        Lampa.Menu.add('animego', {
            title: 'AnimeGO', // Название пункта меню
            icon: 'https://animego.one/favicon.ico', // Иконка для меню
            page: 'animego_page' // Страница, которая будет открываться
        });

        console.log('AnimeGO добавлен в главное меню!');

        // Создание страницы для AnimeGO
        Lampa.Pages.add('animego_page', function () {
            return {
                create() {
                    // Создаем HTML-структуру страницы
                    this.create_block = $('<div>').addClass('animego-page').html(`
                        <h1>Добро пожаловать в AnimeGO</h1>
                        <p>Здесь вы можете искать аниме, выбирать озвучку и смотреть эпизоды.</p>
                        <input type="text" id="animego-search" placeholder="Поиск аниме..." />
                        <button id="animego-search-btn">Найти</button>
                        <div id="animego-results"></div>
                    `);

                    // Добавляем блок на страницу
                    this.activity.body.append(this.create_block);

                    // Обработчик кнопки поиска
                    $('#animego-search-btn').on('click', () => {
                        const query = $('#animego-search').val();
                        if (query) {
                            this.searchAnime(query);
                        }
                    });
                },
                searchAnime(query) {
                    // Выполняем поиск аниме через API animego.one
                    fetch(`https://animego.one/api/search?query=${encodeURIComponent(query)}`)
                        .then(response => response.json())
                        .then(data => {
                            // Формируем HTML для результатов поиска
                            const results = data.map(item => `
                                <div class="animego-item">
                                    <img src="${item.poster}" alt="${item.title}" />
                                    <h3>${item.title}</h3>
                                    <p>${item.genres.join(', ')}</p>
                                </div>
                            `).join('');

                            // Вставляем результаты на страницу
                            $('#animego-results').html(results);
                        })
                        .catch(error => {
                            console.error('Ошибка при поиске:', error);
                            $('#animego-results').html('<p>Произошла ошибка при поиске.</p>');
                        });
                }
            };
        });

        console.log('AnimeGO Page успешно создан!');
    } else {
        console.error('Lampa не найден! Убедитесь, что скрипт запущен в Lampa.');
    }
})();