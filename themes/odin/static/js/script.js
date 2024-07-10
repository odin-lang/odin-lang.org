// scrollspy find any new heading intersection and set the active property
window.addEventListener('DOMContentLoaded', () => {
	const observerForTableOfContentActiveState = new IntersectionObserver(entries => {
		for (let i = 0; i < entries.length; i += 1) {
			var entry = entries[i];
			const id = entry.target.getAttribute('id');

			if (entry.isIntersecting) {
				clearActiveStatesInTableOfContents();
				
				var anchor = document.querySelector(`nav li a[href="#${id}"]`);
				anchor.parentElement.classList.add('active');
				anchor.parentElement.scrollIntoView({ block: "nearest" });
			}
		}
	})		

	document.querySelectorAll('h1[id],h2[id],h3[id],h4[id]').forEach((section) => {
		observerForTableOfContentActiveState.observe(section);
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


