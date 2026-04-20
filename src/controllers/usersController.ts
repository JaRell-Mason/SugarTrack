import argon2 from 'argon2';
import type { Request, Response } from 'express';
import { addUser, getUserByEmail, getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { RegistrationSchema } from '../validators/authValidator.js';

async function registerUser(req: Request, res: Response): Promise<void> {
  const result = RegistrationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { email, password } = result.data;

  try {
    const passwordHash = await argon2.hash(password);
    const newUser = await addUser(email, passwordHash);
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const result = RegistrationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten() });
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await getUserByEmail(email);
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
      res.sendStatus(403);
      return;
    }

    await req.session.clearSession();
    req.session.authenticatedUser = {
      userId: user.userId,
      email: user.email,
    };
    req.session.isLoggedIn = true;

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
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

async function logOut(req: Request, res: Response): Promise<void> {
  await req.session.clearSession();
  res.sendStatus(204); // 204 No Content — successful, nothing to return
}

export { getUserProfile, logIn, logOut, registerUser };
