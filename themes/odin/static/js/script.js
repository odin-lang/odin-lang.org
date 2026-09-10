// scrollspy find any new heading intersection and set the active property
window.addEventListener('DOMContentLoaded', () => {
	const headers = [...document.querySelectorAll('h1[id],h2[id],h3[id],h4[id]')];
	const sectionVisibility = new Map();

	const navbarHeight = document.querySelector('.odin-menu').offsetHeight;
	const observerForTableOfContentActiveState = new IntersectionObserver(entries => {
		for (let i = 0; i < entries.length; i += 1) {
			const entry = entries[i];
			const id = entry.target.getAttribute('id');

			sectionVisibility.set(id, entry.isIntersecting);
		}

		/**
		 * Find the first visible section and set the corresponding anchor state to active.
		 * Otherwise, do nothing. This is the case when scrolling through long sections,
		 * where the section header is out of the viewport, but the next section header is not yet visible.
		 */
		for (const [sectionId, isVisible] of sectionVisibility) {
			if (isVisible) {
				clearActiveStatesInTableOfContents();
				const anchor = document.querySelector(`nav li a[href="#${sectionId}"]`);
				anchor.parentElement.classList.add('active');
				anchor.scrollIntoView({ block: "nearest" });

				break;
			}
		}
	}, { rootMargin: `${navbarHeight}px 0px 0px 0px`, threshold: 1.0 });

	headers.forEach(header => {
		sectionVisibility.set(header.getAttribute('id'), false);
		observerForTableOfContentActiveState.observe(header);
	});
})

// removes all active states
function clearActiveStatesInTableOfContents() {
	document.querySelectorAll('nav li').forEach((section) => {
		section.classList.remove('active');
	});
}

// add the bootstrap table class property for styling - could maybe just style tables custom
window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('table').forEach((table) => {
		// only non styled tables
		if (table.className === "") {
			table.classList.add("table", "table-striped");
		}
	})
});



// Randomly rotate the hero slogan with an animated swap.
(function () {
	const el     = document.querySelector('.slogan-rotator');
	const dataEl = document.getElementById('slogan-data');
	if (!el || !dataEl) {
		return;
	}

	let slogans;
	try {
		slogans = JSON.parse(dataEl.textContent);
		if (typeof slogans === 'string') {
			slogans = JSON.parse(slogans); // peel a second layer if double-encoded
		}
	} catch (e) {
		return;
	}
	if (!Array.isArray(slogans) || slogans.length < 2) {
		return;
	}

	const style = [
			[{transform:'translateX(0)',      opacity:1, filter:'blur(0)'},
			 {transform:'translateX(-1.4rem)',opacity:0, filter:'blur(6px)'}],
			[{transform:'translateX(1.4rem)', opacity:0, filter:'blur(6px)'},
			 {transform:'translateX(0)',      opacity:1, filter:'blur(0)'}],
	];
	const interval = Math.max(1000, parseInt(el.dataset.sloganInterval, 10) || 2200);

	// -1 if the server-rendered text isn't one of the pool entries.
	let i = slogans.indexOf(el.textContent.trim());
	let busy = false;

	// Shuffle bag: every slogan is drawn once per cycle before any repeats.
	let bag = [];
	let seeded = false;

	function fillBag() {
		bag = slogans.map(function (_, idx) { return idx; });
		for (let k = bag.length - 1; k > 0; k--) { // Fisher–Yates shuffle
			const j = Math.floor(Math.random() * (k + 1));
			const t = bag[k];
			bag[k] = bag[j];
			bag[j] = t;
		}
		if (!seeded) {
			seeded = true;
			if (i >= 0) {
				const at = bag.indexOf(i);
				if (at !== -1) {
					bag.splice(at, 1);
				}
			}
		} else if (bag.length > 1 && bag[bag.length - 1] === i) {
			const t = bag[bag.length - 1];
			bag[bag.length - 1] = bag[0];
			bag[0] = t;
		}
	}

	function nextIndex() {
		if (bag.length === 0) {
			fillBag();
		}
		return bag.pop();
	}

	function timing() {
		return {
			duration: 400,
			easing:   'cubic-bezier(.4,0,.2,1)',
			fill:     'both'
		};
	}
	async function swap() {
		if (busy || document.hidden) {
			// don't animate on a background tab
			return;
		}
		busy = true;
		const n = nextIndex();
		const pair = style;
		try {
			await el.animate(pair[0], timing()).finished;
			el.textContent = slogans[n];
			await el.animate(pair[1], timing()).finished;
			i = n;
		} catch (e) {
			// animation cancelled
		}
		busy = false;
	}

	setInterval(swap, interval);
})();