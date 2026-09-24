## Frontend


The React frontend shows pages and forms. It uses `fetch()` to call the Express API. Express reads or updates MongoDB through Mongoose and sends JSON back to React.


The frontend is in `client` and uses React with Vite.

```text
client/src/
├── components/
│   ├── Navbar.jsx
│   └── ItemCard.jsx
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
├── App.jsx
├── App.css
└── index.css
```


## Backend

The backend is in `server`.

```text
server/
├── models/
│   ├── Item.js
│   └── User.js
└── server.js
```

`server.js` starts Express on port 5000, connects to MongoDB with `MONGO_URI`, and contains the API routes. The routes create users and reports, return data, update status or approval, delete a report, and find possible matches.