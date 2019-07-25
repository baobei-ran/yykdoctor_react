function set_font() {
    var html = document.getElementsByTagName('html')[0];
    var designFontSize = 100,
        designWidth = 750;
    function setFontSize() {
        var winWidth = document.documentElement.getBoundingClientRect().width;
        if (winWidth > designWidth) {
            winWidth = designWidth;
        }
        var fontSize = winWidth / designWidth * designFontSize;
        html.style.fontSize = fontSize + 'px';
    }
    setFontSize();
    window.addEventListener('resize', function () {
        setFontSize();
    });
    return this;
}
set_font();


