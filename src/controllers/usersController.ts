import argon2 from 'argon2';
import type { Request, Response } from 'express';
import {
  addUser,
  deleteUserById,
  getAllUnverifiedUsers,
  getUserByEmail,
  getUserById,
  getVerifiedUsers,
} from '../models/UserModel.js'; // I have no idea why it wrapped it like this.
import { parseDatabaseError } from '../utils/db-utils.js';
import { LoginSchema, RegistrationSchema } from '../validators/authValidator.js';

async function registerUser(req: Request, res: Response): Promise<void> {
  const result = RegistrationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { email, password, displayName } = result.data;

  try {
    const passwordHash = await argon2.hash(password);
    const newUser = await addUser(email, passwordHash, displayName);
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  try {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten() });
      return;
    }

    const { email, password } = result.data;

    const user = await getUserByEmail(email);

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    req.session.isLoggedIn = true;
    req.session.authenticatedUser = {
      userId: user.userId,
      email: user.email,
      displayName: user.displayName || null,
    };

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.userId,
        email: user.email,
        displayName: user.displayName || null,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = parseDatabaseError(err);
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
}

async function getUserProfile(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const userId = req.params.userId as string;

  if (req.session.authenticatedUser?.userId !== userId) {
    res.sendStatus(403);
    return;
  }

  const user = await getUserById(userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json({ user });
}

async function getVerifiedEmails(req: Request, res: Response): Promise<void> {
  try {
    const verifiedUsers = await getVerifiedUsers();

    res.status(200).json(verifiedUsers);
  } catch (error) {
    console.error('Error fetching verified users: ', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getAllUnverifiedEmails(req: Request, res: Response): Promise<void> {
  try {
    const unverifiedUsers = await getAllUnverifiedUsers();

    res.status(200).json(unverifiedUsers);
  } catch (error) {
    console.error('Error fetching unverified users: ', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (req.session.isLoggedIn && req.session.authenticatedUser) {
    res.json({
      isLoggedIn: true,
      user: req.session.authenticatedUser,
    });
  } else {
    res.status(401).json({ isLoggedIn: false });
  }
}

async function logOut(req: Request, res: Response): Promise<void> {
  try {
    if (req.session) {
      await req.session.clearSession();
    }
    res.status(200).json({ message: 'Logged out successfully' });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Logout failed' });
    return;
  }
  //res.sendStatus(204); // 204 No Content — successful, nothing to return
}

async function deleteUser(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId as string;
  const user = await getUserById(userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  await deleteUserById(userId);
  res.sendStatus(204); // 204 No Content — successful, nothing to return
}

export {
  deleteUser,
  getAllUnverifiedEmails,
  getCurrentUser,
  getUserProfile,
  getVerifiedEmails,
  logIn,
  logOut,
  registerUser,
};
