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

    // Otel listesini doldurma
    fetch('http://localhost:3001/hotels')
        .then(response => response.json())
        .then(data => {
            const hotelSelect = document.getElementById('hotel');
            data.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel._id;
                option.text = hotel.name;
                hotelSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Oteller alınırken hata oluştu:', error));

    // Oda ekleme formunu gönderme
    document.getElementById('addRoomForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const hotel = document.getElementById('hotel').value;
        const roomType = document.getElementById('roomType').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const guests = document.getElementById('guests').value;
        const status = document.getElementById('status').value;

        const roomData = {
            hotel: hotel,
            roomType: roomType,
            startDate: startDate,
            endDate: endDate,
            guests: guests,
            status: status
        };

        console.log('Form Verileri:', roomData); 

        fetch('http://localhost:3001/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(roomData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Oda eklenirken hata oluştu');
            }
            return response.json();
        })
        .then(data => {
            alert('Oda başarıyla eklendi');
            window.location.href = 'homepage.html';
        })
        .catch(error => {
            console.error('Oda eklenirken hata oluştu:', error);
            alert('Oda eklenirken hata oluştu: ' + error.message);
        });
    });
});
