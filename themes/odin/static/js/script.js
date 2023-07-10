window.addEventListener('DOMContentLoaded', () => {
	const observerForTableOfContentActiveState = new IntersectionObserver(entries => {
		for (let i = 0; i < entries.length; i += 1) {
      var entry = entries[i]
			const id = entry.target.getAttribute('id')

      if (entry.isIntersecting) {
				clearActiveStatesInTableOfContents()				
				
        var anchor = document.querySelector(`nav li a[href="#${id}"]`)
				anchor.parentElement.classList.add('active')
				anchor.parentElement.scrollIntoView({ block: "nearest" })
			}
		}
	})		

	document.querySelectorAll('h1[id],h2[id],h3[id],h4[id]').forEach((section) => {
		observerForTableOfContentActiveState.observe(section)
	})
})

function clearActiveStatesInTableOfContents() {
	document.querySelectorAll('nav li').forEach((section) => {
		section.classList.remove('active')
	})
}