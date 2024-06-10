document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const people = document.getElementById('quantity').value;

    try {
        const response = await fetch(`http://localhost:3000/search?destination=${destination}&startDate=${startDate}&endDate=${endDate}&quantity=${quantity}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const rooms = await response.json();
            displaySearchResults(rooms);
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Arama sırasında bir hata oluştu');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Arama sırasında bir hata oluştu');
    }
});

function displaySearchResults(rooms) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.innerHTML = '';

    if (rooms.length === 0) {
        resultsSection.innerHTML = '<p>Arama kriterlerine uygun oda bulunamadı.</p>';
        return;
    }

    rooms.forEach(room => {
        const hotel = room.hotel;
        const totalDays = (new Date(room.endDate) - new Date(room.startDate)) / (1000 * 60 * 60 * 24);
        const totalPrice = room.quantity * hotel.price * totalDays;
        const discountedPrice = totalPrice * 0.9; 

        const result = document.createElement('div');
        result.className = 'result';
        result.innerHTML = `
            <img src="${hotel.imageUrl}" alt="${hotel.name}">
            <div>
                <h3>${hotel.name}</h3>
                <p>${hotel.location}</p>
                <p>Puan: ${hotel.rating}</p>
                <p>Günlük Fiyat: ${hotel.price} TL</p>
                <p>Toplam Fiyat: <span class="original-price">${totalPrice.toFixed(2)} TL</span></p>
                <p>İndirimli Fiyat: <span class="discounted-price">${discountedPrice.toFixed(2)} TL</span></p>
            </div>
        `;

        resultsSection.appendChild(result);
    });
}
