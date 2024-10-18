#ifndef LOGIN_HPP
#define LOGIN_HPP

#include <WebServer.h>
#include <FS.h>
#include <SPIFFS.h>

class LoginServer {
public:
    LoginServer(WebServer& server);

    void setupRoutes();
    void handleLogin();
    void handleRegister();
    void handleLogout();
    void handleIndex();
    bool isAuthenticated();

private:
    WebServer& server;
};

// Definiciones de funciones
LoginServer::LoginServer(WebServer& srv) : server(srv) {}

bool LoginServer::isAuthenticated() {
    if (server.hasHeader("Cookie")) {
        String cookie = server.header("Cookie");
        return cookie.indexOf("session=authenticated") != -1;
    }
    return false;
}

void LoginServer::handleLogin() {
    String username = server.arg("username");
    String password = server.arg("password");

    if (username == "admin" && password == "admin") {
        server.sendHeader("Set-Cookie", "session=authenticated; Max-Age=3600"); // Establece una cookie
        server.sendHeader("Location", "/"); // Redirige a la página principal
        server.send(302, "text/plain", "Redirecting to home...");
    } else {
        server.send(401, "text/html", "<html><body><h1>Login Failed</h1><a href='/login'>Try Again</a></body></html>");
    }
}

void LoginServer::handleRegister() {
    String username = server.arg("username");
    String password = server.arg("password");

    // Aquí podrías guardar los datos del usuario en una base de datos o archivo
    // Por simplicidad, no se está guardando nada en este ejemplo

    server.send(200, "text/html", "<html><body><h1>Registration Successful</h1><a href='/login'>Login Now</a></body></html>");
}

void LoginServer::handleLogout() {
    server.sendHeader("Set-Cookie", "session=; Max-Age=0"); // Elimina la cookie
    server.sendHeader("Location", "/login"); // Redirige a la página de login
    server.send(302, "text/plain", "Redirecting to login...");
}

void LoginServer::handleIndex() {
    if (!isAuthenticated()) {
        server.sendHeader("Location", "/login");
        server.send(302, "text/plain", "Redirecting to login...");
        return;
    }

    File file = SPIFFS.open("/index.html", "r");
    if (!file) {
        server.send(404, "text/plain", "File not found");
        return;
    }
    server.streamFile(file, "text/html");
    file.close();
}

void LoginServer::setupRoutes() {
    server.on("/", HTTP_GET, [this]() { handleIndex(); });

    server.on("/login", HTTP_GET, [this]() {
        File file = SPIFFS.open("/pages/login.html", "r");
        if (!file) {
            server.send(404, "text/plain", "File not found");
            return;
        }
        server.streamFile(file, "text/html");
        file.close();
    });

    server.on("/login", HTTP_POST, [this]() { handleLogin(); });
    server.on("/register", HTTP_POST, [this]() { handleRegister(); });
    server.on("/logout", HTTP_GET, [this]() { handleLogout(); });

    // Maneja los archivos estáticos (CSS y JS)
    server.on("/css/login.css", HTTP_GET, [this]() {
        File file = SPIFFS.open("/css/login.css", "r");
        if (!file) {
            server.send(404, "text/plain", "File not found");
            return;
        }
        server.streamFile(file, "text/css");
        file.close();
    });

    server.on("/js/login.js", HTTP_GET, [this]() {
        File file = SPIFFS.open("/js/login.js", "r");
        if (!file) {
            server.send(404, "text/plain", "File not found");
            return;
        }
        server.streamFile(file, "application/javascript");
        file.close();
    });
    

    // Maneja archivos no encontrados
    server.onNotFound([this]() {
        String path = server.uri();
        if (path.endsWith("/")) path += "index.html";

        if (SPIFFS.exists(path)) {
            File file = SPIFFS.open(path, "r");
            server.streamFile(file, "text/html");
            file.close();
        } else {
            server.send(404, "text/plain", "File not found");
        }
    });
}

#endif // LOGIN_HPP
