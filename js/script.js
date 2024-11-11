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
})

