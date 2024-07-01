"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var throttle = function throttle(callback, delay) {
  var timeOut = null,
      argsMemo;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (timeOut) {
      argsMemo = args;
    } else {
      callback.apply(void 0, args);
      timeOut = setTimeout(function () {
        if (argsMemo) {
          callback.apply(void 0, _toConsumableArray(argsMemo));
          argsMemo = null;
        }

        timeOut = null;
      }, delay);
    }
  };
};

document.addEventListener('DOMContentLoaded', function () {
  var body = document.querySelector('body');
  var layer1 = document.querySelector('.layer1');
  var layer2 = document.querySelector('.layer2');
  var layer3 = document.querySelector('.layer3');

  var handler = function handler(e) {
    var xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    var yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    layer1.style.transform = "translate(".concat(xAxis, "px, ").concat(yAxis, "px)");
    layer2.style.transform = "translate(".concat(xAxis * 2, "px, ").concat(yAxis * 2, "px)");
    layer3.style.transform = "translate(".concat(xAxis * 3, "px, ").concat(yAxis * 3, "px)");
  };

  var throttledHandler = throttle(handler, 50);
  body.addEventListener('mousemove', throttledHandler);
});