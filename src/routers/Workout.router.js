const express = require('express');
const router = express.Router();

const {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  upvoteWorkout,
  downvoteWorkout,
} = require('../models/Workout.model');

const { createComment, getComments } = require('../models/Comment.model');
const authMiddleware = require('../middlewares/authMiddleware');

// CREATE (only logged-in user, set createdById from JWT)
router.post('/', authMiddleware, (req, res, next) => {
  req.body.createdById = req.user.userId;

  createWorkout(req.body)
    .then(w => res.status(201).json(w))
    .catch(next);
});

// GET ALL (public)
router.get('/', (req, res, next) => {
  getAllWorkouts()
    .then(w => res.json(w))
    .catch(next);
});

// GET ONE (public)
router.get('/:id', (req, res, next) => {
  getWorkoutById(Number(req.params.id))
    .then(w => res.json(w))
    .catch(next);
});

// UPDATE (only creator)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const workout = await getWorkoutById(id);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.createdById !== req.user.userId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const updated = await updateWorkout(id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE (only creator)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const workout = await getWorkoutById(id);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.createdById !== req.user.userId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const deleted = await deleteWorkout(id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

// UPVOTE (public or you can also protect with authMiddleware if you want)
router.post('/:id/upvote', (req, res, next) => {
  upvoteWorkout(Number(req.params.id))
    .then(w => res.json(w))
    .catch(next);
});

// DOWNVOTE (public or protected)
router.post('/:id/downvote', (req, res, next) => {
  downvoteWorkout(Number(req.params.id))
    .then(w => res.json(w))
    .catch(next);
});

// ADD COMMENT (public for now)
router.post('/:id/comments', (req, res, next) => {
  const data = {
    workoutId: Number(req.params.id),
    text: req.body.text,
    userId: req.body.userId || null,
  };

  createComment(data)
    .then(c => res.status(201).json(c))
    .catch(next);
});

// GET COMMENTS (public)
router.get('/:id/comments', (req, res, next) => {
  getComments(Number(req.params.id))
    .then(c => res.json(c))
    .catch(next);
});

module.exports = router;
