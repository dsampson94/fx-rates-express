# FX Rates Express Server

FX Rates Express Server is a Node.js application built with Express.js to fetch and store foreign exchange rates from an external API.

## Features

- **Fetch and Store FX Rates:** Periodically fetches FX rates from an external API (fcsapi.com) and stores them in a MongoDB database using Mongoose.
- **REST API:** Provides a RESTful API to retrieve the latest FX rates and historical data.
- **Cron Job:** Uses node-cron to schedule periodic updates of FX rates.
- **CORS Configuration:** Configured to allow cross-origin requests from specified origins.
- **Error Handling:** Includes error handling for database operations and API requests.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Axios
- node-cron
- CORS middleware

## Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

- Node.js
- npm or yarn
- MongoDB (or MongoDB Atlas for cloud deployment)

## Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

       git clone https://github.com/dsampson94/fx-rates-express.git
       cd fx-rates-express

2. Install the dependencies:

       npm install
       # or
       yarn install

### Running the Application

    npm start
    # or
    yarn start

### Project Structure
    .
    ├── lib
    │   ├── db.ts
    │   ├── models
    │   │   └── FxRate.ts
    ├── public
    │   └── index.html
    ├── .env
    ├── .gitignore
    ├── app.js (or index.js)
    ├── package.json
    └── README.md

### License

This project is licensed under the MIT License.
