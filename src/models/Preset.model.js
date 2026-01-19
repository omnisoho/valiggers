const prisma = require("./prismaClient");

// GET all presets for a user
module.exports.getAllPresets = function getAllPresets(userId) {
  return prisma.preset.findMany({
    where: { userId },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { workout: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

// GET one preset (and verify owner at router level)
module.exports.getPresetById = function getPresetById(id) {
  return prisma.preset.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { workout: true }
      }
    }
  });
};

// CREATE preset
module.exports.createPreset = function createPreset(data, userId) {
  return prisma.preset.create({
    data: {
      name: data.name,
      totalDuration: data.totalDuration || null,
      difficulty: data.difficulty || null,
      notes: data.notes || "",
      userId,
      items: {
        create: data.items.map(item => ({
          workoutId: item.workoutId || null,
          customName: item.customName || null,
          customSets: item.customSets || null,
          customReps: item.customReps || null,
          customDurationMin: item.customDurationMin || null,
          customNotes: item.customNotes || null,
          order: item.order
        }))
      }
    },
    include: { items: true }
  });
};

// UPDATE preset
module.exports.updatePreset = async function updatePreset(id, data, userId) {

  // 1. GET preset first
  const preset = await prisma.preset.findUnique({ where: { id } });

  if (!preset) throw new Error("Preset not found");
  if (preset.userId !== userId) throw new Error("Not allowed");

  // 2. Delete all existing items
  await prisma.presetItem.deleteMany({
    where: { presetId: id }
  });

  // 3. Update preset
  return prisma.preset.update({
    where: { id },
    data: {
      name: data.name,
      totalDuration: data.totalDuration || null,
      difficulty: data.difficulty || null,
      notes: data.notes || "",
      items: {
        create: data.items.map(item => ({
          workoutId: item.workoutId || null,
          customName: item.customName || null,
          customSets: item.customSets || null,
          customReps: item.customReps || null,
          customDurationMin: item.customDurationMin || null,
          customNotes: item.customNotes || null,
          order: item.order
        }))
      }
    },
    include: { items: true }
  });
};

// DELETE preset
module.exports.deletePreset = async function deletePreset(id, userId) {

  const preset = await prisma.preset.findUnique({ where: { id } });

  if (!preset) throw new Error("Preset not found");
  if (preset.userId !== userId) throw new Error("Not allowed");

  return prisma.preset.delete({
    where: { id }
  });
};
