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

export { addChild, getChildById, getChildrenByParent };
