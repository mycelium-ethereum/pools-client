(function () {
    function changeTheme(inputTheme) {
        if (inputTheme === 'dark') {
            document.getElementsByTagName('html')[0].classList.add('theme-dark');
            localStorage.setItem('theme', inputTheme);
        } else if (inputTheme === 'matrix') {
            document.getElementsByTagName('html')[0].classList.add('theme-matrix');
            localStorage.setItem('theme', inputTheme);
        } // else unknown theme do nothing;
    }

    try {
        const currentTheme = localStorage.getItem('theme');
        changeTheme(currentTheme);
    } catch (err) {
        console.log(new Error('accessing theme has been denied'));
    }
})();
