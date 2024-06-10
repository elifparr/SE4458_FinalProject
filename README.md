# Hotel Management System

## Overview

The Hotel Management System is a web application designed to facilitate hotel operations by allowing users to search for hotels, book rooms, and enable administrators to add and manage room availability. This project leverages modern web technologies including Node.js, Express.js, MongoDB, and RabbitMQ to provide a robust and scalable solution for hotel management.

## Purpose

The primary purpose of this project is to streamline the process of hotel room booking and management. Key functionalities include:

- **User Registration and Authentication:** Secure user registration and login system.
- **Hotel Search:** Users can search for hotels based on destination, dates, and number of guests.
- **Room Booking:** Users can book available rooms, with booking details managed and stored in the system.
- **Room Management:** Administrators can add new rooms, specifying details such as room type, availability dates, and capacity.
- **Notifications:** The system includes a notification service to alert administrators when hotel capacity falls below a certain threshold.

## Features

- **User Registration and Login:** Secure authentication using JSON Web Tokens (JWT).
- **Hotel Search:** Search for hotels based on location, dates, and guest count.
- **Room Booking:** Book rooms directly from search results.
- **Admin Room Management:** Add and manage room details and availability.
- **Notification Service:** Nightly scheduled tasks to notify administrators of low capacity and handle new reservations using RabbitMQ.

## Technologies Used

- **Node.js & Express.js:** Backend server and API.
- **MongoDB (Azure Cosmos DB):** Database for storing user, hotel, and room information.
- **RabbitMQ:** Message queue service for handling reservations and notifications.
- **Docker & Docker Compose:** Containerization for easy setup and deployment.
- **Frontend:** HTML, CSS, JavaScript for building the user interface.

## Getting Started

To set up and run the project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd hotel-management-system
    ```

2. **Set up the environment variables:**

    Create a `.env` file in the root directory with the necessary configuration values.

3. **Build and run the Docker containers:**

    ```bash
    docker-compose up --build
    ```

4. **Access the application:**

    - Frontend: `http://localhost:8080`
    - Backend: `http://localhost:3001`
    - API Gateway: `http://localhost:3000`
    - RabbitMQ Management: `http://localhost:15672` (Username: guest, Password: guest)

## Contact

For any inquiries or issues, please contact [your-email@example.com].

