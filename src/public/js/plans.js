// MODAL CONTROL
let presets = [];
let weeklyPlan = null;

let editingPreset = null;   // null = creating new
let presetItems = [];       // array of exercises in the current preset

// DOM references
const presetModalBackdrop = document.getElementById("presetModalBackdrop");
const presetModalCloseBtn = document.getElementById("presetModalCloseBtn");
const presetModalTitle = document.getElementById("presetModalTitle");
const presetsListEl = document.getElementById("presetsList");
const presetItemsListEl = document.getElementById("presetItemsList");

// form fields
const presetNameInput = document.getElementById("presetNameInput");
const presetDurationInput = document.getElementById("presetDurationInput");
const presetDifficultyInput = document.getElementById("presetDifficultyInput");
const presetNotesInput = document.getElementById("presetNotesInput");

// buttons
const savePresetBtn = document.getElementById("savePresetBtn");
const deletePresetBtn = document.getElementById("deletePresetBtn");
const createPresetBtn = document.getElementById("createPresetBtn");

const tooltip = document.getElementById("presetPreviewTooltip");

function showTooltip(html, x, y) {
  tooltip.innerHTML = html;
  tooltip.style.left = x + 15 + "px";
  tooltip.style.top = y + 15 + "px";
  tooltip.classList.add("visible");
}

function hideTooltip() {
  tooltip.classList.remove("visible");
}

function getPresetPreviewHTML(preset) {
  let html = `
    <div class="preview-title">${preset.name}</div>
  `;

  if (preset.totalDuration || preset.difficulty) {
    html += `<div class="preview-sub">`;

    if (preset.totalDuration)
      html += `⏱ ${preset.totalDuration} mins`;
    if (preset.difficulty)
      html += ` • 💢 Difficulty: ${preset.difficulty}`;

    html += `</div>`;
  }

  html += `<div class="preview-sub">Exercises:</div>`;

  preset.items.forEach((it) => {
    const name = it.customName || it.workout?.name || "Unnamed";
    const sets = it.customSets || it.workout?.sets || "";
    const reps = it.customReps || it.workout?.reps || "";

    html += `
      <div class="preview-item">
        ${name} 
        ${sets ? ` • ${sets} sets` : ""} 
        ${reps ? ` × ${reps} reps` : ""}
      </div>
    `;
  });

  return html;
}


// OPEN modal (create new preset)
function openCreatePresetModal() {
  editingPreset = null;
  presetItems = [];

  presetModalTitle.textContent = "Create new preset";

  presetNameInput.value = "";
  presetDurationInput.value = "";
  presetDifficultyInput.value = "";
  presetNotesInput.value = "";
  presetItemsListEl.innerHTML = "";

  deletePresetBtn.style.display = "none"; // cannot delete new preset

  presetModalBackdrop.classList.add("open");
}

async function openEditPresetModal(id) {
  editingPreset = presets.find(p => p.id === id);
  if (!editingPreset) return;

  presetModalTitle.textContent = "Edit preset";

  presetNameInput.value = editingPreset.name;
  presetDurationInput.value = editingPreset.totalDuration || "";
  presetDifficultyInput.value = editingPreset.difficulty || "";
  presetNotesInput.value = editingPreset.notes || "";

  presetItems = [...editingPreset.items]; // deep copy
  renderPresetItems();

  deletePresetBtn.style.display = "inline-flex";

  presetModalBackdrop.classList.add("open");
}

function renderPresetItems() {
  presetItemsListEl.innerHTML = "";

  if (presetItems.length === 0) {
    presetItemsListEl.innerHTML = `<div class="list-item">No exercises added yet.</div>`;
    return;
  }

  presetItems.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "list-item";

    const name = item.customName || item.workout?.name || "Unnamed exercise";
    const sets = item.customSets || item.workout?.sets || "";
    const reps = item.customReps || item.workout?.reps || "";

    el.innerHTML = `
      <div class="list-item-header">
        <div>
          <div class="list-title">${name}</div>
          <div class="list-meta">
            ${sets ? sets + " sets" : ""} 
            ${reps ? " × " + reps + " reps" : ""}
          </div>
        </div>

        <div style="display:flex; gap:6px;">
          <button class="btn-link" data-up="${index}">↑</button>
          <button class="btn-link" data-down="${index}">↓</button>
          <button class="btn-danger" data-del="${index}">Delete</button>
        </div>
      </div>
    `;

    presetItemsListEl.appendChild(el);
  });

  // reorder + delete handlers
  document.querySelectorAll("[data-up]").forEach(btn =>
    btn.addEventListener("click", () => moveItemUp(btn.dataset.up))
  );
  document.querySelectorAll("[data-down]").forEach(btn =>
    btn.addEventListener("click", () => moveItemDown(btn.dataset.down))
  );
  document.querySelectorAll("[data-del]").forEach(btn =>
    btn.addEventListener("click", () => deleteItem(btn.dataset.del))
  );
}

