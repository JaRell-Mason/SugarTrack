import { Request, Response } from 'express';
import { recordFoodEntry } from '../models/FoodEntryModel.js';

async function recordIntake(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session?.isLoggedIn || !req.session.authenticatedUser) {
      res.status(401).json({ message: 'You must be logged in' });
      return;
    }

    const { childId, foodItem, amount, unit, notes } = req.body;

    if (!childId || !foodItem || !amount || !unit) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const entry = await recordFoodEntry({
      childId,
      foodItem,
      amount: Number(amount),
      unit,
      notes,
    });

    res.status(201).json({
      message: 'Intake recorded successfully',
      entry,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to record intake' });
  }
}

export { recordIntake };
