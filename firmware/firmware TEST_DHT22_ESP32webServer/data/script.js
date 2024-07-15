document.addEventListener("DOMContentLoaded", function() {
    const modeToggle = document.getElementById("mode-toggle");
    const temperatureSpan = document.getElementById("temperature");
    const humiditySpan = document.getElementById("humidity");
    const menuToggle = document.getElementById("menu-toggle");
    const contentSection = document.querySelector("section.content");

    function setMode(mode) {
        document.body.classList.remove("light-mode", "dark-mode");
        document.body.classList.add(mode);
        contentSection.classList.remove("light-mode", "dark-mode");
        contentSection.classList.add(mode);
        localStorage.setItem("mode", mode);
        modeToggle.textContent = mode === "dark-mode" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro";
    }

    const savedMode = localStorage.getItem("mode") || "light-mode";
    setMode(savedMode);

    modeToggle.addEventListener("click", function() {
        const currentMode = document.body.classList.contains("dark-mode") ? "dark-mode" : "light-mode";
        const newMode = currentMode === "dark-mode" ? "light-mode" : "dark-mode";
        setMode(newMode);
    });

    async function fetchSensorData() {
        try {
            const response = await fetch("/dht22");
            const data = await response.json();
            temperatureSpan.textContent = data.temperature.toFixed(2);
            humiditySpan.textContent = data.humidity.toFixed(2);
        } catch (error) {
            console.error("Error al obtener los datos del sensor:", error);
        }
    }

    setInterval(fetchSensorData, 2000);
    fetchSensorData();

    menuToggle.addEventListener("change", function() {
        const menu = document.querySelector("nav ul");
        menu.classList.toggle("active", menuToggle.checked);
    });
});
