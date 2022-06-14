(function () {
    function changeTheme(inputTheme) {
        const html = document.getElementsByTagName('html')[0];
        if (inputTheme === 'matrix') {
            html.classList.add('theme-matrix');
        } else if (inputTheme === 'light') {
            // think this is unescessary but can keep it there to ensure its light
            html.classList.remove('theme-dark');
        } else {
            // else add theme dark this is default
            html.classList.add('theme-dark');
        }
    }

    try {
        const currentTheme = localStorage.getItem('theme');
        changeTheme(currentTheme);
    } catch (err) {
        console.error(new Error('Accessing theme has been denied'));
    }
})();
