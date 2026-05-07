import connectPgSimple from 'connect-pg-simple';
import 'dotenv/config';
import express, { Express } from 'express';
import session from 'express-session';
import './config.js'; // do not remove this line
import {
  addCaregiver,
  createChild,
  createThreshold,
  deleteChildById,
  getCaregivers,
  getChildsIntake,
  getMyChildren,
  getThresholds,
  updateChildController,
} from './controllers/childrenController.js';
import { recordIntake } from './controllers/foodController.js';
import {
  getAllUnverifiedEmails,
  getCurrentUser,
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

app.post('/api/users', registerUser);
app.post('/api/login', logIn);
app.delete('/api/sessions', logOut);
app.get('/api/users/:userId', getUserProfile);
app.get('/api/users/unverified', getAllUnverifiedEmails);
app.get('/api/users/verified', getVerifiedEmails);
app.post('/api/children', createChild);
app.get('/api/children', getMyChildren);
app.get('/api/children/:childId/intake', getChildsIntake);
app.post('/api/children/:childId/caregivers', addCaregiver);
app.get('/api/children/:childId/caregivers', getCaregivers);
app.delete('/api/children/:childId', deleteChildById);
app.put('/api/children/:childId', updateChildController);
app.get('/api/me', getCurrentUser);
app.post('/api/intake', recordIntake);
app.post('/api/children/:childId/thresholds', createThreshold);
app.get('/api/children/:childId/thresholds', getThresholds);

app.listen(PORT, () => console.log('Listening to stupidity at http://localhost:${PORT}'));
