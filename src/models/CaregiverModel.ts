import { AppDataSource } from '../dataSource.js';
import { Caregiver } from '../entities/Caregiver.js';

const caregiverRepository = AppDataSource.getRepository(Caregiver);

async function addCaregiverToChild(
  childId: string,
  userId: string,
  accessLevel: string = 'view',
): Promise<Caregiver> {
  const caregiver = caregiverRepository.create({
    child: { childId } as any,
    user: { userId } as any,
    accessLevel,
  });

  return await caregiverRepository.save(caregiver);
}

async function getCaregiversForChild(childId: string): Promise<any[]> {
  const result = await caregiverRepository.find({
    where: { child: { childId } },
    relations: ['user'],
    order: { accessLevel: 'DESC' } as any,
  });

  return result as any[];
}

export { addCaregiverToChild, getCaregiversForChild };
