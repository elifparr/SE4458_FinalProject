document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const navButtons = document.getElementById('navButtons');
    navButtons.innerHTML = '';  

    if (token) {
        const welcomeMessage = document.createElement('span');
        welcomeMessage.innerText = `Hoşgeldin, ${username}`;
        welcomeMessage.style.color = "white";
        welcomeMessage.style.marginRight = "10px";
        navButtons.appendChild(welcomeMessage);

        if (role === 'admin') {
            const addRoomButton = document.createElement('button');
            addRoomButton.innerText = 'Oda Ekle';
            addRoomButton.onclick = () => window.location.href = 'add-room.html';
            navButtons.appendChild(addRoomButton);
        }

        const logoutButton = document.createElement('button');
        logoutButton.innerText = 'Çıkış Yap';
        logoutButton.onclick = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        };
        navButtons.appendChild(logoutButton);
    } else {
        const loginButton = document.createElement('button');
        loginButton.innerText = 'Giriş Yap';
        loginButton.onclick = () => window.location.href = 'index.html';
        navButtons.appendChild(loginButton);
    }

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Giriş hatası');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', data.role);
            window.location.href = 'homepage.html';
        })
        .catch(error => {
            console.error('Giriş hatası:', error);
            alert('Giriş hatası: ' + error.message);
        });
    });
});
