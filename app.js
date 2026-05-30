let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

let data = JSON.parse(localStorage.getItem("shifts") || "{}");

const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");

function renderCalendar() {
  calendar.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  monthLabel.innerText = firstDay.toLocaleString("en", { month: "long", year: "numeric" });

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateKey = `${currentYear}-${currentMonth + 1}-${i}`;

    const div = document.createElement("div");
    div.className = "day";

    const shift = data[dateKey];

    div.innerHTML = `
      <div>
        <div>${i}</div>
        <div class="shift">${shiftIcon(shift)}</div>
      </div>
    `;

    div.onclick = () => openModal(dateKey);

    calendar.appendChild(div);
  }
}

function shiftIcon(shift) {
  if (shift === "morning") return "☀️";
  if (shift === "evening") return "🌜";
  if (shift === "off") return "💤";
  return "";
}

function openModal(date) {
  selectedDate = date;
  document.getElementById("selectedDate").innerText = date;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function setShift(type) {
  data[selectedDate] = type;

  if (type === "morning" || type === "evening") {
    applyAutoShift(selectedDate, type);
  }

  localStorage.setItem("shifts", JSON.stringify(data));

  closeModal();
  renderCalendar();
}

// 🔥 الگوریتم یکی در میان
function applyAutoShift(startDate, type) {
  let [y, m, d] = startDate.split("-").map(Number);

  let currentType = type === "morning" ? "evening" : "morning";

  for (let i = d + 1; i <= 31; i++) {
    const key = `${y}-${m}-${i}`;

    if (data[key] === "off") break; // توقف اگر آف باشد
    if (data[key]) continue; // اگر دستی پر شده دست نزن

    data[key] = currentType;
    currentType = currentType === "morning" ? "evening" : "morning";
  }
}

// init
renderCalendar();
