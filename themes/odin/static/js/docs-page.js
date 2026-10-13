"use strict";

/* This site's documentation pages, such as the Overview

- a search of the page's sections, focused with `/`, Ctrl+K, or ⌘K
- a "copy link" button on the hovered heading
- keyboard shortcuts: `j` and `k` for the next and previous section, `l` to copy a link to the section
  being read, `?` to list them all (`[` and `]` for the sidebars are in js/docs.js)
- the sections being read, in a label under the menu bar
- a contents dropdown on narrow screens, where the contents sidebar is hidden
- names in the code and inline code linked to their documentation on pkg.odin-lang.org, and what each
  one is shown when it is hovered

The look is shared with pkg.odin-lang.org, through css/style.css. Loaded with `defer`. */

(() => {
	const PKG_URL = "https://pkg.odin-lang.org";

	const article = document.querySelector(".odin-site-docs .odin-article");
	if (!article) {
		return;
	}

	const is_mac   = document.documentElement.classList.contains("os-macos");
	const is_typing = ev => ev.target.closest && ev.target.closest("input, textarea, select, [contenteditable]");

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

	const flash_copied = btn => {
		const label = btn.dataset.label || btn.textContent;
		btn.dataset.label = label;
		btn.textContent = "copied";
		btn.classList.add("copied");
		clearTimeout(btn.copied_timer);
		btn.copied_timer = setTimeout(() => {
			btn.textContent = label;
			btn.classList.remove("copied");
		}, 1200);
	};

	let toast = null;
	const show_toast = text => {
		if (!toast) {
			toast = document.createElement("div");
			toast.className = "odin-toast";
			toast.setAttribute("role", "status");
			document.body.appendChild(toast);
		}
		toast.textContent = text;
		toast.classList.add("shown");
		clearTimeout(toast.timer);
		toast.timer = setTimeout(() => toast.classList.remove("shown"), 1600);
	};


	/* The sections: every heading with an id, and the headings it is within */

	const headings = [...article.querySelectorAll("h2[id], h3[id], h4[id], h5[id]")];

	// the heading's own text, without the `#` link and the "copy link" button added to it
	const heading_text = h => {
		let text = "";
		for (const node of h.childNodes) {
			if (node.nodeType === Node.ELEMENT_NODE && node.matches(".heading-anchor, .copy-link")) {
				continue;
			}
			text += node.textContent;
		}
		return text.trim();
	};

	const sections = [];
	{
		const parents = [];
		for (const h of headings) {
			const level = Number(h.tagName[1]);
			while (parents.length > 0 && parents[parents.length - 1].level >= level) {
				parents.pop();
			}
			const text = heading_text(h);
			const section = {
				heading:   h,
				id:        h.id,
				text,
				lower:     text.toLowerCase(),
				path:      parents.map(p => p.text).join(" › "),
				ancestors: parents.map(p => p.section),
				kind:      text.startsWith("@(") ? "attribute" : text.startsWith("#") ? "directive" : "section",
			};
			sections.push(section);
			parents.push({level, text, section});
		}
	}

	const section_url = section => location.origin + location.pathname + "#" + section.id;

	// where a heading scrolled to stops, below the menu bar and the section label (`scroll-margin-top`)
	const reading_line = () => sections.length > 0 ? parseFloat(getComputedStyle(sections[0].heading).scrollMarginTop) + 1 : 1;

	// the section being read: the last heading scrolled to or past
	const section_being_read = () => {
		const line = reading_line();
		let lo = 0, hi = sections.length;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (sections[mid].heading.getBoundingClientRect().top <= line) {
				lo = mid + 1;
			} else {
				hi = mid;
			}
		}
		return lo > 0 ? sections[lo - 1] : null;
	};


	/* the sections being read, under the menu bar, once their headings are scrolled past */

	const container = article.closest("article");
	if (sections.length > 0 && container) {
		const label = document.createElement("div");
		label.className = "odin-section-label";
		label.setAttribute("aria-hidden", "true");
		const span = label.appendChild(document.createElement("span"));
		container.prepend(label);

		// a heading's text and code, without its links and buttons
		const heading_nodes = h => {
			const nodes = [];
			for (const node of h.childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE && node.matches(".heading-anchor, .copy-link")) {
					continue;
				}
				if (node.nodeType === Node.ELEMENT_NODE && node.matches("code")) {
					const code = document.createElement("code");
					code.textContent = node.textContent;
					nodes.push(code);
				} else {
					nodes.push(document.createTextNode(node.textContent));
				}
			}
			const first = nodes[0], last = nodes[nodes.length - 1];
			if (first && first.nodeType === Node.TEXT_NODE) {
				first.nodeValue = first.nodeValue.trimStart();
			}
			if (last && last.nodeType === Node.TEXT_NODE) {
				last.nodeValue = last.nodeValue.trimEnd();
			}
			return nodes;
		};

		let shown_sections = [];
		let scheduled = false;
		const update = () => {
			scheduled = false;
			const current = section_being_read();
			const shown = current ? [...current.ancestors] : [];
			// the section itself once its heading is under the label
			if (current && current.heading.getBoundingClientRect().bottom <= label.getBoundingClientRect().top + span.offsetHeight) {
				shown.push(current);
			}
			label.classList.toggle("visible", shown.length > 0);
			if (shown.length === shown_sections.length && shown.every((s, i) => s === shown_sections[i])) {
				return;
			}
			shown_sections = shown;
			span.replaceChildren(...shown.flatMap((s, i) => i > 0 ? [" › ", ...heading_nodes(s.heading)] : heading_nodes(s.heading)));
		};
		window.addEventListener("scroll", () => {
			if (!scheduled) {
				scheduled = true;
				requestAnimationFrame(update);
			}
		}, {passive: true});
		update();
	}


	/* "copy link" on the hovered heading */

	const copy_link = document.createElement("button");
	copy_link.type        = "button";
	copy_link.className   = "copy-link";
	copy_link.textContent = "copy link";
	copy_link.title       = "Copy a link to this section";

	const place_copy_link = h => {
		if (h && copy_link.parentElement !== h) {
			h.appendChild(copy_link);
		}
	};
	article.addEventListener("mouseover", ev => place_copy_link(ev.target.closest && ev.target.closest("h2[id], h3[id], h4[id], h5[id]")));
	article.addEventListener("focusin", ev => {
		if (ev.target !== copy_link) {
			place_copy_link(ev.target.closest("h2[id], h3[id], h4[id], h5[id]"));
		}
	});
	copy_link.addEventListener("click", async () => {
		const h = copy_link.parentElement;
		await copy_text(location.origin + location.pathname + "#" + h.id);
		flash_copied(copy_link);
	});


	/* the search of the sections */

	const search  = document.getElementById("odin-search");
	const results = document.getElementById("odin-search-results");

	// a substring scores best, the earlier and the more of the text it is, then the letters in order
	const score = (lower, q) => {
		const i = lower.indexOf(q);
		if (i >= 0) {
			const at_word = i === 0 || /[^a-z0-9_]/.test(lower[i - 1]);
			return 1000 + (lower.length === q.length ? 500 : 0) + (at_word ? 200 : 0) - i - lower.length * 0.25;
		}
		let from = 0, gaps = 0;
		for (const ch of q) {
			if (ch === " ") {
				continue;
			}
			const j = lower.indexOf(ch, from);
			if (j < 0) {
				return -1;
			}
			gaps += j - from;
			from = j + 1;
		}
		// letters scattered across the whole text are not a match
		if (gaps > q.length * 2 + 4) {
			return -1;
		}
		return 100 - gaps - lower.length * 0.25;
	};

	const escape_html = s => s.replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);

	const highlight = (text, q) => {
		const i = text.toLowerCase().indexOf(q);
		if (i < 0) {
			return escape_html(text);
		}
		return escape_html(text.slice(0, i)) + "<b>" + escape_html(text.slice(i, i + q.length)) + "</b>" + escape_html(text.slice(i + q.length));
	};

	let shown = [];
	let selected = -1;

	const select = i => {
		const items = results.children;
		if (selected >= 0 && items[selected]) {
			items[selected].classList.remove("selected");
			items[selected].setAttribute("aria-selected", "false");
		}
		selected = i;
		if (selected >= 0 && items[selected]) {
			items[selected].classList.add("selected");
			items[selected].setAttribute("aria-selected", "true");
			items[selected].scrollIntoView({block: "nearest"});
			search.setAttribute("aria-activedescendant", items[selected].id);
		} else {
			search.removeAttribute("aria-activedescendant");
		}
	};

	const close_results = () => {
		results.hidden = true;
		search.setAttribute("aria-expanded", "false");
		select(-1);
	};

	const go_to = section => {
		close_results();
		search.blur();
		location.hash = "#" + section.id;
	};

	const update_results = () => {
		const q = search.value.trim().toLowerCase();
		results.innerHTML = "";
		selected = -1;
		if (q === "") {
			close_results();
			return;
		}
		shown = sections
			.map((s, order) => {
				let sc = score(s.lower, q);
				if (sc < 0 && s.path !== "") {
					// a match in the sections it is within counts for less
					sc = score((s.path + " " + s.lower).toLowerCase(), q);
					sc = sc < 0 ? -1 : sc - 300;
				}
				return {s, sc, order};
			})
			.filter(r => r.sc >= 0)
			.sort((a, b) => b.sc - a.sc || a.order - b.order)
			.slice(0, 30)
			.map(r => r.s);

		if (shown.length === 0) {
			const li = document.createElement("li");
			li.className = "odin-search-none";
			li.textContent = "No sections match";
			results.appendChild(li);
		}
		shown.forEach((s, i) => {
			const li = document.createElement("li");
			li.id = "odin-search-result-" + i;
			li.setAttribute("role", "option");
			li.setAttribute("aria-selected", "false");
			li.innerHTML =
				`<span class="kind kind-${s.kind}">${s.kind}</span>` +
				`<span class="odin-search-result"><a href="#${escape_html(s.id)}" tabindex="-1">${highlight(s.text, q)}</a>` +
				(s.path ? `<span class="odin-search-path">${escape_html(s.path)}</span>` : "") +
				`</span>`;
			// before the input's blur closes the results
			li.addEventListener("mousedown", ev => {
				ev.preventDefault();
				go_to(s);
			});
			results.appendChild(li);
		});
		results.hidden = false;
		search.setAttribute("aria-expanded", "true");
		select(shown.length > 0 ? 0 : -1);
	};

	if (search && results) {
		search.addEventListener("input", update_results);
		search.addEventListener("focus", () => {
			if (search.value.trim() !== "") {
				update_results();
			}
		});
		search.addEventListener("blur", () => setTimeout(close_results, 100));
		search.addEventListener("keydown", ev => {
			if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
				ev.preventDefault();
				if (shown.length > 0) {
					const step = ev.key === "ArrowDown" ? 1 : -1;
					select((selected + step + shown.length) % shown.length);
				}
			} else if (ev.key === "Enter") {
				ev.preventDefault();
				const s = shown[selected >= 0 ? selected : 0];
				if (s) {
					go_to(s);
				}
			} else if (ev.key === "Escape") {
				ev.preventDefault();
				if (search.value !== "") {
					search.value = "";
					close_results();
				} else {
					search.blur();
				}
			}
		});
	}

	const focus_search = () => {
		if (search) {
			search.focus();
			search.select();
		}
	};


	/* ? lists the keyboard shortcuts */

	let sheet = null;
	let sheet_return_focus = null;

	const close_shortcuts = () => {
		if (sheet && !sheet.hidden) {
			sheet.hidden = true;
			if (sheet_return_focus) {
				sheet_return_focus.focus();
			}
		}
	};

	const open_shortcuts = () => {
		if (!sheet) {
			const rows = [
				[search ? (is_mac ? ["⌘", "K"] : ["Ctrl", "K"]) : null, "Search this page", ["/"]],
				[["j", "k"], "Next or previous section"],
				[["l"], "Copy a link to the section being read"],
				[["[", "]"], "Collapse or expand the sidebars"],
				[["?"], "Show these shortcuts"],
			];
			const keys = ks => ks.map(k => `<kbd>${escape_html(k)}</kbd>`).join(" ");
			const items = rows
				.filter(([ks]) => ks !== null)
				.map(([ks, what, alt]) => `<dt>${keys(ks)}${alt ? " or " + keys(alt) : ""}</dt><dd>${escape_html(what)}</dd>`)
				.join("");
			sheet = document.createElement("div");
			sheet.className = "odin-shortcuts";
			sheet.hidden = true;
			sheet.innerHTML = `<div class="odin-shortcuts-box" role="dialog" aria-modal="true" aria-labelledby="odin-shortcuts-title" tabindex="-1">
				<h2 id="odin-shortcuts-title">Keyboard shortcuts</h2>
				<dl>${items}</dl>
			</div>`;
			sheet.addEventListener("click", ev => {
				if (ev.target === sheet) {
					close_shortcuts();
				}
			});
			document.body.appendChild(sheet);
		}
		sheet_return_focus = document.activeElement;
		sheet.hidden = false;
		sheet.firstElementChild.focus();
	};

	document.addEventListener("click", ev => {
		if (ev.target.closest && ev.target.closest(".odin-shortcuts-button")) {
			ev.preventDefault();
			open_shortcuts();
		}
	});


	/* the keyboard shortcuts */

	window.addEventListener("keydown", async ev => {
		if (sheet && !sheet.hidden) {
			if (ev.key === "Escape" || ev.key === "?") {
				ev.preventDefault();
				close_shortcuts();
			}
			return;
		}
		if ((ev.ctrlKey || ev.metaKey) && !ev.altKey && ev.key.toLowerCase() === "k" && search) {
			ev.preventDefault();
			focus_search();
			return;
		}
		if (ev.ctrlKey || ev.metaKey || ev.altKey || is_typing(ev)) {
			return;
		}
		switch (ev.key) {
		case "/":
			if (search) {
				ev.preventDefault();
				focus_search();
			}
			break;
		case "?":
			ev.preventDefault();
			open_shortcuts();
			break;
		case "j":
		case "k": {
			if (sections.length === 0) {
				break;
			}
			ev.preventDefault();
			const current = section_being_read();
			let i = current ? sections.indexOf(current) : -1;
			if (ev.key === "j") {
				i = Math.min(i + 1, sections.length - 1);
			} else if (current && current.heading.getBoundingClientRect().top < reading_line() - 2) {
				// back to the start of the section being read
			} else {
				i = Math.max(i - 1, 0);
			}
			sections[i].heading.scrollIntoView({block: "start", behavior: "instant"});
			break;
		}
		case "l": {
			const current = section_being_read() || sections[0];
			if (!current) {
				break;
			}
			ev.preventDefault();
			await copy_text(section_url(current));
			show_toast(`Copied a link to “${current.text}”`);
			break;
		}
		}
	});


	/* the contents dropdown, on narrow screens */

	const mobile_toc = document.querySelector(".odin-mobile-toc");
	if (mobile_toc) {
		mobile_toc.addEventListener("click", ev => {
			if (ev.target.closest("a")) {
				mobile_toc.open = false;
			}
		});
	}


	/* names linked to their documentation on pkg.odin-lang.org

	Each name is checked against the package's pkg-data.js before it is linked, so a variable that
	happens to share a package's name, e.g. `c.x`, is left alone. Those are fetched once the page is
	idle, and only for the packages the page uses. */

	// the usual names of the packages, and any other names the page imports them under
	const aliases = new Map(Object.entries({
		fmt: "core:fmt", os: "core:os", mem: "core:mem", strings: "core:strings", slice: "core:slice",
		runtime: "base:runtime", intrinsics: "base:intrinsics", simd: "core:simd", x86: "core:simd/x86",
		math: "core:math", linalg: "core:math/linalg", utf8: "core:unicode/utf8", utf16: "core:unicode/utf16",
		glfw: "vendor:glfw", spall: "core:prof/spall", testing: "core:testing", reflect: "core:reflect",
		c: "core:c", libc: "core:c/libc", sync: "core:sync", chan: "core:sync/chan", thread: "core:thread",
		time: "core:time", log: "core:log", json: "core:encoding/json", filepath: "core:path/filepath",
	}));
	const BUILTIN = "base:builtin";

	const code_blocks = [...article.querySelectorAll("pre > code.language-odin")];

	const declared = new Set();
	for (const code of code_blocks) {
		const text = code.textContent;
		for (const m of text.matchAll(/^\s*import\s+(?:([A-Za-z_]\w*)\s+)?"((?:core|base|vendor):[\w/]+)"/gm)) {
			const name = m[1] || m[2].split(/[:/]/).pop();
			if (name !== "_") {
				aliases.set(name, m[2]);
			}
		}
		// a procedure the page declares itself, e.g. its own `sum`, is not linked as a builtin
		for (const m of text.matchAll(/([A-Za-z_]\w*)\s*::/g)) {
			declared.add(m[1]);
		}
	}

	// candidates: [text node, start, end, package, name, text, whether inline code]
	const candidates = [];
	// the builtins the code calls, e.g. `append(`
	const called = new Set();
	const SKIP = ".hljs-comment, .hljs-string, .hljs-meta, a";

	const collect_code = code => {
		const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			if (node.parentElement.closest(SKIP)) {
				continue;
			}
			const text = node.nodeValue;
			// a package's declaration, e.g. `fmt.println`
			for (const m of text.matchAll(/(?<![\w.$#@])([A-Za-z_]\w*)\.([A-Za-z_]\w*)/g)) {
				if (aliases.has(m[1])) {
					candidates.push([node, m.index, m.index + m[0].length, aliases.get(m[1]), m[2], m[0]]);
				}
			}
			// a builtin procedure called, e.g. `append(`; a token of its own, so look past it for the `(`
			for (const m of text.matchAll(/(?<![\w.$#@])([a-z_]\w*)\b/g)) {
				if (declared.has(m[1])) {
					continue;
				}
				const after = text.slice(m.index + m[0].length) || (node.parentElement !== code && node.parentElement.nextSibling ? node.parentElement.nextSibling.textContent : "");
				if (/^\s*\(/.test(after)) {
					candidates.push([node, m.index, m.index + m[0].length, BUILTIN, m[1], m[0]]);
					called.add(m[1]);
				}
			}
		}
	};

	// inline code which is a name and nothing else, e.g. `append`, `fmt.println`, `core:strings`
	const package_links = [];
	const collect_inline = code => {
		if (code.closest("pre, a, h1, h2, h3, h4, h5, h6, .odin-section-label") || code.childElementCount > 0) {
			return;
		}
		if (!code.firstChild || code.firstChild.nodeType !== Node.TEXT_NODE) {
			return;
		}
		const text = code.textContent.trim();
		let m;
		if ((m = /^"?((?:core|base|vendor):[\w/]+)"?$/.exec(text))) {
			package_links.push([code, m[1]]);
		} else if ((m = /^([A-Za-z_]\w*)\.([A-Za-z_]\w*)(\(\))?$/.exec(text)) && aliases.has(m[1])) {
			candidates.push([code.firstChild, 0, code.firstChild.nodeValue.length, aliases.get(m[1]), m[2], text]);
		} else if ((m = /^([a-z_]\w*)(\(\))?$/.exec(text)) && !declared.has(m[1])) {
			candidates.push([code.firstChild, 0, code.firstChild.nodeValue.length, BUILTIN, m[1], text, true]);
		}
	};

	const package_url = path => `${PKG_URL}/${path.replace(":", "/")}/`;

	// a package's declarations, from its pkg-data.js, which sets `odin_pkg_data`; one at a time, as they share it
	const loaded = new Map();
	let queue = Promise.resolve();
	const load_package = path => {
		if (!loaded.has(path)) {
			loaded.set(path, queue = queue.then(() => new Promise(resolve => {
				const script = document.createElement("script");
				script.src = package_url(path) + "pkg-data.js";
				script.onload = () => {
					// base:builtin's also has runtime's, for its `@(builtin)` procedures like `append`;
					// those of any package after the first are marked `also`
					const data = window.odin_pkg_data && window.odin_pkg_data.packages;
					const names = new Map();
					Object.values(data || {}).forEach((pkg, i) => {
						for (const e of pkg.entities || []) {
							if (!names.has(e.name)) {
								names.set(e.name, i === 0 ? e : {...e, also: true});
							}
						}
					});
					script.remove();
					resolve(names);
				};
				script.onerror = () => {
					script.remove();
					resolve(new Map());
				};
				document.head.appendChild(script);
			})));
		}
		return loaded.get(path);
	};

	const link_all = async () => {
		code_blocks.forEach(collect_code);
		article.querySelectorAll("code").forEach(collect_inline);

		// a package's page must exist, as the text also uses made up ones like `core:foo/bar`;
		// pkg.odin-lang.org allows any origin to ask
		const exists = new Map();
		await Promise.all([...new Set(package_links.map(([, path]) => path))].map(async path => {
			try {
				exists.set(path, (await fetch(package_url(path), {method: "HEAD"})).ok);
			} catch {
				exists.set(path, false);
			}
		}));
		for (const [code, path] of package_links) {
			if (!exists.get(path)) {
				continue;
			}
			const a = document.createElement("a");
			a.className = "pkg-link";
			a.href = package_url(path);
			a.title = `${path} on pkg.odin-lang.org`;
			code.replaceWith(a);
			a.appendChild(code);
		}

		const paths = [...new Set(candidates.map(c => c[3]))];
		const packages = new Map(await Promise.all(paths.map(async p => [p, await load_package(p)])));

		// each text node's from its end backwards, so splitting it leaves the earlier offsets valid
		const by_node = new Map();
		for (const c of candidates) {
			if (!by_node.has(c[0])) {
				by_node.set(c[0], []);
			}
			by_node.get(c[0]).push(c);
		}
		for (const [node, list] of by_node) {
			list.sort((a, b) => b[1] - a[1]);
			let limit = Infinity;
			for (const [, start, end, path, name, text, inline] of list) {
				const entity = packages.get(path).get(name);
				if (!entity || end > limit) {
					continue;
				}
				// only the builtins which are procedures, not types like `int`
				if (path === BUILTIN && !/^[bpg]$/.test(entity.kind)) {
					continue;
				}
				// and of runtime's, only those the code calls: the text also names others, like the
				// intrinsics `mem_copy` and `trap`, which runtime has procedures of its own named
				if (path === BUILTIN && entity.also && inline && !called.has(name)) {
					continue;
				}
				const range = document.createRange();
				range.setStart(node, start);
				range.setEnd(node, end);
				const a = document.createElement("a");
				a.className = "pkg-link";
				a.href = package_url(path) + "#" + name;
				// for what it is to show when it is hovered
				a.dataset.pkg   = path;
				a.dataset.name  = name;
				a.dataset.label = path === BUILTIN ? name : text.replace(/\(\)$/, "");
				a.dataset.kind  = entity.kind;
				a.dataset.about = entity.d || (entity.comment ? entity.comment.split("\n")[0] : "");
				range.surroundContents(a);
				limit = start;
			}
		}
	};

	/* hovering a linked name shows what it is, as pkg.odin-lang.org's own previews do: its summary, and
	its definition from the "signatures.json" beside its package's page there, which is fetched the first
	time one of that package's names is hovered; without it, just what kind of declaration it is */

	const KINDS = {c: "constant", v: "variable", t: "type", p: "procedure", g: "procedure group", b: "built-in"};

	const signatures = new Map();
	const signatures_of = path => {
		if (!signatures.has(path)) {
			signatures.set(path, fetch(package_url(path) + "signatures.json")
				.then(r => r.ok ? r.json() : null)
				.catch(() => null));
		}
		return signatures.get(path);
	};

	const preview_text = async a => {
		const {pkg, name, label, kind, about} = a.dataset;
		const found = await signatures_of(pkg);
		if (found && Object.hasOwn(found, name)) {
			return (about ? `// ${about}\n` : "") + found[name];
		}
		return `${label}  // ${KINDS[kind] || "declaration"}` + (about ? `\n// ${about}` : "");
	};

	let preview = null;
	let preview_for = null;
	let preview_timer = 0;

	const hide_preview = () => {
		clearTimeout(preview_timer);
		if (preview_for) {
			preview_for.removeAttribute("aria-describedby");
			preview_for = null;
		}
		if (preview) {
			preview.hidden = true;
		}
	};

	const show_preview = async a => {
		const text = await preview_text(a);
		if (preview_for !== a) {
			return;
		}
		if (!preview) {
			preview = document.createElement("div");
			preview.id = "odin-type-preview";
			// `documentation` gives it the box and colours of the code blocks
			preview.className = "odin-type-preview documentation";
			preview.setAttribute("role", "tooltip");
			preview.innerHTML = `<pre><code class="hljs language-odin"></code></pre>`;
			document.body.appendChild(preview);
		}
		const pre = preview.firstElementChild;
		pre.firstElementChild.innerHTML = window.hljs ? hljs.highlight(text, {language: "odin", ignoreIllegals: true}).value : escape_html(text);
		pre.style.maxHeight = "";
		preview.hidden = false;
		a.setAttribute("aria-describedby", preview.id);

		// wholly in view: below the menu bar, within the window, and no taller than it
		const navbar = document.querySelector(".odin-menu");
		const top = Math.max(0, navbar ? navbar.getBoundingClientRect().bottom : 0) + 8;
		const bottom = window.innerHeight - 8;
		if (preview.offsetHeight > bottom - top) {
			pre.style.maxHeight = (bottom - top) + "px";
		}
		pre.classList.toggle("cut-off", pre.scrollHeight > pre.clientHeight);

		// under the name, or above it when there is no room below
		const r = a.getBoundingClientRect();
		let x = r.left;
		let y = r.bottom + 6;
		if (y + preview.offsetHeight > bottom) {
			y = r.top - 6 - preview.offsetHeight;
		}
		x = Math.max(8, Math.min(x, document.documentElement.clientWidth - preview.offsetWidth - 8));
		y = Math.max(top, Math.min(y, bottom - preview.offsetHeight));
		preview.style.left = (window.scrollX + x) + "px";
		preview.style.top  = (window.scrollY + y) + "px";
	};

	// not on touch screens, where tapping a name just follows its link
	const can_hover = window.matchMedia("(hover: hover)");
	const previewed = ev => ev.target.closest && ev.target.closest("a.pkg-link[data-name]");
	document.addEventListener("mouseover", ev => {
		const a = previewed(ev);
		if (a && a !== preview_for && can_hover.matches) {
			hide_preview();
			preview_for = a;
			preview_timer = setTimeout(() => show_preview(a), 250);
		}
	});
	document.addEventListener("mouseout", ev => {
		const a = previewed(ev);
		if (a && !a.contains(ev.relatedTarget)) {
			hide_preview();
		}
	});
	document.addEventListener("focusin", ev => {
		const a = previewed(ev);
		if (a && a.matches(":focus-visible")) {
			hide_preview();
			preview_for = a;
			show_preview(a);
		}
	});
	document.addEventListener("focusout", ev => {
		if (previewed(ev)) {
			hide_preview();
		}
	});
	document.addEventListener("keydown", ev => {
		if (ev.key === "Escape") {
			hide_preview();
		}
	});
	// any scroll, the contents sidebar's included
	document.addEventListener("scroll", hide_preview, {passive: true, capture: true});

	const when_idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
	if (document.readyState === "complete") {
		when_idle(link_all);
	} else {
		window.addEventListener("load", () => when_idle(link_all));
	}
})();
