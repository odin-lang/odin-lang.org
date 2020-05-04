---
title: Downloads
---


## Tagged Releases

[GitHub Tagged Releases](https://github.com/odin-lang/Odin/releases)


## Nightly Builds

<div id="nightly-build-list">
	Retrieving nightly builds...
</div>


<script type="text/javascript">
	const json_url = 'https://f001.backblazeb2.com/file/odin-binaries/nightly.json';
	const res = fetch(json_url).then((res) => {
		return res.json()
	}).then((json) => {
		const keys = Object.keys(json.files).sort().reverse();

		var d = document.getElementById("nightly-build-list");
		d.innerHTML = "";

		for (const key of keys) {
			const file_data = json.files[key];

			var title = document.createElement('h4');
			title.appendChild(document.createTextNode(key));
			d.appendChild(title);

			var t = document.createElement('table');
			t.classList.add('nightly-table');
			d.appendChild(t);
			t.innerHTML = '<thead><tr><th>Filename</th><th>SHA1</th></tr></thead>';
			var body = document.createElement('tbody');
			t.appendChild(body);

			for (const build of file_data) {
				var row = document.createElement('tr');
				body.appendChild(row);

				var filename = document.createElement('td');
				filename.innerHTML = '<a href="'+build.url+'">' + build.name + '</a>';
				row.appendChild(filename);

				var hash = document.createElement('td');
				hash.innerHTML = build.sha1;
				row.appendChild(hash);
			}
		}
	});
</script>
