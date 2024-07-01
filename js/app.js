let widgetActivated = false;
function initRangeInputCustomStyle() {
	const elements = document.querySelectorAll("input[type='range']");
	const recalcProgress = throttle((elem) => {
		const minValue = +elem.getAttribute("min");
		const maxValue = +elem.getAttribute("max");
		const currentValue = elem.value;
		const progress = (currentValue - minValue) / (maxValue - minValue) * 100;
		elem.style.setProperty("--progress", `${progress}%`);
	}, 25);
	const inputHandler = (event) => {
		recalcProgress(event.currentTarget);
	};
	elements.forEach(elem => {
		elem.addEventListener("input", inputHandler);
		recalcProgress(elem);
	});
}
document.addEventListener("DOMContentLoaded", init);

function init() {
	initRangeInputCustomStyle();
	initPlayer();
	initMenu();
}

function Widget() {
	this.pointerType = "pointer";
	this.elem = document.getElementById('audiovidget');
	this.recalc = false;
	const pointerMoveHandler = throttle(({ clientX, clientY, buttons }) => {
		if ((buttons & 1) === 0) {
			return stopListening();
		};
		this.destPosition = { left: clientX - this.offset.left, top: clientY - this.offset.top };
		this.recalcPosition();
	}, 30);
	const pointerUpHandler = ({ clientX, clientY }) => {
		this.destPosition = { left: clientX - this.offset.left, top: clientY - this.offset.top };
		this.recalcPosition();
		stopListening();
	};
	const stopListening = () => {
		document.removeEventListener(`${this.pointerType}move`, pointerMoveHandler);
		document.removeEventListener(`${this.pointerType}up`, pointerUpHandler);
	}
	const resizeHandler = throttle(() => {
		const bcr = this.getBCR();
		if (bcr.left < 0 || bcr.top < 0 || bcr.right > document.body.clientWidth || bcr.bottom > window.innerHeight) {
			this.destPosition = { left: bcr.left.clamp(20, document.body.clientWidth - bcr.width - 20), top: bcr.top.clamp(20, window.innerHeight - bcr.height - 20) };
			this.recalcPosition();
		}
	}, 30);

	window.addEventListener("resize", resizeHandler);

	this.elem.addEventListener(`${this.pointerType}down`, (event) => {
		const { clientX, clientY } = event;
		this.pointerDownPosition = { left: clientX, top: clientY };
		const bcr = this.getBCR();
		this.offset = { left: clientX - bcr.left, top: clientY - bcr.top };
		document.addEventListener(`${this.pointerType}move`, pointerMoveHandler);
		document.addEventListener(`${this.pointerType}up`, pointerUpHandler);
	});
};
Widget.prototype.getBCR = function () {
	return this.elem.getBoundingClientRect();
}
Widget.prototype.recalcPosition = function () {
	const maxForceDistance = 100;
	const maxForce = 20;
	if (this.recalc) return;
	this.recalc = true;
	const recalcAxis = (bcr, axis) => {
		const diff = this.destPosition[axis] - bcr[axis];
		const rawRate = diff / maxForceDistance;
		const rate =  rawRate < 0 ? Math.max(rawRate, -1) : Math.min(rawRate, 1);
		const rawValue = bcr[axis] + maxForce * rawRate;
		const newValue = diff < 0 ? Math.max(rawValue, this.destPosition[axis]) : Math.min(rawValue, this.destPosition[axis]);
		this.elem.style.setProperty(`--${axis}`, `${newValue}px`);
	}
	const next = () => {
		const bcr = this.getBCR();
		if (bcr.left === this.destPosition.left && bcr.top === this.destPosition.top) {
			return this.recalc = false;
		}
		recalcAxis(bcr, "left");
		recalcAxis(bcr, "top");
		requestAnimationFrame(next);
	}
	requestAnimationFrame(next);
}

function initPlayer() {
	const audioPlayer = document.getElementById('audioPlayer');
	const progressBar = document.getElementById('player-progress-bar');
	const playerTimer = document.getElementById('player-timer');
	const widget = new Widget();
	const playButton = document.getElementById('audiovidget-rightside-play-button');
	const pauseButton = document.getElementById('audiovidget-rightside-pause-button');
	const playBigButton = document.getElementById('audiovidget-play-button');
	const pauseBigButton = document.getElementById('audiovidget-pause-button');
	let seeking = false;

	audioPlayer.addEventListener("timeupdate", () => {
		if (audioPlayer.paused || seeking || isNaN(audioPlayer.duration)) return;
		playerTimer.textContent = formatSeconds(audioPlayer.currentTime);
		progressBar.value = audioPlayer.currentTime / audioPlayer.duration * 100;
		const event = new Event("input");
		event.__timeupdate = true;
		progressBar.dispatchEvent(event);
	});

	// Seek control
	const debouncedSeeking = debounce(() => {
		audioPlayer.currentTime = audioPlayer.duration * progressBar.value / 100;
		play();

	}, 100);
	progressBar.addEventListener("input", (event) => {
		if (event.__timeupdate || isNaN(audioPlayer.duration)) return;
		if (!audioPlayer.paused) {
			pause();
		}
		debouncedSeeking();
	});

	playButton.addEventListener('click', function () {
		play();
	});

	pauseButton.addEventListener('click', function () {
		pause();
	});

	playBigButton.addEventListener('click', function () {
		play();
	});

	pauseBigButton.addEventListener('click', function () {
		pause();
	});

	if (audioPlayer.paused) {
			pauseButton.style.display = 'none';
			playButton.style.display = 'block';
			playBigButton.style.display = 'block';
			pauseBigButton.style.display = 'none';
	} else {
			playButton.style.display = 'none';
			pauseButton.style.display = 'block';
			playBigButton.style.display = 'none';
			pauseBigButton.style.display = 'block';
	}

	function play() {
		widgetActivated = true;
		audioPlayer.play();
		playButton.style.display = 'none';
		pauseButton.style.display = 'block';
		playBigButton.style.display = 'none';
		pauseBigButton.style.display = 'block';
	}
	function pause() {
		audioPlayer.pause();
		pauseButton.style.display = 'none';
		playButton.style.display = 'block';
		playBigButton.style.display = 'block';
		pauseBigButton.style.display = 'none';
	}
}
function formatSeconds(sec) {
	const hours = sec / 3600 ^ 0;
	const minutes = sec % 3600 / 60 ^ 0;
	const seconds = sec % 3600 % 60 ^ 0;
	const withoutHours = `${formatTimePart(minutes)}:${formatTimePart(seconds)}`;
	return hours > 0 ? `${formatTimePart(hours)}:${withoutHours}` : withoutHours;
}
function formatTimePart(value) {
	return value < 10 ? `0${value}` : value;
}
function initMenu() {
	const menuBtnElem = document.getElementById("menu-btn");
	const elem = document.getElementById("menu");
	elem.addEventListener("click", (event) => {
		if (event.target.tagName === "A") {
			elem.classList.remove("active");
			menuBtnElem.classList.remove("active");
		}
	});
	document.addEventListener("click", (event) => {
		if (!event.target.closest(".menu") && !event.target.classList.contains("menu-btn") && !event.target.closest(".menu-btn")) {
			elem.classList.remove("active");
			menuBtnElem.classList.remove("active");
		}
	});
}