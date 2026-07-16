import { Router, Request, Response } from 'express';
import { prisma } from '@transcripto/db';

const router = Router();

// GET /meetings
router.get('/', async (req: Request, res: Response) => {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// GET /meetings/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: {
        segments: true,
        insights: true,
      },
    });
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    res.json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch meeting details' });
  }
});

// POST /meetings/upload
router.post('/upload', async (req: Request, res: Response) => {
  // Placeholder for file upload logic
  try {
    const newMeeting = await prisma.meeting.create({
      data: {
        title: 'New Meeting Recording',
        status: 'PENDING',
      }
    });
    
    // In Phase 2, we will trigger a background job here
    
    res.status(201).json(newMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

export default router;
