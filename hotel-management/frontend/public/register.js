document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Kayıt işlemi başarısız');
            }
            return response.json();
        })
        .then(data => {
            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Kayıt hatası:', error);
            alert('Kayıt yapılamadı: ' + error.message);
        });
    });
});
