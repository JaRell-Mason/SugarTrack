import type { Request, Response } from 'express';
import { addCaregiverToChild, getCaregiversForChild } from '../models/CaregiverModel.js';
import { addChild, deleteChild, getChildrenByParent, updateChild } from '../models/ChildModel.js';
import { getFoodEntriesForChild } from '../models/FoodEntryModel.js';
import { createSugarThreshold, getSugarThresholdsForChild } from '../models/SugarThresholdModel.js';

async function createChild(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn || !req.session.authenticatedUser) {
    res.sendStatus(401);
    return;
  }

  const { name, dateOfBirth } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    const parent = { userId: req.session.authenticatedUser.userId } as any;
    const newChild = await addChild(parent, name, dateOfBirth ? new Date(dateOfBirth) : undefined);

    res.status(201).json(newChild);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

async function addCaregiver(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session?.isLoggedIn || !req.session.authenticatedUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const childId = String(req.params.childId);
    const { userId, accessLevel = 'view' } = req.body;

    if (!userId) {
      res.status(400).json({ message: 'userId is required' });
      return;
    }

    const caregiver = await addCaregiverToChild(childId, userId, accessLevel);

    res.status(201).json({
      message: 'Caregiver added successfully',
      caregiver,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add caregiver' });
  }
}

async function getCaregivers(req: Request, res: Response): Promise<void> {
  try {
    const childId = String(req.params.childId);
    const caregivers = await getCaregiversForChild(childId);
    res.json(caregivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load caregivers' });
  }
}

async function getMyChildren(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session?.isLoggedIn || !req.session.authenticatedUser) {
      res.status(401).json({ message: 'You must be logged in' });
      return;
    }

    const parentId = req.session.authenticatedUser.userId;
    const children = await getChildrenByParent(parentId); // your model function

    res.json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load children' });
  }
}

async function getChildsIntake(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session.isLoggedIn) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const childId = String(req.params.childId);
    const entries = await getFoodEntriesForChild(childId);

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Someone ate the history! (History failed to load.)' });
  }
}

async function updateChildController(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session?.isLoggedIn || !req.session.authenticatedUser) {
      res.status(401).json({ message: 'You must be logged in' });
      return;
    }

    const childId = String(req.params.childId);

    const { name, dateOfBirth } = req.body;

    if (!name && !dateOfBirth) {
      res.status(400).json({ message: 'No update data provided' });
      return;
    }

    const updatedChild = await updateChild(childId, { name, dateOfBirth });

    if (!updatedChild) {
      res.status(404).json({ message: 'Child not found' });
      return;
    }

    res.status(200).json({
      message: 'Child updated successfully',
      child: updatedChild,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update child' });
  }
}

async function deleteChildById(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session?.isLoggedIn) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const childId = String(req.params.childId);
    const success = await deleteChild(childId);

    if (success) {
      res.json({ message: 'Child deleted' });
    } else {
      res.status(404).json({ message: 'Child not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
}

async function createThreshold(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session?.isLoggedIn) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const childId = String(req.params.childId);
    const { maxDailyGrams, description } = req.body;

    if (!maxDailyGrams) {
      res.status(400).json({ message: 'maxDailyGrams is required' });
      return;
    }

    const threshold = await createSugarThreshold({ childId, maxDailyGrams, description });

    res.status(201).json({
      message: 'Sugar threshold created',
      threshold,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create threshold' });
  }
}

async function getThresholds(req: Request, res: Response): Promise<void> {
  try {
    const childId = String(req.params.childId);
    const thresholds = await getSugarThresholdsForChild(childId);
    res.json(thresholds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load thresholds' });
  }
}

export {
  addCaregiver,
  createChild,
  createThreshold,
  deleteChildById,
  getCaregivers,
  getChildsIntake,
  getMyChildren,
  getThresholds,
  updateChildController,
};
