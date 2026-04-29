import { Request, Response } from 'express';
import { addUser } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateUserSchema } from '../validators/users.js';

async function registerUser(req: Request, res: Response): Promise<void> {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const { email, passwordHash, displayName } = result.data;

  try {
    const newUser = await addUser(email, passwordHash, displayName);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { registerUser };
