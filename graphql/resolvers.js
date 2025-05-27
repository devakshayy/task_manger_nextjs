import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

const resolvers = {
  Query: {
    tasks: async () => {
      const client = await clientPromise;
      const db = client.db();
      return db.collection('tasks').find({}).toArray();
    },
    task: async (_, { id }) => {
      const client = await clientPromise;
      const db = client.db();
      return db.collection('tasks').findOne({ _id: new ObjectId(id) });
    },
    tasksByStatus: async (_, { status }) => {
      const client = await clientPromise;
      const db = client.db();
      return db.collection('tasks').find({ status }).toArray();
    }
  },
  Mutation: {
    addTask: async (_, { title, description, status, dueDate }) => {
      const client = await clientPromise;
      const db = client.db();
      const task = { title, description, status, dueDate };
      const result = await db.collection('tasks').insertOne(task);
      return { _id: result.insertedId, ...task };
    },
    updateTaskStatus: async (_, { id, status }) => {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('tasks').updateOne({ _id: new ObjectId(id) }, { $set: { status } });
      return db.collection('tasks').findOne({ _id: new ObjectId(id) });
    }
  }
};

export default resolvers;
