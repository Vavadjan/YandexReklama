Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
const debounce = (callback, delay) => {
	let timeOut = null;

	return (...args) => {
		if(timeOut) {
			clearTimeout(timeOut);
			timeOut = null;
		}
		timeOut = setTimeout(() => {
			timeOut = null;
			callback(...args);
		}, delay);
	}
}
const throttle = (callback, delay, { noClosingCall } = {}) => {
	let timeOut = null, argsMemo;
	return (...args) => {
		if(timeOut) {
			if (noClosingCall) return;
			argsMemo = args;
		} else {
			callback(...args);
			timeOut = setTimeout(() => {
				if (argsMemo && !noClosingCall) {
					callback(...argsMemo);
					argsMemo = null;
				}
				timeOut = null;
			}, delay);
		}
	}
}
document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');
	const layer1 = document.querySelector('.layer1');
	const layer2 = document.querySelector('.layer2');
	const layer3 = document.querySelector('.layer3');

    
    const handler = (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

        layer1.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
        layer2.style.transform = `translate(${xAxis * 2}px, ${yAxis * 2}px)`;
        layer3.style.transform = `translate(${xAxis * 3}px, ${yAxis * 3}px)`;
    };
    const throttledHandler = throttle(handler, 50);
    body.addEventListener('mousemove', throttledHandler);
});