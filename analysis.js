// // Must be in a module script or .mjs file
// import jsonData from './Gold_1MN.json' assert { type: 'json' };
// console.log(jsonData);






let allTrades = [];




function Analysis(all_data) {
  const analysis = document.getElementById('analysis');
  // const noOfTrades = all_data.length;

  // // const netProfit = all_data.reduce((sum, trade) => sum + trade.net_profit, 0).toFixed(2);
  // const totalProfit = all_data
  // .filter(t => t.status === "profit")
  // .reduce((sum, t) => sum + Math.abs(t.net_profit), 0);

  // const totalLoss = all_data
  //   .filter(t => t.status === "loss")
  //   .reduce((sum, t) => sum + Math.abs(t.net_profit), 0);

  // const netProfit = (totalProfit - totalLoss).toFixed(2);

  // const wins = all_data.filter(t => t.status === "profit").length;
  // const losses = all_data.filter(t => t.status === "loss").length;
// OVERALL STATS
  const noOfTrades = all_data.length;

  const totalProfit = all_data
    .filter(t => t.status === "profit")
    .reduce((sum, t) => sum + Math.abs(t.net_profit), 0);

  const totalLoss = all_data
    .filter(t => t.status === "loss")
    .reduce((sum, t) => sum + Math.abs(t.net_profit), 0);

  const netProfit = (totalProfit - totalLoss).toFixed(2);

  const wins = all_data.filter(t => t.status === "profit").length;
  const losses = all_data.filter(t => t.status === "loss").length;

  // BUY STATS
  const buyTrades = all_data.filter(t => t.type === "Buy");

  const buyNoOfTrades = buyTrades.length;

  const buyWins = buyTrades.filter(t => t.status === "profit").length;
  const buyLosses = buyTrades.filter(t => t.status === "loss").length;

  const buyProfit = buyTrades
    .filter(t => t.status === "profit")
    .reduce((sum, t) => sum + Math.abs(t.net_profit), 0);

  const buyLoss = buyTrades
    .filter(t => t.status === "loss")
    .reduce((sum, t) => sum + Math.abs(t.net_profit), 0);

  const buyNetProfit = (buyProfit - buyLoss).toFixed(2);

  // SELL STATS
  const sellTrades = all_data.filter(t => t.type === "Sell");

  const sellNoOfTrades = sellTrades.length;

  const sellWins = sellTrades.filter(t => t.status === "profit").length;
  const sellLosses = sellTrades.filter(t => t.status === "loss").length;

  const sellProfit = sellTrades
    .filter(t => t.status === "profit")
    .reduce((sum, t) => sum + Math.abs(t.net_profit), 0);

  const sellLoss = sellTrades
    .filter(t => t.status === "loss")
    .reduce((sum, t) => sum + Math.abs(t.net_profit), 0);

  const sellNetProfit = (sellProfit - sellLoss).toFixed(2);


  analysis.innerHTML = `
    <div class="main_analysis">
      <p class="title">Overall Analysis</p>
      <div class="first-row">
        <div class="kpis first"><strong>No of Trades</strong><div>${noOfTrades}</div></div>
        <div class="kpis second"><strong>Net Profit</strong><div>${netProfit}</div></div>
      </div>
      <div class="first-row">
        <div class="kpis first"><strong>Wins</strong><div>${wins}</div></div>
        <div class="kpis second"><strong>Losses</strong><div>${losses}</div></div>
      </div>
    </div>
    <div class="more_analysis">
      <div class="buy-box">
        <p class="title">Buy Trades</p>
        <div class="first-row">
          <div class="kpis first"><strong>No of Trades</strong><div>${buyNoOfTrades}</div></div>
          <div class="kpis second"><strong>Net Profit</strong><div>${buyNetProfit}</div></div>
        </div>
        <div class="first-row">
          <div class="kpis first"><strong>Wins</strong><div>${buyWins}</div></div>
          <div class="kpis second"><strong>Losses</strong><div>${buyLosses}</div></div>
        </div>
      </div>
      <div class="sell-box">
        <p class="title">Sell Trades</p>
        <div class="first-row">
          <div class="kpis first"><strong>No of Trades</strong><div>${sellNoOfTrades}</div></div>
          <div class="kpis second"><strong>Net Profit</strong><div>${sellNetProfit}</div></div>
        </div>
        <div class="first-row">
          <div class="kpis first"><strong>Wins</strong><div>${sellWins}</div></div>
          <div class="kpis second"><strong>Losses</strong><div>${sellLosses}</div></div>
        </div>
      </div>
    </div>

  `;
}





// Initial load
fetch('./backtest_result.json')
  .then(res => res.json())
  .then(data => {
    allTrades = data;
    Analysis(allTrades);
  })
  .catch(err => console.error("Failed to load JSON:", err));
