import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/User.js';

const userRepository = AppDataSource.getRepository(User);

async function addUser(email: string, passwordHash: string, displayName: string): Promise<User> {
  const newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  newUser.displayName = displayName;

  return userRepository.save(newUser);
}

async function getAllUsers(): Promise<User[]> {
  return userRepository.find();
}

async function getUserById(userId: string): Promise<User | null> {
  return userRepository.findOne({ where: { userId } });
}

async function getAllUnverifiedUsers(): Promise<User[]> {
  return userRepository.find({
    select: { email: true, userId: true },
    where: { verifiedEmail: false },
  });
}

async function getVerifiedUsers(): Promise<User[]> {
  return userRepository.find({
    select: {
      userId: true,
      email: true,
      joinedOn: true,
    },
    where: { verifiedEmail: true },
  });
}

async function getUserByEmail(email: string): Promise<User | null> {
  return userRepository.findOne({
    where: { email },
  });
}

async function getUserProfileData(userId: string): Promise<User | null> {
  return userRepository.findOne({
    where: { userId },
    select: {
      userId: true,
      email: true,
      verifiedEmail: true,
      joinedOn: true,
    },
  });
}

async function getActiveUserEmails(): Promise<User[]> {
  return userRepository.find({
    select: { userId: true, email: true },
    where: { verifiedEmail: true },
  });
}

export {
  addUser,
  getActiveUserEmails,
  getAllUnverifiedUsers,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserProfileData,
  getVerifiedUsers,
};
