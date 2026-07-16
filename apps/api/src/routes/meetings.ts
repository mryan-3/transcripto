import { Router } from 'express';
import * as meetingController from '../controllers/meetings';

const router = Router();

router.get('/', meetingController.getAllMeetings);
router.get('/:id', meetingController.getMeetingById);
router.post('/upload', meetingController.uploadMeeting);

export default router;
