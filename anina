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
                        // Заглушка для демонстрации
                        $('#animego-results').html(`
                            <div style="margin: 20px 0; padding: 15px; background: #1a1a1a;">
                                Здесь будут результаты поиска для: <b>${query}</b>
                            </div>
                        `);
                    }
                };
            });

            console.log('AnimeGO загружен!');
        }
    }, 500); // Проверяем каждые 0.5 секунды
})();
