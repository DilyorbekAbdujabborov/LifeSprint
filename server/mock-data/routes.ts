import { Router } from 'express';
import { ieltsReading, ieltsListening, ieltsFull, satMath, satEnglish, satFull, milliyMath, milliyPhysics, milliyNative, milliyFull } from './academics.js';
import { adminTests } from './tests.js';
import { diamondStudents, goldStudents, bronzeStudents } from './competition.js';

const router = Router();

router.get('/academics', (_req, res) => {
  res.json({
    ieltsReading,
    ieltsListening,
    ieltsFull,
    satMath,
    satEnglish,
    satFull,
    milliyMath,
    milliyPhysics,
    milliyNative,
    milliyFull,
  });
});

router.get('/tests', (_req, res) => {
  res.json({ adminTests });
});

router.get('/competition', (_req, res) => {
  res.json({ diamondStudents, goldStudents, bronzeStudents });
});

router.get('/all', (_req, res) => {
  res.json({
    ieltsReading,
    ieltsListening,
    ieltsFull,
    satMath,
    satEnglish,
    satFull,
    milliyMath,
    milliyPhysics,
    milliyNative,
    milliyFull,
    adminTests,
    diamondStudents,
    goldStudents,
    bronzeStudents,
  });
});

export default router;
