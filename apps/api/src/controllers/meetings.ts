import { Request, Response } from 'express';
import { prisma } from '@transcripto/db';
import { ApiResponse } from '../types/response';
import path from 'path';
import fs from 'fs';

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
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const title = req.body.title || req.file.originalname.replace(path.extname(req.file.originalname), '');
    const audioUrl = `/uploads/${req.file.filename}`;

    const newMeeting = await prisma.meeting.create({
      data: {
        title,
        status: 'PENDING',
        audioUrl,
      }
    });
    
    const absolutePath = path.resolve(req.file.path);

    const { meetingQueue } = require('@transcripto/jobs');
    await meetingQueue.add('process-video', { 
      meetingId: newMeeting.id,
      filePath: absolutePath
    });
    
    res.status(201).json({ success: true, data: newMeeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to process upload' });
  }
};

export const importLocal = async (req: Request, res: Response<ApiResponse>) => {
  const { filePath, title: customTitle } = req.body;
  
  try {
    if (!filePath) {
      return res.status(400).json({ success: false, error: 'filePath is required' });
    }
    
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, error: `File not found at: ${absolutePath}` });
    }
    
    const title = customTitle || path.basename(absolutePath, path.extname(absolutePath));
    const audioUrl = `/meetings/stream?path=${encodeURIComponent(absolutePath)}`;
    
    const newMeeting = await prisma.meeting.create({
      data: {
        title,
        status: 'PENDING',
        audioUrl,
      }
    });
    
    const { meetingQueue } = require('@transcripto/jobs');
    await meetingQueue.add('process-video', { 
      meetingId: newMeeting.id,
      filePath: absolutePath
    });
    
    res.status(201).json({ success: true, data: newMeeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to process local import' });
  }
};

export const streamFile = async (req: Request, res: Response) => {
  const filePath = req.query.path as string;
  
  if (!filePath) {
    return res.status(400).send('Path parameter is required');
  }
  
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).send('File not found');
  }
  
  res.sendFile(absolutePath);
};
