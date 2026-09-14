# Application Architecture

## Overview

The Lost & Found application follows a simple **client-server architecture**.

The frontend is built using React and communicates with an Express.js backend through REST API endpoints.

The backend communicates with MongoDB using Mongoose.

```text
┌──────────────────────┐
│      React Client    │
│      (Frontend)      │
└──────────┬───────────┘
           │
           │ REST API
           │ HTTP Requests
           ▼
┌──────────────────────┐
│    Express Server    │
│      (Backend)       │
└──────────┬───────────┘
           │
           │ Mongoose
           ▼
┌──────────────────────┐
│       MongoDB        │
│      Database        │
└──────────────────────┘
```

---

## Frontend Architecture

The frontend is developed using React and Vite.

React Router is used to handle navigation between pages.

### Main Frontend Components

```text
client/src/
│
├── components/
│   ├── Navbar.jsx
│   └── ItemCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Browse.jsx
│   ├── ReportLost.jsx
│   ├── ReportFound.jsx
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── ItemDetails.jsx
│   ├── Profile.jsx
│   └── Admin.jsx
│
├── App.jsx
└── App.css
```

### Components

#### Navbar

The Navbar provides navigation to the main application pages.

For logged-in users it provides:

- Browse
- Report Lost
- Report Found
- Profile
- Logout

For users who are not logged in it provides:

- Login
- Sign Up

The application logo also links back to the Home page.

#### ItemCard

`ItemCard` is a reusable component used to display basic information about an item.

It displays:

- Item name
- Type/status
- Category
- Location
- Description
- Date

Clicking an item opens its details page.

---

## Pages

### Home

The Home page provides:

- Application introduction
- Report Lost button
- Report Found button
- Browse Items button
- Recently reported approved items

### Browse

The Browse page retrieves items from the backend and allows users to:

- Search by item name
- Filter by Lost or Found
- Filter by category
- Open item details

Claimed items and unapproved reports are not displayed.

### Report Lost

The Report Lost page contains a form for creating a Lost item report.

The form collects:

- Item name
- Category
- Description
- Date
- Location
- Optional image field

The report is sent to the backend using a POST request.

### Report Found

The Report Found page works similarly to Report Lost but creates a Found report.

### Login

The Login page sends the user's email and password to the backend.

After successful authentication, basic user information is stored in browser local storage.

### Sign Up

The Sign Up page creates a new user account.

The password is sent to the backend where it is hashed before being stored.

### Item Details

The Item Details page retrieves a specific item using its ID.

It displays:

- Item name
- Status
- Category
- Description
- Date
- Location
- Possible matches

The report creator can update the item status when applicable.

### Profile

The Profile page displays:

- User name
- User email
- User's reports

The reports are retrieved using the logged-in user's ID.

### Admin

The Admin page provides basic administrative functionality.

It displays:

- Total items
- Lost count
- Found count
- Claimed count
- Active reports
- Claimed/closed reports

The Admin can:

- Approve reports
- Reject reports
- Remove reports
- View claimed reports

---

## Routing

React Router is used for frontend navigation.

The main routes are:

```text
/
 /browse
 /report/lost
 /report/found
 /login
 /signup
 /item/:id
 /profile
 /admin
```

Protected routes redirect users to the Login page when no logged-in user is found in local storage.

---

## Backend Architecture

The backend is implemented using Node.js and Express.js.

The main backend file is:

```text
server/server.js
```

The backend is responsible for:

- API routing
- Database communication
- User registration
- User login
- Item creation
- Item retrieval
- Item updates
- Item deletion
- Matching logic

---

## Backend API Flow

A typical request follows this flow:

```text
React Page
    ↓
fetch()
    ↓
Express API Route
    ↓
Mongoose Model
    ↓
MongoDB
    ↓
Response
    ↓
React State Update
    ↓
Updated UI
```

For example, when a user reports a lost item:

```text
Report Lost Form
       ↓
POST /api/items
       ↓
Express Server
       ↓
Item Model
       ↓
MongoDB
       ↓
Saved Item
       ↓
Response to React
```

---

## Database Models

The backend contains two Mongoose models.

```text
server/models/
│
├── Item.js
└── User.js
```

### User Model

Stores:

- Name
- Email
- Hashed password

### Item Model

Stores:

- Name
- Category
- Description
- Date
- Location
- Image
- Status
- Approval status
- User ID

---

## Authentication Flow

The application uses a basic authentication flow.

