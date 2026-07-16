import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Shared Redis connection
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const meetingQueue = new Queue('meeting-processing', { connection });

console.log('BullMQ Queue Initialized: meeting-processing');
