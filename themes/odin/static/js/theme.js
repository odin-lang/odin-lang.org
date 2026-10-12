"use strict";

/* Light and dark mode

Shared by this site and pkg.odin-lang.org. Load it as the first thing in the <body>, without
`defer`, so that the page is drawn in the right mode from the start. The navigation bar's button
calls `toggleDarkMode()`, and the mode is the `dark-mode` class on the <body>.

The mode follows the operating system's, even as that changes, unless it has been toggled to the
other one. That choice is remembered in localStorage as "theme" for only as long as it differs from
the operating system's, so it never pins a mode the operating system would have chosen anyway
(which is also what any "theme" either site stored before is treated as). */

(() => {
	const query = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
	const os_theme = () => (query && query.matches) ? "dark" : "light";

	const stored = () => {
		try {
			const theme = window.localStorage.getItem("theme");
			return theme === "dark" || theme === "light" ? theme : null;
		} catch {
			return null;
		}
	};
	const store = theme => {
		try {
			if (theme === null) {
				window.localStorage.removeItem("theme");
			} else {
				window.localStorage.setItem("theme", theme);
			}
		} catch {
		}
	};

	const apply = () => {
		let theme = stored();
		if (theme === os_theme()) {
			store(null);
			theme = null;
		}
		document.body.classList.toggle("dark-mode", (theme || os_theme()) === "dark");
	};

	// called by the navigation bar's button
	window.toggleDarkMode = () => {
		const theme = document.body.classList.contains("dark-mode") ? "light" : "dark";
		store(theme === os_theme() ? null : theme);
		document.body.classList.toggle("dark-mode", theme === "dark");
	};

	apply();

	if (query) {
		if (query.addEventListener) {
			query.addEventListener("change", apply);
		} else if (query.addListener) {
			query.addListener(apply);
		}
	}
	// a toggle in another tab or window
	window.addEventListener("storage", ev => {
		if (ev.key === "theme" || ev.key === null) {
			apply();
		}
	});
})();
