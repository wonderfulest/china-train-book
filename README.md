# China Train Booking System

A modern web application for booking train tickets in China, built with Vue 3 and Element Plus.

## Features

- 🚅 Real-time train search across major Chinese cities
- 📅 Easy date selection with calendar view
- 🔍 Smart station search with Pinyin support
- 📱 Responsive design for all devices
- 🎨 Modern UI with Element Plus components
- ⚡ Fast and efficient search results
- 🌐 Support for multiple languages (coming soon)

## Tech Stack

- **Frontend:**
  - Vue 3 (Composition API)
  - Element Plus UI Framework
  - Vue Router for navigation
  - Axios for API requests
  - Vite for development and building

- **Backend:**
  - Node.js with NestJS
  - MySQL database
  - TypeORM for database operations
  - RESTful API design

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MySQL (v8.0 or later)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/china-train-book.git
cd china-train-book
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Train Search
```
GET /trains/search
```
Parameters:
- `departureStation`: String (required)
- `arrivalStation`: String (required)
- `departureDate`: String (YYYY-MM-DD format, required)

## Project Structure

```
china-train-book/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Reusable Vue components
│   ├── views/          # Page components
│   ├── router/         # Vue Router configuration
│   └── App.vue         # Root component
├── public/             # Public static files
└── index.html          # Entry HTML file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Element Plus for the amazing UI components
- Vue.js team for the excellent framework
- All contributors who help to improve this project