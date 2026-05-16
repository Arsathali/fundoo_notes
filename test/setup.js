import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

before(async () => {
  // Connect to test database
  await mongoose.connect(process.env.TEST_DB_URI || 'mongodb://localhost:27017/test_fundo_app');
});

after(async () => {
  // Close connection
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});