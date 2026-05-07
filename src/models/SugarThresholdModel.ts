import { AppDataSource } from '../dataSource.js';
import { SugarThreshold } from '../entities/SugarThreshold.js';

const thresholdRepository = AppDataSource.getRepository(SugarThreshold);

async function createSugarThreshold(data: {
  childId: string;
  maxDailyGrams: number;
  description?: string;
}) {
  const threshold = thresholdRepository.create({
    child: { childId: data.childId } as any,
    maxDailyGrams: data.maxDailyGrams,
    description: data.description,
  });

  return await thresholdRepository.save(threshold);
}

async function getSugarThresholdsForChild(childId: string) {
  return await thresholdRepository.find({
    where: {
      child: { childId },
      isActive: true,
    },
    order: { createdAt: 'DESC' } as any,
  });
}

export { createSugarThreshold, getSugarThresholdsForChild };
