import { Request, Response } from 'express';
import { updateUserEmail } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { UpdateEmailSchema } from '../validators/users.js';

export async function updateEmail(req: Request, res: Response): Promise<void> {
  const userId = String(req.params.userId);

  const result = UpdateEmailSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  try {
    const updatedUser = await updateUserEmail(userId, result.data.email);
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}
