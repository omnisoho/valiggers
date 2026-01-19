const prisma = require('../src/models/prismaClient');

// Seed Persons
const persons = [
  { email: 'alice@example.com', name: 'Alice' },
  { email: 'bob@example.com', name: 'Bob' },
  { email: 'carol@example.com', name: 'Carol' },
  { email: 'dave@example.com', name: 'Dave' },
  { email: 'eve@example.com', name: 'Eve' },
  { email: 'frank@example.com', name: 'Frank' },
  { email: 'grace@example.com', name: 'Grace' },
  { email: 'heidi@example.com', name: 'Heidi' },
  { email: 'ivan@example.com', name: 'Ivan' },
  { email: 'judy@example.com', name: 'Judy' },
  { email: 'mallory@example.com', name: 'Mallory' },
  { email: 'oscar@example.com', name: 'Oscar' },
  { email: 'peggy@example.com', name: 'Peggy' },
  { email: 'trent@example.com', name: 'Trent' },
  { email: 'victor@example.com', name: 'Victor' },
  { email: 'walter@example.com', name: 'Walter' },
  { email: 'xavier@example.com', name: 'Xavier' },
  { email: 'yvonne@example.com', name: 'Yvonne' },
  { email: 'zara@example.com', name: 'Zara' },
  { email: 'leo@example.com', name: 'Leo' },
];

