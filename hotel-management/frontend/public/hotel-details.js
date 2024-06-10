document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event triggered');

    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('hotelId');
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');
    const guests = urlParams.get('guests');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    console.log('Hotel ID:', hotelId);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Guests:', guests);

    if (!hotelId || !startDate || !endDate || !guests) {
        alert('Otel veya oda bulunamadı veya gerekli bilgiler eksik');
        window.location.href = 'homepage.html';
        return;
    }

    fetch(`http://localhost:3001/hotels/${hotelId}`)
        .then(response => response.json())
        .then(hotel => {
            if (!hotel) {
                throw new Error('Otel bulunamadı');
            }

            document.getElementById('hotelName').innerText = hotel.name;
            document.getElementById('hotelLocation').innerText = `Lokasyon: ${hotel.location}`;
            document.getElementById('hotelImage').src = hotel.imageUrl;

            // Yıldızları doldurma
            const starsElement = document.getElementById('hotelStars');
            const fullStars = Math.floor(hotel.rating / 2);
            const halfStar = hotel.rating % 2 !== 0;
            for (let i = 0; i < fullStars; i++) {
                starsElement.innerHTML += '<i class="fas fa-star"></i>';
            }
            if (halfStar) {
                starsElement.innerHTML += '<i class="fas fa-star-half-alt"></i>';
            }
            for (let i = fullStars + halfStar; i < 5; i++) {
                starsElement.innerHTML += '<i class="far fa-star"></i>';
            }

            document.getElementById('hotelRating').innerText = `Puan: ${hotel.rating}`;

            // Fiyat hesaplama
            const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
            const totalPrice = hotel.price * days * guests;
            const discountedPrice = totalPrice * 0.9;

            document.getElementById('hotelPrice').innerHTML = token
                ? `<span class="original-price">Toplam Fiyat: ${totalPrice.toFixed(2)} TL</span><br><span class="discounted-price">İndirimli Fiyat: ${discountedPrice.toFixed(2)} TL</span> (${days} gecelik fiyat ve ${guests} kişilik fiyat)`
                : `<span class="original-price">Toplam Fiyat: ${totalPrice.toFixed(2)} TL</span> (${days} gecelik fiyat ve ${guests} kişilik fiyat) <br><button class="login-button" onclick="window.location.href='index.html'">İndirimli Fiyat İçin Giriş Yap</button>`;

            setTimeout(() => {
                initMap(hotel.lat, hotel.lng);
            }, 100);

          
            fetch(`http://localhost:3001/rooms?hotelId=${hotelId}&startDate=${startDate}&endDate=${endDate}`)
                .then(response => response.json())
                .then(rooms => {
                    const roomsSelect = document.getElementById('rooms');
                    rooms.forEach(room => {
                        const option = document.createElement('option');
                        option.value = room._id;
                        option.text = `${room.roomType} (${room.guests} kişilik) - ${room.status}`;
                        roomsSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Odalar alınırken hata oluştu:', error);
                    alert('Odalar alınırken hata oluştu');
                });
        })
        .catch(error => {
            console.error('Otel detayları alınırken hata oluştu:', error);
            alert('Otel detayları alınırken hata oluştu');
            window.location.href = 'homepage.html';
        });

    function initMap(lat, lng) {
        const map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup('Otel Konumu').openPopup();
    }

    document.getElementById('reserveButton').addEventListener('click', function() {
        const selectedRoomId = document.getElementById('rooms').value;
        if (!selectedRoomId) {
            alert('Lütfen bir oda seçin');
            return;
        }
        makeReservation(hotelId, selectedRoomId, startDate, endDate, guests);
    });

    function makeReservation(hotelId, roomId, startDate, endDate, guests) {
        fetch('http://localhost:3001/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                hotelId: hotelId,
                roomId: roomId,
                startDate: startDate,
                endDate: endDate,
                guests: guests
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Rezervasyon başarılı') {
                alert('Rezervasyon başarıyla tamamlandı');
                window.location.href = 'homepage.html';
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Rezervasyon hatası:', error);
            alert('Rezervasyon yapılamadı');
        });
    }

    const navButtons = document.getElementById('navButtons');
    navButtons.innerHTML = '';  

    if (token) {
        const welcomeMessage = document.createElement('span');
        welcomeMessage.innerText = `Hoşgeldin, ${username}`;
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
});
