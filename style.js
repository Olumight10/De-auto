// // Must be in a module script or .mjs file
// import jsonData from './Gold_1MN.json' assert { type: 'json' };
// console.log(jsonData);




const tableBody = document.querySelector('.table-container tbody');
const dashboard = document.getElementById('dashboard');
const timeFilter = document.getElementById('time-filter');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const applyBtn = document.getElementById('apply-custom');

let allTrades = [];

function formatTimestamp(ms, mt5Offset = -1) {
  const date = new Date(ms);
  date.setTime(date.getTime() + mt5Offset * 3600000);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  let hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${year}-${month}-${day} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

function renderTable(data) {
  tableBody.innerHTML = '';
  data.forEach(trade => {
    const profitClass = trade.status === 'profit' ? 'profit' : 'loss';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="col-entime">${formatTimestamp(trade.entry_time)}</td>
      <td class="col-enprice">${trade.entry_price}</td>
      <td class="col-type">${trade.type}</td>
      <td class="col-extime">${formatTimestamp(trade.exit_time)}</td>
      <td class="col-exprice">${trade.exit_price}</td>
      <td class="col-netprofit ${profitClass}">${trade.net_profit}</td>
    `;
    row.addEventListener('click', () => renderDashboard(trade));
    tableBody.appendChild(row);
  });
}


function filterByTime(option) {
  const now = new Date();
  let filtered = [];

  if (option === 'yesterday') {
    const start = new Date(now);
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    filtered = allTrades.filter(t => new Date(t.entry_time) >= start && new Date(t.entry_time) <= end);
  }

  else if (option === 'last-week') {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    filtered = allTrades.filter(t => new Date(t.entry_time) >= start);
  }

  else if (option === 'last-month') {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 1);
    filtered = allTrades.filter(t => new Date(t.entry_time) >= start);
  }

  else if (option === 'custom') {
    startDateInput.style.display = 'inline-block';
    endDateInput.style.display = 'inline-block';
    applyBtn.style.display = 'inline-block';
    return; // Don't re-render yet
  }

  else {
    filtered = allTrades;
  }

  renderTable(filtered);
}

// Apply custom date range
applyBtn.addEventListener('click', () => {
  const start = new Date(startDateInput.value);
  const end = new Date(endDateInput.value);
  const filtered = allTrades.filter(t => new Date(t.entry_time) >= start && new Date(t.entry_time) <= end);
  renderTable(filtered);
});

timeFilter.addEventListener('change', () => {
  // Hide custom inputs unless selected
  const custom = timeFilter.value === 'custom';
  startDateInput.style.display = custom ? 'inline-block' : 'none';
  endDateInput.style.display = custom ? 'inline-block' : 'none';
  applyBtn.style.display = custom ? 'inline-block' : 'none';

  if (!custom) filterByTime(timeFilter.value);
});

// function renderDashboard(trade) {
//   dashboard.innerHTML = `
//     <div class="first-row">
//       <div class="kpi first"><strong>Type</strong><div>${trade.type}</div></div>
//       <div class="kpi second"><strong>Net Profit</strong><div>${trade.net_profit}</div></div>
//     </div>
//     <div class="second-row">
//       <div class="kpi first "><strong>Entry Time</strong><div>${formatTimestamp(trade.entry_time)}</div></div>
//       <div class="kpi second"><strong>Entry Price</strong><div>${trade.entry_price}</div></div>
//     </div>
//     <div class="third-row">
//       <div class="kpi first"><strong>Exit Time</strong><div>${formatTimestamp(trade.exit_time)}</div></div>
//       <div class="kpi second"><strong>Exit Price</strong><div>${trade.exit_price}</div></div>
//     </div>
//   `;
// }
function renderDashboard(trade) {
  const dashboard = document.getElementById('dashboard');
  const whichClass = trade.status === 'profit' ? 'profit' : 'loss';
  // Fade-out effect
  dashboard.classList.add('fade-out');

  setTimeout(() => {
    dashboard.innerHTML = `
    <div class="first-row">
      <div class="kpi first"><strong>Type</strong><div>${trade.type}</div></div>
      <div class="kpi second "><strong>Net Profit</strong><div class="${whichClass}">${trade.net_profit}</div></div>
    </div>
    <div class="second-row">
      <div class="kpi first "><strong>Entry Time</strong><div>${formatTimestamp(trade.entry_time)}</div></div>
      <div class="kpi second"><strong>Entry Price</strong><div>${trade.entry_price}</div></div>
    </div>
    <div class="third-row">
      <div class="kpi first"><strong>Exit Time</strong><div>${formatTimestamp(trade.exit_time)}</div></div>
      <div class="kpi second"><strong>Exit Price</strong><div>${trade.exit_price}</div></div>
    </div>
    `;

    dashboard.classList.remove('fade-out');
    dashboard.classList.add('fade-in');

    // Scroll into view smoothly
    dashboard.scrollIntoView({ behavior: 'smooth' });

    // Clean up animation classes
    setTimeout(() => {
      dashboard.classList.remove('fade-in');
    }, 500);
  }, 300); // Match the CSS fade-out duration
}



function Analysis(all_data) {
  const analysis = document.getElementById('analysis');
  const noOfTrades = all_data.length;

  const netProfit = all_data.reduce((sum, trade) => sum + trade.profit, 0).toFixed(2);

  const wins = all_data.filter(t => t.result === "win").length;
  const losses = all_data.filter(t => t.result === "loss").length;

  analysis.innerHTML = `
    <div class="first-row">
      <div class="kpi first"><strong>No of Trades</strong><div>${noOfTrades}</div></div>
      <div class="kpi second"><strong>Net Profit</strong><div>${netProfit}</div></div>
    </div>
    <div class="first-row">
      <div class="kpi first"><strong>Wins</strong><div>${wins}</div></div>
      <div class="kpi second"><strong>Losses</strong><div>${losses}</div></div>
    </div>
  `;
}



document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("analysis.html")) {
    Analysis(allTrades);
  } 
});


// Initial load
fetch('./backtest_result.json')
  .then(res => res.json())
  .then(data => {
    allTrades = data.reverse(); // Reverse to show latest trade first
    renderTable(allTrades);
    if (allTrades.length > 0) {
      renderDashboard(allTrades[0]); // Show most recent trade in dashboard
    }
  })
  .catch(err => console.error("Failed to load JSON:", err));
