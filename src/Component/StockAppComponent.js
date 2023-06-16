import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const StockAppComponent = () => {
  const [stockBids, setStockBids] = useState({});

  useEffect(() => {
    const client = new W3CWebSocket('ws://localhost:8001/stockWebSocket');

    client.onopen = () => {
      console.log('Connected to WebSocket');
      const stocks = ['Apple', 'IBM', 'Zensar'];
      stocks.forEach((stock) => client.send(stock));
    };

    client.onmessage = (message) => {
      const stockPricesJson = message.data;
      const stockPrices = JSON.parse(stockPricesJson);
      setStockBids(stockPrices);
      console.log(stockPrices);
    };

    return () => {
      client.close();
    };
  }, []);

  const StockTable = ({ stockName, bids }) => {
    return (
      <div style={{ display: 'inline-block', margin: '50px' }}>
        {bids && bids.length > 0 ? (
          <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '5px' }}>Bid Price</th>
                <th style={{ border: '1px solid black', padding: '5px' }}>Ask Price</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{bid.bidPrice}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{bid.askPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bids available</p>
        )}
      </div>
    );
  };

  return (
    <div style={{ backgroundImage: 'url("https://img.freepik.com/premium-vector/business-candle-stick-graph-chart-stock-market-investment-trading-white-background-design-bullish-point-trend-graph-vector-illustration_41981-1777.jpg?w=2000")', backgroundSize: 'cover', minHeight: '100vh' }}>
      <h2>Bid Price and Ask Price</h2>
      <div>
        <h2>
          Apple &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          IBM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Zensar
        </h2>
        {Object.entries(stockBids).map(([stockName, bids]) => (
          <StockTable key={stockName} stockName={stockName} bids={bids} />
        ))}
      </div>
    </div>
  );
};

export default StockAppComponent;
