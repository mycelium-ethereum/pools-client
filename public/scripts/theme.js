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
        console.error(new Error('Accessing theme has been denied'));
    }
})();

function takePill (color) {
    const html = document.getElementsByTagName('html')[0];
    if (color === 'red') {
        const storedTheme = localStorage.getItem('theme')
        if (storedTheme === 'matrix') {
            console.log("You've already entered the rabbit hole")
        } else {
            console.log('There is no turning back')
            html.classList.add('theme-matrix')
            html.classList.remove('theme-dark');
            localStorage.setItem('theme', 'theme-matrix');
        }
    } else if (color === 'blue') {
        html.classList.remove('theme-matrix');
        localStorage.removeItem('theme');
    } else {
        console.log("This is your last chance. After this there is no turning back. You take the blue pill, the story ends; you wake up in your bed and believe whatever you want to believe.")
        console.log('You take the red pill, you stay in Wonderland and I show you how deep the rabbit hole goes')
    }
}