const exercises = [
  {
    name: "Squat",
    slug: "squat",
    shortDesc: "A fundamental lower-body movement focusing on quads and glutes.",
    longDesc: "The squat is a compound exercise that targets the quadriceps, hamstrings, and glutes.",
    bodyPart: "LEGS",
    equipment: "NONE",
    difficulty: "BEGINNER",
    imageUrl: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
    videoUrl: null,
  },
  {
    name: "Barbell Deadlift",
    slug: "barbell-deadlift",
    shortDesc: "A major strength-building lift targeting back and posterior chain.",
    longDesc: "Deadlifts build strength in the lower back, glutes, and hamstrings.",
    bodyPart: "BACK",
    equipment: "BARBELL",
    difficulty: "ADVANCED",
    imageUrl: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg",
    videoUrl: null,
  },
  {
    name: "Push-Up",
    slug: "push-up",
    shortDesc: "A classic bodyweight chest and triceps exercise.",
    longDesc: "Push-ups strengthen the chest, triceps, and core.",
    bodyPart: "CHEST",
    equipment: "NONE",
    difficulty: "BEGINNER",
    imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
    videoUrl: null,
  },
  {
    name: "Bicep Curl (Dumbbells)",
    slug: "bicep-curl-dumbbell",
    shortDesc: "Isolation exercise for developing biceps.",
    longDesc: "Perform standing curls while keeping elbows tight to isolate the biceps.",
    bodyPart: "ARMS",
    equipment: "DUMBBELLS",
    difficulty: "BEGINNER",
    imageUrl: "https://images.pexels.com/photos/3836860/pexels-photo-3836860.jpeg",
    videoUrl: null,
  },
  {
    name: "Shoulder Press (Dumbbells)",
    slug: "shoulder-press",
    shortDesc: "Overhead pressing movement for shoulders and triceps.",
    longDesc: "Press dumbbells overhead while keeping core braced.",
    bodyPart: "SHOULDERS",
    equipment: "DUMBBELLS",
    difficulty: "INTERMEDIATE",
    imageUrl: "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg",
    videoUrl: null,
  },
  {
    name: "Plank",
    slug: "plank",
    shortDesc: "Core isometric exercise that builds stability.",
    longDesc: "Hold a straight-line plank while engaging core muscles.",
    bodyPart: "ABS",
    equipment: "NONE",
    difficulty: "BEGINNER",
    imageUrl: "https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg",
    videoUrl: null,
  },
  {
    name: "Leg Press Machine",
    slug: "leg-press",
    shortDesc: "Machine-based lower body pressing movement.",
    longDesc: "Targets quads and glutes using the leg press machine.",
    bodyPart: "LEGS",
    equipment: "MACHINE",
    difficulty: "INTERMEDIATE",
    imageUrl: "https://images.pexels.com/photos/4265476/pexels-photo-4265476.jpeg",
    videoUrl: null,
  },
  {
    name: "Chest Press Machine",
    slug: "chest-press-machine",
    shortDesc: "Chest strengthening machine variation.",
    longDesc: "Press weight forward while keeping shoulders down.",
    bodyPart: "CHEST",
    equipment: "MACHINE",
    difficulty: "BEGINNER",
    imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
    videoUrl: null,
  },
  {
    name: "Bent Over Row",
    slug: "bent-over-row",
    shortDesc: "Back strengthening exercise targeting lats and mid-back.",
    longDesc: "Row a barbell or dumbbells while maintaining a flat back.",
    bodyPart: "BACK",
    equipment: "DUMBBELLS",
    difficulty: "INTERMEDIATE",
    imageUrl: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg",
    videoUrl: null,
  },
  {
    name: "Hip Thrust",
    slug: "hip-thrust",
    shortDesc: "Glute-focused movement great for strength and hypertrophy.",
    longDesc: "Drive hips upward while keeping chin tucked.",
    bodyPart: "BUTT_HIPS",
    equipment: "BARBELL",
    difficulty: "INTERMEDIATE",
    imageUrl: "https://images.pexels.com/photos/5327521/pexels-photo-5327521.jpeg",
    videoUrl: null,
  },
  {
    name: "Lat Pulldown",
    slug: "lat-pulldown",
    shortDesc: "Machine-based upper back/lat hypertrophy exercise.",
    longDesc: "Pull bar to chest while keeping torso upright.",
    bodyPart: "BACK",
    equipment: "MACHINE",
    difficulty: "BEGINNER",
    imageUrl: "https://images.pexels.com/photos/3836861/pexels-photo-3836861.jpeg",
    videoUrl: null,
  },
  {
    name: "Russian Twist",
    slug: "russian-twist",
    shortDesc: "Rotational core movement for obliques.",
    longDesc: "Twist torso from side to side while seated.",
    bodyPart: "ABS",
    equipment: "NONE",
    difficulty: "INTERMEDIATE",
    imageUrl: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg",
    videoUrl: null,
  },
  {
    name: "Lateral Raise",
    slug: "lateral-raise",
    shortDesc: "Shoulder isolation movement targeting medial delts.",
    longDesc: "Raise dumbbells to shoulder level with slight elbow bend.",
    bodyPart: "SHOULDERS",
    equipment: "DUMBBELLS",
    difficulty: "BEGINNER",
    imageUrl: "https://images.pexels.com/photos/3836860/pexels-photo-3836860.jpeg",
    videoUrl: null,
  },
  {
    name: "Lunges",
    slug: "lunges",
    shortDesc: "Lower body unilateral exercise improving balance & strength.",
    longDesc: "Step forward and lower until both knees are bent at 90 degrees.",
    bodyPart: "LEGS",
    equipment: "NONE",
    difficulty: "BEGINNER",
    imageUrl: "https://images.pexels.com/photos/3775581/pexels-photo-3775581.jpeg",
    videoUrl: null,
  },
  {
    name: "Burpees",
    slug: "burpees",
    shortDesc: "Full-body conditioning movement.",
    longDesc: "Combines squat, plank, and jump into one explosive rep.",
    bodyPart: "FULL_BODY",
    equipment: "NONE",
    difficulty: "ADVANCED",
    imageUrl: "https://images.pexels.com/photos/4761783/pexels-photo-4761783.jpeg",
    videoUrl: null,
  },
];

async function main() {
  // Insert Persons
  const insertedPersons = await prisma.person.createManyAndReturn({
    data: persons,
  });
  console.log(insertedPersons);

  // Insert something (existing)
  const insertedSomethings = await prisma.something.createManyAndReturn({
    data: [
      { name: 'Seed 1' },
      { name: 'Seed 2' },
    ],
  });
  console.log(insertedSomethings);

  // ⭐ Insert Exercises
  const insertedExercises = await prisma.exercise.createManyAndReturn({
    data: exercises,
  });
  console.log(insertedExercises);

  console.log('Seed data inserted successfully (Persons + Somethings + Exercises)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
