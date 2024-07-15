document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('myButton');
    var text = document.getElementById('myText');

    button.addEventListener('click', function() {
        text.textContent = '¡Hola desde ESP32!';
    });
});
