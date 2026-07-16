import { Request, Response } from 'express';
import { prisma } from '@transcripto/db';
import { ApiResponse } from '../types/response';

export const getAllMeetings = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: meetings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch meetings' });
  }
};

export const getMeetingById = async (req: Request, res: Response<ApiResponse>) => {
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
      return res.status(404).json({ success: false, error: 'Meeting not found' });
    }
    
    res.json({ success: true, data: meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch meeting details' });
  }
};

export const uploadMeeting = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const newMeeting = await prisma.meeting.create({
      data: {
        title: 'New Meeting Recording',
        status: 'PENDING',
      }
    });
    
    // In Phase 2, we will trigger a background job here
    
    res.status(201).json({ success: true, data: newMeeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to process upload' });
  }
};
