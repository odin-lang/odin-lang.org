document.addEventListener("scroll", () => {
    const home_hero_header = document.getElementById("home-hero-header");
    const navbar_logo = document.getElementById("navbar-logo");
    if(!navbar_logo || !home_hero_header) {
        return;
    }
    // Fade in the nav logo when the user scrolls past the home header.
    // We add a little offset, so it feels more natural.
    if(home_hero_header.getBoundingClientRect().bottom <= 60) {
        navbar_logo.classList.add("fade-in-navbar-logo");
        navbar_logo.classList.remove("d-none");
    } else {
        navbar_logo.classList.add("d-none");
        navbar_logo.classList.remove("fade-in-navbar-logo");
    }
});