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

async function updateChild(childId: string, name?: string, dateOfBirth?: string, isActive?: boolean): Promise<Child | null>{
  const child =  await childRepository.findOne({ where: { childId } });
  if(!child){ 
    return null;
  }

  if(name !== undefined){
     child.name = name;
  }
  if(dateOfBirth !== undefined){
    child.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
  }
  if(isActive !== undefined ){
    child.isActive = isActive;
  }

  return childRepository.save(child);
}

async function deleteChild(childId: string): Promise<boolean> {
  const result = await childRepository.delete(childId);
  return result.affect === 1;
}

export { addChild, deleteChild, getChildById, getChildrenByParent, updateChild };

