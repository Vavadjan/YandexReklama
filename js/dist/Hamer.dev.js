"use strict";

var _hammer = _interopRequireDefault(require("hammer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Импортируем библиотеку Hammer.js
// Получаем элемент, на который будем навешивать слушателя жестов (например, ваш контейнер страницы)
var container = document.getElementById('body'); // Инициализируем Hammer.js на этом элементе

var hammertime = new _hammer["default"](body); // Обработчик жеста свайп влево (для перехода на следующую страницу)

hammertime.on('swipeleft', function (ev) {// Здесь можно выполнить переход на следующую страницу
  // Например, изменить `window.location` на URL следующей страницы
}); // Обработчик жеста свайп вправо (для перехода на предыдущую страницу)

hammertime.on('swiperight', function (ev) {// Здесь можно выполнить переход на предыдущую страницу
  // Например, изменить `window.location` на URL предыдущей страницы
});