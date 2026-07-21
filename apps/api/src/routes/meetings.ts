import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as meetingController from '../controllers/meetings';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', meetingController.getAllMeetings);
router.get('/stream', meetingController.streamFile);
router.get('/:id', meetingController.getMeetingById);
router.post('/upload', upload.single('file'), meetingController.uploadMeeting);
router.post('/import-local', meetingController.importLocal);

export default router;
