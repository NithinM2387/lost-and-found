## Users Collection

The `users` collection stores registered users.

| Field | Type | Purpose |
|---|---|---|
| `_id` | ObjectId | MongoDB user ID |
| `name` | String | User name |
| `email` | String | User email |
| `password` | String | Hashed password |

Passwords are hashed with bcryptjs before saving.

## Items Collection

The `items` collection stores both lost and found reports.

| Field | Type | Purpose |
|---|---|---|
| `_id` | ObjectId | MongoDB item ID |
| `name` | String | Item name |
| `category` | String | Bags, Electronics, Keys, or Other |
| `description` | String | More details about the item |
| `date` | String | Date the item was lost or found |
| `location` | String | Place connected to the report |
| `image` | String | Optional image field; upload is not implemented |
| `status` | String | Lost, Found, or Claimed |
| `approvalStatus` | String | Pending, Approved, or Rejected |
| `userId` | String | ID of the user who created the report |