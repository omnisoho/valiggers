const express = require('express');
const createError = require('http-errors');
const path = require('path');

const somethingRouter = require('./routers/Something.router');
const personRouter = require('./routers/Person.router');
const workoutRouter = require('./routers/Workout.router');
const ResourceRouter = require('./routers/Resource.router');
const resourceCategoryRouter = require('./routers/ResourceCategory.router');
const userRouter = require("./routers/userRoutes");
const nutritionRouter = require('./routers/nutrition.router')
const profileRoutes = require('./routers/profileRoutes');
const profileNotesRoutes = require('./routers/profileNotesRoutes');

//CA2 grocery list
const GroceryRoute = require('./routers/Grocery.router')


const authMiddleware = require("./middlewares/authMiddleware");
const presetRouter = require("./routers/Preset.router");
const weeklyPlanRouter = require("./routers/WeeklyPlan.router");
const statsRouter = require("./routers/Stats.router");
const exerciseRouter = require('./routers/Exercise.router');


const app = express();

app.use(express.json());

// Serve uploads folder
app.use('/uploads', express.static('uploads'));//nutrition Tracker change

app.use(express.static(path.join(__dirname, 'public')));

// 2️⃣ YOUR ROUTERS
app.use('/somethings', somethingRouter);
app.use('/persons', personRouter);

app.use('/workouts-api', workoutRouter);
app.use('/nutrition', nutritionRouter);//nutrition Tracker change

//CA2 grocery list route
app.use('/grocery', GroceryRoute);//nutrition Tracker change


// Presets API (authenticated)
app.use("/presets-api", authMiddleware, presetRouter);

// Weekly plan API (authenticated)
app.use("/weekplan-api", authMiddleware, weeklyPlanRouter);

// Stats API (public or authenticated — both okay)
app.use("/stats-api", statsRouter);


// 3️⃣ YOUR HTML ROUTES
app.get('/workout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'workOutTracker.html'));
});
app.get('/workouts', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'workouts.html'));
});
app.get('/plans', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'plans.html'));
});
app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});


app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/.well-known/*', (req, res) => res.status(204).end());
app.use('/resources', ResourceRouter);
app.use('/resource-categories', resourceCategoryRouter);

// Louis' Routes
app.use('/exercises', exerciseRouter);
app.use("/api/users", userRouter);
app.use('/api/profile', profileRoutes);
app.use('/api/notes', profileNotesRoutes);



// load cron jobs
require('./models/ResetCalories');


// 4️⃣ 404 HANDLER — MUST BE LAST
app.use((req, res, next) => {
  if (req.originalUrl === '/favicon.ico') return res.status(204).end();
  next(createError(404, `Unknown resource ${req.method} ${req.originalUrl}`));
});

// 5️⃣ ERROR HANDLER
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message });
});

// ...
module.exports = app;
