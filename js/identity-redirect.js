// JavaScript für Identity Redirect

// Definiere globale Redirect-Funktion für Tests
window.redirectAfterLogin = function(user) {
    // Beispiel-Redirect nach erfolgreichem Login
    if(user) {
        window.location.href = 'account.html';
    }
};

// Netlify Identity Event-Handler zur Weiterleitung
if (window.netlifyIdentity) {
    window.netlifyIdentity.on('login', (user) => {
        window.redirectAfterLogin(user);
    });
    window.netlifyIdentity.on('logout', () => {
        window.location.href = 'index.html';
    });
}
