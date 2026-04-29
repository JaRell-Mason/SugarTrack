import connectPgSimple from 'connect-pg-simple';
import 'dotenv/config';
import express, { Express } from 'express';
import session from 'express-session';
import './config.js'; // do not remove this line
import { createChild, getMyChildren } from './controllers/childrenController.js';
import {
  getAllUnverifiedEmails,
  getUserProfile,
  getVerifiedEmails,
  logIn,
  logOut,
  registerUser,
} from './controllers/usersController.js'; // No idea why it wrapped it like this.
import { sessionMiddleware } from './sessionConfig.js';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;
const PostgresStore = connectPgSimple(session);

app.use(sessionMiddleware); // Setup session management middleware
app.use(express.json()); // Setup JSON body parsing middleware
app.use(express.urlencoded({ extended: false })); // Setup urlencoded (HTML Forms) body parsing middleware

// Setup static resource file middleware
// This allows the client to access any file inside the `public` directory
// Only put file that you actually want to be publicly accessibly in the `public` folder
app.use(express.static('public', { extensions: ['html'] }));

// -- Routes --------------------------------------------------
// Register your routes below this line

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

// I have no clue where to put this tbh.
app.use(
  session({
    store: new PostgresStore({ createTableIfMissing: true }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    name: 'session',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.json());

app.post('/users', registerUser);
app.post('/login', logIn);
app.delete('/sessions', logOut);
app.get('/users/:userId', getUserProfile);
app.get('/users/unverified', getAllUnverifiedEmails);
app.get('/users/verified', getVerifiedEmails);
app.post('/children', createChild);
app.get('/children', getMyChildren);

app.listen(PORT, () => console.log('Listening to stupidity at http://localhost:${PORT}'));
