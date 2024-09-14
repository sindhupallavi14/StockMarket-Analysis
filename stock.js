const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];

const listContainer = document.getElementById('list');

// list section
async function fetchStockData() {
    try {
        const response = await fetch('https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata');
        const data = await response.json();
        return data.stocksStatsData[0];
    } 
    catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
}

async function createStockItem(stock, stockData) {
    const stockDiv = document.createElement('div');
    stockDiv.className = 'stock-item';

    const button = document.createElement('button');
    button.textContent = stock;
    button.className = 'stock-button';

    const bookVal = document.createElement('span');
    bookVal.className = 'stock-price';

    const profit = document.createElement('span');
    profit.className = 'stock-change';

    stockDiv.appendChild(button);
    stockDiv.appendChild(bookVal);
    stockDiv.appendChild(profit);

    listContainer.appendChild(stockDiv);

    if (stockData && stockData[stock]) {
        bookVal.textContent = `$${stockData[stock].bookValue.toFixed(3)}`;
       
        profit.textContent = `${(stockData[stock].profit).toFixed(2)}%`;
        if (profit.textContent === "0.00%") {
            profit.style.color = 'red'; 
        } 
     }

     button.addEventListener('click', () => {
        updateChartForStock(stock, '5y'); 
        updatedetail(stock);
    }); 
    
    
}


async function initializeStocks() {
    const stockData = await fetchStockData();
   
    stocks.forEach((stock, index) => {
        setTimeout(() => {
            createStockItem(stock, stockData);
        }, index * 700); 
    });
    updateChart('5y');
    updatedetail('AAPL');
}
initializeStocks()


//chart section
let stockChart;
        async function fetchStockData1(stock) {
            try {
                const response = await fetch('https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata');
                const data = await response.json();
                return data.stocksData[0][stock];
                
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        }
         
        function updateChart(timeframe) {
            const selectedStock = document.querySelector('.stock-button')?.textContent || 'AAPL';            
            updateChartForStock(selectedStock, timeframe);
        }
        

        function updateChartForStock(stock, timeframe) {
            fetchStockData1(stock).then(stockData => {
                const value = stockData[timeframe].value;
                const timeStamp = stockData[timeframe].timeStamp;
                chartdisplay(value, timeStamp);
            });
        }
        

        function chartdisplay(value,timeStamp){
        const labels = timeStamp.map(ts => new Date(ts * 1000).toLocaleDateString());

        const ctx = document.getElementById('stockChart').getContext('2d');
        if(stockChart)
        {
            stockChart.destroy();
        }
         stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'AAPL Stock Price',
                    data: value,
                    fill: false,
                    borderColor: 'rgba(0, 255, 0, 1)', 
                    tension: 0,
                   
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)', 
                    pointBorderColor: 'rgba(0, 0, 0, 0)', 
                   
                }]
            },
            options: {
                scales: {
                    x: {
                        display: false 
                    },
                    y: {
                        display: false 
                    }
                },
                plugins: {
                    legend: {
                        display: false 
                    },
                    tooltip: {
                        enabled: true, 
                        mode: 'index', 
                        intersect: false, 
                        callbacks: {
                            label: function(tooltipItem) {
                                return  `AAPL : $${tooltipItem.raw.toFixed(2)}`; 
                            }
                        }
                    }
                }
            }
        });

        const verticalLine = document.getElementById('verticalLine');
        const chartContainer = document.querySelector('.chart-container');

        chartContainer.addEventListener('mousemove', (event) => {
            const chartArea = stockChart.chartArea;
            const canvasPosition = stockChart.canvas.getBoundingClientRect();
            const x = event.clientX - canvasPosition.left;

            if (x >= chartArea.left && x <= chartArea.right) {
                verticalLine.style.left = `${x}px`;
                verticalLine.style.display = 'block';
            } else {
                verticalLine.style.display = 'none';
            }
        });

        chartContainer.addEventListener('mouseleave', () => {
            verticalLine.style.display = 'none';
        });}
        
// detail section


async function fetchdetail(stock) {
    try {
        const response = await fetch('https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata');
        const data = await response.json();
        console.log(data.stocksProfileData[0][stock]);
        return data.stocksProfileData[0][stock];
        
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

function updatedetail(stock)
{

    fetchStockData().then(sdata => {
        if (sdata && sdata[stock]) {
            const dSection = document.getElementById('detail-heading'); 
            dSection.innerHTML = `
                <h3>${stock}</h3>
                <h4 style="color: green;"> ${(sdata[stock].profit).toFixed(5)}%</h4>
                <h4>$${(sdata[stock].bookValue).toFixed(3)}</h4>`;
        }
    })
   updatedetail1(stock);
}

function updatedetail1(stock)
{
    fetchdetail(stock).then(stkdata => {
        if (stkdata) {
            const detailSection = document.getElementById('det-sum'); 
            detailSection.innerHTML = `
                
                <p>${stkdata.summary}</p>`;
        }
    }); 
}


