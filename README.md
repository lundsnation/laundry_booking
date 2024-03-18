# Laundry Booking Project - Lunds Nation

The Laundry Booking Project for Lund Nation is a web service that enables tenants to book laundry times. This project is
developed using Next.js, Auth0 and MongoDB, along with several other technologies. It accommodates tenants across
different laundry buildings depending on their specific building, with laundry building specific real-time booking updates.

## Technologies Used

- **Next.js**: A framework for building server-rendered React applications.
- **React**: Utilized for building the user interface.
- **MongoDB**: The database used for storing booking information.
- **Auth0**: Manages user authentication and management.
- **Pusher Channels**: Provides real-time updates on bookings.
- **Sentry**: For error logging.
- **@mui/material (MUI)**: Used for the design, providing Material UI components for React.
- **TypeScript**: Adds static type checking to the development process.

## How to download

Download the example [or clone the repo](https://github.com/lundsnation/laundry_booking.git):

cd into directory:

```sh
cd laundry_booking
```

Install it and run:

```sh
npm install
npm run dev
```

This will start a development server on your machine. Specifying mongoDB URI, AUTH0 tokens and more in .env file.
