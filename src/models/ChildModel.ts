import { AppDataSource } from '../dataSource.js';
import { Child } from '../entities/Child.js';
import { User } from '../entities/User.js';

const childRepository = AppDataSource.getRepository(Child);

async function addChild(parent: User, name: string, dateOfBirth?: Date): Promise<Child> {
  const newChild = new Child();
  newChild.name = name;
  newChild.dateOfBirth = dateOfBirth;
  newChild.parent = parent;
  newChild.isActive = true;

  return childRepository.save(newChild);
}

async function getChildrenByParent(parentId: string): Promise<Child[]> {
  return childRepository.find({
    where: { parent: { userId: parentId } },
    relations: ['parent'],
  });
}

async function getChildById(childId: string): Promise<Child | null> {
  return childRepository.findOne({
    where: { childId },
    relations: ['parent'],
  });
}

async function updateChild(
  childId: string,
  updateData: { name?: string; dateOfBirth?: string },
): Promise<any | null> {
  const child = await childRepository.findOne({ where: { childId } });

  if (!child) {
    return null;
  }

  if (updateData.name !== undefined) {
    child.name = updateData.name;
  }

  if (updateData.dateOfBirth !== undefined) {
    child.dateOfBirth = new Date(updateData.dateOfBirth); // ← Convert string to Date
  }

  return await childRepository.save(child);
}

async function deleteChild(childId: string): Promise<boolean> {
  const result = await childRepository.delete(childId);
  return result.affected === 1;
}

export { addChild, deleteChild, getChildById, getChildrenByParent, updateChild };
