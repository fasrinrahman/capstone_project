//TASK DATA
let tasks = [
  {
    id: 1,
    name: "Design UI",
    desc: "Create layout",
    priority: "high",
    status: "todo",
    date: "2026-03-10",
  },
  {
    id: 2,
    name: "Fix bugs",
    desc: "Resolve issues",
    priority: "medium",
    status: "in-progress",
    date: "2026-03-01",
  },
  {
    id: 3,
    name: "Deploy app",
    desc: "Production release",
    priority: "low",
    status: "done",
    date: "2026-02-20",
  },
];
// Fetch the data
function fetch(list = tasks) {
  const container = document.getElementById("tasks");

  // check for avilable task ? ok show : return no avilable
  if (list.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No tasks found</p>';
    return;
  }

  container.innerHTML = list
    .map(
      (t) => `
    <div class="bg-white p-4 rounded shadow hover:shadow-lg transition">

      <h3 class="font-bold ${t.status === "done" ? "line-through opacity-50" : ""}">
        ${t.name}
      </h3>

      <p class="text-sm text-gray-500">${t.desc}</p>

      <div class="flex justify-between mt-2 text-xs">
        <span class="px-2 py-1 rounded bg-gray-200">${t.priority}</span>
        <span class="px-2 py-1 rounded bg-blue-100">${t.status}</span>
      </div>

      <p class="text-xs mt-2">${t.date}</p>

      <div class="flex gap-2 mt-3">
        <button onclick="status(${t.id})" class="text-blue-600 text-sm">Update</button>
        <button onclick="del(${t.id})" class="text-red-500 text-sm">Delete</button>
      </div>

    </div>
  `,
    )
    .join("");

  stats();
}

// task status
function status(id) {
  const t = tasks.find((x) => x.id === id);

  if (t.status === "todo") {
    t.status = "in-progress";
  } else if (t.status === "in-progress") {
    t.status = "done";
  } else {
    t.status = "todo";
  }
  fetch();
}

// delete
function del(id) {
  tasks = tasks.filter((t) => t.id !== id);
  fetch();
}

// stats of tasks
function stats() {
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent = tasks.filter(
    (t) => t.status === "done",
  ).length;
  document.getElementById("inProgress").textContent = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;

  const today = new Date();
  document.getElementById("overdue").textContent = tasks.filter(
    (t) => new Date(t.date) < today && t.status !== "done",
  ).length;
}

// searching the task
document.getElementById("search").addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();
  fetch(
    tasks.filter(
      (t) =>
        t.name.toLowerCase().includes(val) ||
        t.desc.toLowerCase().includes(val),
    ),
  );
});

// switching between the tbs
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((b) => b.classList.remove("border-blue-500"));
    btn.classList.add("border-blue-500");

    const tab = btn.dataset.tab;

    if (tab === "all") return fetch();
    fetch(tasks.filter((t) => t.status === tab));
  });
});

// sorting option
document.getElementById("sort").addEventListener("change", (e) => {
  const val = e.target.value;

  if (val === "name") tasks.sort((a, b) => a.name.localeCompare(b.name));
  if (val === "date") tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (val === "priority") {
    const order = { low: 1, medium: 2, high: 3 };
    tasks.sort((a, b) => order[b.priority] - order[a.priority]);
  }

  fetch();
});

// modal of task adding
const modal = document.getElementById("modal");

document.getElementById("addBtn").onclick = () =>
  modal.classList.remove("hidden");
document.getElementById("close").onclick = () => modal.classList.add("hidden");

// adding the task by modal
document.getElementById("save").onclick = () => {
  const task = {
    id: Date.now(),
    name: document.getElementById("name").value,
    desc: document.getElementById("desc").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
    date: document.getElementById("date").value,
  };

  tasks.push(task);
  modal.classList.add("hidden");
  fetch();
};

// initialize the datas with fn
fetch();
