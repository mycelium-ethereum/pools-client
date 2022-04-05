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

// eslint-disable-next-line
function takePill(color) {
    const html = document.getElementsByTagName('html')[0];
    if (color === 'red') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'matrix') {
            console.log("You've already entered the rabbit hole");
        } else {
            console.log('There is no turning back');
            html.classList.add('theme-matrix');
            html.classList.remove('theme-dark');
            localStorage.setItem('theme', 'matrix');
        }
    } else if (color === 'blue') {
        html.classList.remove('theme-matrix');
        localStorage.removeItem('theme');
    } else {
        console.log(
            'This is your last chance. After this there is no turning back. You take the blue pill, the story ends; you wake up in your bed and believe whatever you want to believe.',
        );
        console.log('You take the red pill, you stay in Wonderland and I show you how deep the rabbit hole goes');
    }
}
