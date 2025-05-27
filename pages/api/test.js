// pages/api/test.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('task-manager');

    // Read documents from the "tasks" collection
    const tasks = await db.collection('tasks').find({}).toArray();

    res.status(200).json({
      message: 'MongoDB connected and data retrieved!',
      tasks,
    });
  } catch (error) {
    console.error('Connection failed:', error);
    res.status(500).json({ message: 'Connection failed', error });
  }
}
