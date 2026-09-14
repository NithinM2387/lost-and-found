# Lost & Found Web Application

A web application that allows users to report lost and found items, browse approved reports, search for items, and identify possible matches between lost and found reports.

## Objective

The Lost & Found application provides a simple platform for users to report lost or found belongings and helps users identify possible matches using rule-based matching.

The project focuses on functionality, usability, validation, database integration, and a clean application structure.

## Technology Stack

### Frontend
- React
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express.js
- CORS
- dotenv
- bcryptjs

### Database
- MongoDB
- Mongoose

## Features

### User Features

- User registration
- User login and logout
- Protected application pages
- Home page
- Browse all approved active Lost & Found reports
- Search items by name
- Filter items by type and category
- Report lost items
- Report found items
- View item details
- View possible matches
- Mark own lost item as Found
- Mark own found item as Claimed
- View personal profile
- View personal reports

### Admin Features

- Admin dashboard
- View total item statistics
- View Lost, Found and Claimed counts
- Review submitted reports
- Approve reports
- Reject reports
- Remove reports
- View claimed/closed items

## Report Approval Workflow

New reports are initially given the approval status:

`Pending`

Pending reports are visible to the Admin but are not displayed on the public Home or Browse pages.

The Admin can:

- Approve the report
- Reject the report
- Remove the report

Only approved reports are displayed to normal users.

Once a report is approved or rejected, the Approve and Reject buttons are no longer displayed. The Admin can still remove the report if necessary.

## Item Status Workflow

Items use the following status values:

- `Lost`
- `Found`
- `Claimed`

When an item is marked as `Claimed`, it is removed from the normal Home and Browse listings and is displayed under the Admin's Claimed / Closed section.

Claimed items remain stored in the database.

## User Ownership

Each reported item stores the ID of the user who created the report using the `userId` field.

All approved active reports can be viewed by logged-in users through Home and Browse.

The Profile page uses the user's ID to display only the reports created by that user under **My Reports**.

## Matching Logic

The application uses simple rule-based matching.

Lost reports are compared with Found reports.

The matching system considers:

- Category
- Location
- Date
- Keywords from the item name and description

### Matching Rules

| Factor | Score |
|---|---:|
| Same category | +2 |
| Same location | +2 |
| Same date | +2 |
| Found within 7 days | +1 |
| Matching meaningful keywords | +4 |

A possible match is displayed when the score reaches the required threshold.

Location and date are supporting factors and do not have to be identical for an item to be considered a possible match.

Reports with an impossible date relationship are ignored.

Pending and rejected reports are not included in matching.

## Project Structure

```text
lost-and-found/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── ItemCard.jsx
│       │   └── Navbar.jsx
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Browse.jsx
│       │   ├── ReportLost.jsx
│       │   ├── ReportFound.jsx
│       │   ├── Login.jsx
│       │   ├── SignUp.jsx
│       │   ├── ItemDetails.jsx
│       │   ├── Profile.jsx
│       │   └── Admin.jsx
│       │
│       ├── App.jsx
│       └── App.css
│
├── server/
│   ├── models/
│   │   ├── Item.js
│   │   └── User.js
│   │
│   ├── server.js
│   └── .env
│
├── README.md
├── DATABASE.md
└── ARCHITECTURE.md
```

## Database

The application uses MongoDB through Mongoose.

### Item

The Item collection stores:

- `name`
- `category`
- `description`
- `date`
- `location`
- `image`
- `status`
- `approvalStatus`
- `userId`

### User

The User collection stores:

- `name`
- `email`
- `password`

Passwords are hashed using bcryptjs before being stored.

More database details are available in `DATABASE.md`.

## API Endpoints

### Items

```text
GET    /api/items
GET    /api/items/:id
GET    /api/items/:id/matches
GET    /api/my-items/:userId
GET    /api/admin/items
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
```

### Authentication

```text
POST /api/signup
POST /api/login
```

## Running the Project

### Backend

Open a terminal inside the `server` directory:

```bash
npm install
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal inside the `client` directory:

```bash
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Environment Variables

The backend uses a `.env` file for the MongoDB connection.

Example:

```env
MONGO_URI=your_mongodb_connection_string
```

Do not commit real database credentials to the repository.

## Validation and Error Handling

The application includes basic form validation using required fields.

The Browse page handles loading and API errors.

Login and signup provide feedback for invalid requests.

The application also handles cases where:

- No items are available
- No search results are found
- No possible matches are found
- A user is not logged in
- Reports cannot be loaded

## Assumptions

- Users must be logged in to access the main application.
- Admin functionality is available through a separate Admin route.
- New reports require Admin approval before appearing publicly.
- Images are optional. The current implementation stores an optional image field but does not implement full image upload/storage.
- The matching system is rule-based and does not use AI or machine learning.
- Deployment is not included in the current implementation.
- MongoDB Atlas is used for database storage.

## Future Improvements

Possible future improvements include:

- Secure admin authentication and authorization
- Image upload and storage
- Email notifications
- More advanced search
- Improved location matching
- Better status and claim confirmation workflow
- Deployment to a production environment

## Conclusion

The Lost & Found application provides a complete basic workflow for reporting, reviewing, browsing, matching, and managing lost and found items using React, Express, and MongoDB.