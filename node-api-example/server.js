const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// In-memory database (for demonstration purposes)
const companies = [
  { id: 1, name: 'Company A', location: 'Location A' },
  { id: 2, name: 'Company B', location: 'Location B' },
];

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Passport setup for JWT authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key', // Replace with a strong secret key for production
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  // In a real application, you might query a user database to find and return a user
  // For simplicity, we'll assume the payload contains a 'role' field
  if (payload.role === 'admin') {
    return done(null, true);
  } else {
    return done(null, false);
  }
}));

// Authenticate middleware using Passport
const authenticate = passport.authenticate('jwt', { session: false });

// Root endpoint handler
app.get('/', (req, res) => {
  res.send('Welcome to the API. Use /companies to get a list of companies.');
});

// API endpoint to retrieve a list of companies
app.get('/companies', (req, res) => {
  res.json(companies);
 // res.json(companies.map(({ name, location }) => ({ name, location })));
});


// API endpoint to create a new company (only accessible to authenticated 'admin' users)
app.post('/companies', authenticate, (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ error: 'Name and location are required' });
  }

  // Continue with creating the company if parameters are present
  // ...

  res.json({ message: 'New company created!' });
});

// API endpoint to handle login and generate JWT token
app.post('/login', (req, res) => {
  // For simplicity, you can generate a dummy token here
  const token = jwt.sign({ username: 'admin', role: 'admin' }, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app; // Export the app for testing purposes
