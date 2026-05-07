import { AppDataSource } from '../dataSource.js';
import { FoodEntry } from '../entities/FoodEntry.js';

const foodEntryRepository = AppDataSource.getRepository(FoodEntry);

async function recordFoodEntry(entryData: {
  childId: string;
  foodItem: string;
  amount: number;
  unit: string;
  notes?: string;
}): Promise<FoodEntry> {
  const entry = foodEntryRepository.create({
    ...entryData,
    child: { childId: entryData.childId },
  });

  return await foodEntryRepository.save(entry);
}

async function getFoodEntriesForChild(childId: string): Promise<FoodEntry[]> {
  return await foodEntryRepository.find({
    where: { child: { childId } },
    order: { recordedAt: 'DESC' },
  });
}

export { getFoodEntriesForChild, recordFoodEntry };
