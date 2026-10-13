"use strict";

/* Documentation pages

Shared by the documentation pages of this site and by pkg.odin-lang.org, so both behave the same.
Load it in the <head> without `defer`, so that a collapsed sidebar is collapsed before the page is
drawn rather than flashing open. The styles are in css/style.css.

The two sidebars are named by their toggle's `data-sidebar`: "nav-sidebar" for the navigation on
the left, and "toc-sidebar" for the contents on the right. */

// called by the sidebars' toggles: <button class="odin-sidebar-toggle" data-sidebar="..." onclick="toggleSidebar(this)">
function toggleSidebar(button) {
	const name = button.dataset.sidebar;
	const collapsed = document.documentElement.classList.toggle(name + "-collapsed");
	button.setAttribute("aria-expanded", !collapsed);
	try {
		window.localStorage.setItem(name, collapsed ? "collapsed" : "expanded");
	} catch {
	}
}

(() => {
	// the operating system, as `os-windows`, `os-macos`, etc. on the <html>, e.g. for the search's
	// "⌘K" or "Ctrl+K", and to hide the keyboard shortcuts where there is no keyboard
	const user_agent = navigator.userAgent;
	for (const [look_for, name] of [["Win", "windows"], ["Mac", "macos"], ["X11", "unix"], ["Linux", "linux"], ["iPhone", "ios"], ["Android", "android"]]) {
		if (user_agent.includes(look_for)) {
			document.documentElement.classList.add(`os-${name}`);
		}
	}

	for (const name of ["nav-sidebar", "toc-sidebar"]) {
		try {
			if (window.localStorage.getItem(name) === "collapsed") {
				document.documentElement.classList.add(name + "-collapsed");
			}
		} catch {
		}
	}

	document.addEventListener("DOMContentLoaded", () => {
		for (const button of document.querySelectorAll(".odin-sidebar-toggle")) {
			const collapsed = document.documentElement.classList.contains(button.dataset.sidebar + "-collapsed");
			button.setAttribute("aria-expanded", !collapsed);
		}

		// keep the current page in view in a long navigation sidebar
		const list = document.querySelector(".odin-sidebar .odin-sidebar-content");
		const active = list && list.querySelector("a.active");
		if (active && list.scrollHeight > list.clientHeight) {
			const top = active.getBoundingClientRect().top - list.getBoundingClientRect().top;
			if (top < 0 || top > list.clientHeight - active.offsetHeight) {
				list.scrollTop += top - list.clientHeight/2;
			}
		}
	});

	// [ and ] collapse or expand the navigation and contents sidebars
	window.addEventListener("keydown", ev => {
		if (ev.ctrlKey || ev.metaKey || ev.altKey || (ev.key !== "[" && ev.key !== "]")) {
			return;
		}
		if (ev.target.closest && ev.target.closest("input, textarea, select, [contenteditable]")) {
			return;
		}
		const button = document.querySelector(`.odin-sidebar-toggle[data-sidebar="${ev.key === "[" ? "nav-sidebar" : "toc-sidebar"}"]`);
		if (button && button.offsetParent !== null) {
			ev.preventDefault();
			toggleSidebar(button);
		}
	});

	const copy_text = async text => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			const area = document.createElement("textarea");
			area.value = text;
			area.style.position = "fixed";
			area.style.opacity = "0";
			document.body.appendChild(area);
			area.select();
			try {
				document.execCommand("copy");
			} catch {
			}
			area.remove();
		}
	};

	// a "Copy" button on every code block
	document.addEventListener("DOMContentLoaded", () => {
		document.querySelectorAll(".documentation pre").forEach(pre => {
			if (pre.querySelector(".copy-code")) {
				return;
			}
			const btn = document.createElement("button");
			btn.type        = "button";
			btn.className   = "copy-code";
			btn.textContent = "Copy";
			btn.setAttribute("aria-label", "Copy code to clipboard");
			btn.addEventListener("click", async () => {
				const code = pre.querySelector("code") || pre;
				// pkg.odin-lang.org's signatures put each line in a `.line-text`
				const lines = code.querySelectorAll(".line-text");
				btn.hidden = true;
				const text = (
					lines.length
						? Array.from(lines, line => line.textContent).join("\n")
						: code.innerText
				).replace(/\s+$/, "");
				btn.hidden = false;
				await copy_text(text);
				btn.textContent = "Copied";
				setTimeout(() => (btn.textContent = "Copy"), 1200);
			});
			pre.appendChild(btn);
		});
	});
})();
