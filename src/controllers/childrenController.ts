import type { Request, Response } from 'express';
import { addChild, getChildrenByParent } from '../models/ChildModel.js';

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

async function getMyChildren(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn || !req.session.authenticatedUser) {
    res.sendStatus(401);
    return;
  }

  try {
    const children = await getChildrenByParent(req.session.authenticatedUser.userId);
    res.json({ children });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export { createChild, getMyChildren };