function moveItemUp(i) {
  i = Number(i);
  if (i <= 0) return;
  [presetItems[i - 1], presetItems[i]] = [presetItems[i], presetItems[i - 1]];
  renderPresetItems();
}

function moveItemDown(i) {
  i = Number(i);
  if (i >= presetItems.length - 1) return;
  [presetItems[i + 1], presetItems[i]] = [presetItems[i], presetItems[i + 1]];
  renderPresetItems();
}

function deleteItem(i) {
  presetItems.splice(i, 1);
  renderPresetItems();
}


// CLOSE modal
function closePresetModal() {
  presetModalBackdrop.classList.remove("open");
}

// Bind modal controls
if (createPresetBtn) createPresetBtn.addEventListener("click", openCreatePresetModal);
if (presetModalCloseBtn) presetModalCloseBtn.addEventListener("click", closePresetModal);

window.addEventListener("click", (e) => {
  if (e.target === presetModalBackdrop) closePresetModal(); // click outside to close
});

function renderPresets() {
  presetsListEl.innerHTML = "";

  if (!presets || presets.length === 0) {
    presetsListEl.innerHTML = `<div class="list-item">No presets created yet.</div>`;
    return;
  }

  presets.forEach((p) => {
    const item = document.createElement("div");
    item.className = "list-item fade-slide";

    item.innerHTML = `
      <div class="list-item-header">
        <div>
          <div class="list-title">${p.name}</div>
          <div class="list-meta">${p.items?.length || 0} exercises</div>
        </div>
        <button class="btn-link" data-edit="${p.id}">Edit</button>
      </div>
    `;

    presetsListEl.appendChild(item);

    // Proper animation
    setTimeout(() => item.classList.add("visible"), 20);
  });

  // bind edit buttons
  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-edit"));
      openEditPresetModal(id);
    });
  });
}



// =============================
// PLANS PAGE – BACKEND VERSION
// =============================

function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers ? { ...options.headers } : {};

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, { ...options, headers });
}

// -----------------------
// LOAD PRESETS FROM BACKEND
// -----------------------
async function loadPresets() {
  const res = await authFetch("/presets-api");

  if (res.status === 401) {
    alert("You must be logged in to use Plans.");
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// -----------------------
// LOAD WEEKLY PLAN
// -----------------------
async function loadWeeklyPlan() {
  const res = await authFetch("/weekplan-api");

  if (res.status === 401) {
    alert("You must be logged in to use Plans.");
    return null;
  }

  const data = await res.json();
  return data && typeof data === "object" ? data : null;
}

// -----------------------
// SAVE A DAY CHANGE
// -----------------------
async function saveDay(dayKey, presetId) {
  await authFetch(`/weekplan-api/day/${dayKey}`, {
    method: "PUT",
    body: JSON.stringify({ presetId }),
  });
}

// -----------------------
// RESET ENTIRE WEEKLY PLAN
// -----------------------
async function resetPlan() {
  await authFetch("/weekplan-api", { method: "DELETE" });
}

// -----------------------
// POPULATE SELECT DROPDOWNS
// -----------------------
function populateDropdowns() {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  days.forEach((day) => {
    const select = document.getElementById(`${day}Select`);
    if (!select) return;

    select.innerHTML = `
      <option value="">-- No preset --</option>
    `;

    if (!Array.isArray(presets)) return;

    presets.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    });

    const presetId = weeklyPlan?.[`${day}Id`] || "";
    select.value = presetId || "";
  });
}

// -----------------------
// BIND EVENT LISTENERS
// -----------------------
function bindEvents() {
  const dayKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  dayKeys.forEach((day) => {
    const select = document.getElementById(`${day}Select`);
    if (select) {
      select.addEventListener("change", async () => {
        const presetId = select.value ? Number(select.value) : null;
        await saveDay(day, presetId);
      });
    }
  });

  const resetBtn = document.getElementById("resetPlanBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      if (!confirm("Reset weekly plan?")) return;

      await resetPlan();
      weeklyPlan = await loadWeeklyPlan();
      populateDropdowns();
    });
  }
}

document.getElementById("addCustomItemBtn").addEventListener("click", () => {
  const name = document.getElementById("customNameInput").value.trim();
  const sets = Number(document.getElementById("customSetsInput").value);
  const reps = Number(document.getElementById("customRepsInput").value);
  const dur = Number(document.getElementById("customDurationInput").value);
  const notes = document.getElementById("customNotesInput").value.trim();

  if (!name || !sets || !reps) {
    alert("Please enter name, sets, and reps.");
    return;
  }

  presetItems.push({
    customName: name,
    customSets: sets,
    customReps: reps,
    customDurationMin: dur || null,
    customNotes: notes || null
  });

  renderPresetItems();

  document.getElementById("customNameInput").value = "";
  document.getElementById("customSetsInput").value = "";
  document.getElementById("customRepsInput").value = "";
  document.getElementById("customDurationInput").value = "";
  document.getElementById("customNotesInput").value = "";
});