### Signup

```text
User enters details
        ↓
POST /api/signup
        ↓
Password hashed using bcryptjs
        ↓
User saved in MongoDB
```

### Login

```text
User enters email/password
        ↓
POST /api/login
        ↓
Find user in MongoDB
        ↓
Compare password using bcryptjs
        ↓
Login successful
        ↓
User information stored in localStorage
```

The current implementation uses local storage to maintain the logged-in state on the frontend.

---

## Protected Routes

The application uses a `ProtectedRoute` component.

The component checks whether a user exists in local storage.

```text
User opens protected page
        ↓
Is user logged in?
      /     \
    No       Yes
    ↓         ↓
 /login    Open page
```

Protected pages include:

- Home
- Browse
- Report Lost
- Report Found
- Item Details
- Profile
- Admin

---

## Admin Approval Flow

Reports are created with:

```text
approvalStatus = Pending
```

The Admin can approve or reject the report.

```text
             User Report
                  ↓
               Pending
              /       \
             ↓         ↓
        Approved     Rejected
             ↓
     Visible to users
```

The normal item API only returns approved active reports.

The Admin API returns all reports so that the Admin can review pending, approved, rejected and claimed reports.

---

## Item Status Flow

The item status is separate from the approval status.

### Approval Status

```text
Pending → Approved
        → Rejected
```

### Item Status

```text
Lost → Found → Claimed
```

This separation allows an item to be approved by the Admin while still maintaining its actual Lost/Found/Claimed state.

---

## Matching Architecture

The matching system is implemented in the backend.

The endpoint is:

```text
GET /api/items/:id/matches
```

The backend:

1. Retrieves the selected item.
2. Retrieves approved reports with the opposite status.
3. Compares category.
4. Compares location.
5. Compares dates.
6. Extracts keywords from the item name and description.
7. Calculates a score.
8. Removes matches with an invalid date relationship.
9. Keeps matches meeting the score threshold.
10. Sorts matches by score.
11. Returns the possible matches.

### Matching Score

```text
Same category          +2
Same location          +2
Same date              +2
Within 7 days          +1
Matching keywords      +4
```

The system uses simple rule-based logic rather than AI or machine learning.

---

## Error Handling

Basic error handling is implemented on both frontend and backend.

### Frontend

The application displays messages for situations such as:

- Failed API requests
- Unable to load items
- No items found
- No possible matches
- User not logged in

### Backend

The backend checks database results and returns JSON responses for API requests.

---

## Design Decisions

### React

React was selected for building the user interface and managing component state.

### Express.js

Express provides a simple way to create REST API endpoints.

### MongoDB

MongoDB provides flexible document storage for user and item data.

### Mongoose

Mongoose provides schemas and convenient database operations.

### bcryptjs

bcryptjs is used to hash user passwords.

### React Router

React Router provides client-side navigation between pages.

### Rule-Based Matching

A simple scoring system was selected because the assessment requires basic matching logic rather than advanced AI/ML.

---

## Project Data Flow

### Reporting an Item

```text
User
 ↓
Report Form
 ↓
React
 ↓
POST /api/items
 ↓
Express
 ↓
Mongoose
 ↓
MongoDB
 ↓
Pending Report
```

### Admin Approval

```text
Admin
 ↓
Admin Dashboard
 ↓
PUT /api/items/:id
 ↓
Update approvalStatus
 ↓
MongoDB
 ↓
Approved / Rejected
```

### Browsing Items

```text
Browse Page
 ↓
GET /api/items
 ↓
Express
 ↓
MongoDB
 ↓
Approved + Active Items
 ↓
Item Cards
```

### Viewing Matches

```text
Item Details
 ↓
GET /api/items/:id/matches
 ↓
Matching Logic
 ↓
Score Possible Matches
 ↓
Return Matching Items
 ↓
Display Possible Matches
```

---

## Current Limitations

The current implementation has some limitations:

- Admin access is through a separate route and does not currently use role-based authorization.
- Image upload/storage is not fully implemented.
- Authentication uses local storage rather than a token-based authentication system.
- Matching uses simple rule-based scoring.
- The application is not deployed to a production server.

These limitations can be addressed in future versions.

---

## Conclusion

The application uses a simple and understandable architecture with a React frontend, Express backend, and MongoDB database.

The separation between frontend, backend, database models, authentication, approval workflow, item status, and matching logic keeps the application organized and easy to maintain.