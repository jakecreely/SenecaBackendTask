# Seneca Backend Technical Task - Jake Creely

## Deployment

### Prerequisites

1. **Node.js** and **npm** installed.
2. **Database**: A MongoDB database is set up and accessible.
3. **Environment Variables**: For configuring the database and HTTP port.

### Step 1: Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/your-username/course-stats-service.git
cd course-stats-service
```

### Step 2: Install Dependencies
Install the required dependencies via npm:

```bash
npm install
```

### Step 3: Configure Environment Variables
Create a .env file in the root of the project and define the environment variables.

```
MONGODB_URL=mongodb://localhost:27017/stats
PORT=3000
```

### Step 3: Test the application
To ensure everything is working correctly run the test command which will test both the API and the database.

```bash
npm run test
```

### Step 3: Run the application locally 
Once everything is working, we can run it locally.

```bash
npm run start
```