let workoutLibrary = [];

async function loadLibrary() {
  const res = await fetch("/workouts-api");
  const data = await res.json();
  workoutLibrary = Array.isArray(data) ? data : [];
  renderLibraryResults();
}

function renderLibraryResults() {
  const search = document.getElementById("librarySearchInput").value.toLowerCase();
  const muscle = document.getElementById("libraryMuscleFilter").value;

  const list = document.getElementById("libraryResultsList");
  list.innerHTML = "";

  const filtered = workoutLibrary.filter(w => {
    return (
      (!muscle || w.muscleGroup === muscle) &&
      (w.name.toLowerCase().includes(search))
    );
  });

  filtered.forEach(w => {
    const item = document.createElement("div");
    item.className = "list-item";
    
    item.innerHTML = `
      <div class="list-item-header">
        <div>
          <div class="list-title">${w.name}</div>
          <div class="list-meta">${w.muscleGroup}</div>
        </div>
        <button class="btn-link" data-add-workout="${w.id}">Add</button>
      </div>
    `;

    list.appendChild(item);
  });

  document.querySelectorAll("[data-add-workout]").forEach(btn => {
    btn.addEventListener("click", () => {
      const workoutId = Number(btn.getAttribute("data-add-workout"));
      const workout = workoutLibrary.find(w => w.id === workoutId);

      presetItems.push({
        workoutId,
        workout
      });

      renderPresetItems();
    });
  });
}

async function savePreset() {
  const name = presetNameInput.value.trim();
  if (!name) {
    alert("Preset name is required.");
    return;
  }

  const data = {
    name,
    totalDuration: presetDurationInput.value ? Number(presetDurationInput.value) : null,
    difficulty: presetDifficultyInput.value ? Number(presetDifficultyInput.value) : null,
    notes: presetNotesInput.value.trim(),
    items: presetItems.map((item, index) => ({
      ...item,
      order: index
    }))
  };

  let res;

  if (!editingPreset) {
    // CREATE
    res = await authFetch("/presets-api", {
      method: "POST",
      body: JSON.stringify(data)
    });
  } else {
    // UPDATE
    res = await authFetch(`/presets-api/${editingPreset.id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  if (!res.ok) {
    alert("Error saving preset.");
    return;
  }

  closePresetModal();

  presets = await loadPresets();
  renderPresets();
  populateDropdowns(); // update weekly plan dropdowns
}

deletePresetBtn.addEventListener("click", async () => {
  if (!editingPreset) return;

  if (!confirm("Delete this preset?")) return;

  await authFetch(`/presets-api/${editingPreset.id}`, {
    method: "DELETE"
  });

  closePresetModal();

  presets = await loadPresets();
  renderPresets();
  populateDropdowns();
});


function initSearchableDropdowns() {
  document.querySelectorAll(".searchable-select").forEach(wrapper => {
    const day = wrapper.getAttribute("data-day");
    const input = wrapper.querySelector("input");
    const list = wrapper.querySelector(".searchable-options");

    function refreshList() {
      const query = input.value.toLowerCase();
      list.innerHTML = "";

      list.style.display = "block";

      // default option
      const none = document.createElement("div");
      none.textContent = "-- No preset --";
      none.addEventListener("click", async () => {
        input.value = "";
        list.style.display = "none";
        await saveDay(day, null);
      });
      list.appendChild(none);

      presets
  .filter(p => p.name.toLowerCase().includes(query))
  .forEach(preset => {
    const div = document.createElement("div");
    div.textContent = preset.name;

    // CLICK = assign preset to day
    div.addEventListener("click", async () => {
      input.value = preset.name;
      list.style.display = "none";
      await saveDay(day, preset.id);
    });

    // HOVER PREVIEW — show tooltip
    div.addEventListener("mouseenter", (e) => {
      const html = getPresetPreviewHTML(preset);
      showTooltip(html, e.clientX, e.clientY);
    });

    // MOVE tooltip with cursor
    div.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY + 15 + "px";
    });

    // HIDE tooltip when leaving
    div.addEventListener("mouseleave", hideTooltip);

    list.appendChild(div);
  });

    }

    input.addEventListener("input", refreshList);

    input.addEventListener("focus", refreshList);

    document.addEventListener("click", e => {
      if (!wrapper.contains(e.target)) list.style.display = "none";
    });
  });
}

savePresetBtn.addEventListener("click", savePreset);
document.getElementById("librarySearchInput").addEventListener("input", renderLibraryResults);
document.getElementById("libraryMuscleFilter").addEventListener("change", renderLibraryResults);

// -----------------------
// INITIALIZE PAGE
// -----------------------
document.addEventListener("DOMContentLoaded", async () => {
  await loadLibrary();       // Workout library
  presets = await loadPresets();
  weeklyPlan = await loadWeeklyPlan();

  renderPresets();
  populateDropdowns();
  bindEvents();
  initSearchableDropdowns();
});

