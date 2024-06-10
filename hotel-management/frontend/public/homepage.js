document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    console.log('Token:', token);
    console.log('Role:', role);
    console.log('Username:', username);

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

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const destination = document.getElementById('destination').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const people = document.getElementById('people').value;

        const searchQuery = {
            destination: destination,
            startDate: startDate,
            endDate: endDate,
            guests: parseInt(people, 10)
        };

        console.log('Arama Sorgusu:', searchQuery);

        const loadingMessage = document.getElementById('loadingMessage');
        loadingMessage.style.display = 'block';  

        fetch(`http://localhost:3001/search?destination=${destination}&startDate=${startDate}&endDate=${endDate}&guests=${searchQuery.guests}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Arama Sonuçları:', data);
            displayResults(data);
            loadingMessage.style.display = 'none'; 
        })
        .catch(error => {
            console.error('Arama Hatası:', error);
            loadingMessage.style.display = 'none';  
        });
    });

    function displayResults(results) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>Sonuç bulunamadı.</p>';
        } else {
            results.forEach(result => {
                console.log('Bulunan oda:', result);

                const days = (new Date(result.endDate) - new Date(result.startDate)) / (1000 * 60 * 60 * 24);
                const totalPrice = result.hotel.price * days * result.guests;
                const discountedPrice = token ? totalPrice * 0.9 : totalPrice;

                const resultDiv = document.createElement('div');
                resultDiv.className = 'result';
                resultDiv.innerHTML = `
                    <img src="${result.hotel.imageUrl}" alt="${result.hotel.name}">
                    <div class="details">
                        <h3>${result.hotel.name}</h3>
                        <p>${result.hotel.location}</p>
                        <p class="rating">Puan: ${result.hotel.rating}</p>
                        <p>Günlük Fiyat: ${result.hotel.price} TL</p>
                        <p class="original-price">Toplam Fiyat: ${totalPrice.toFixed(2)} TL</p>
                        ${token ? `<p class="discounted-price">İndirimli Fiyat: ${discountedPrice.toFixed(2)} TL</p>` : '<button class="login-button" onclick="window.location.href=\'index.html\'">İndirimli Fiyat İçin Giriş Yap</button>'}
                        <div id="map-${result.hotel._id}" class="result-map"></div>
                    </div>
                `;
                resultDiv.addEventListener('click', () => {
                    window.location.href = `hotel-details.html?hotelId=${result.hotel._id}&roomId=${result._id}&startDate=${result.startDate}&endDate=${result.endDate}&guests=${result.guests}`;
                });
                resultsContainer.appendChild(resultDiv);

              
                setTimeout(() => {
                    initMap(`map-${result.hotel._id}`, result.hotel.lat, result.hotel.lng);
                }, 100);
            });
        }

        resultsSection.style.display = 'block';
    }

    function initMap(mapId, lat, lng) {
        const map = L.map(mapId).setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup('Otel Konumu').openPopup();
    }
});
