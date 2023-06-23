import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const StockAppComponent = () => {
  const [stockBids, setStockBids] = useState({});
  const [orderTable, setOrderTable] = useState([]);

  useEffect(() => {
    const client = new W3CWebSocket('ws://localhost:8001/stockWebSocket');

    client.onopen = () => {
      console.log('Connected to WebSocket');
      client.send('Apple');
      client.send('IBM');
      client.send('Zensar');
    };

    client.onmessage = (message) => {
      const stockPricesJson = message.data;
      const stockPrices = JSON.parse(stockPricesJson);

      if (Array.isArray(stockPrices) && stockPrices.length > 0) {
        const receivedStockBids = {};
        const stockNames = ['Apple', 'IBM', 'Zensar'];
        stockPrices.slice(0, 3).forEach((stock, index) => {
          receivedStockBids[stockNames[index]] = stock;
        });
        setStockBids(receivedStockBids);

        if (stockPrices.length > 3) {
          const receivedOrderTable = stockPrices[3];
          setOrderTable(receivedOrderTable);
        }
      }
    };

    return () => {
      client.close();
    };
  }, []);

  const StockTable = ({ stockName, bids }) => {
    const [fontColor, setFontColor] = useState('black');

    useEffect(() => {
      if (bids && bids.length > 0) {
        setFontColor('red');
        const timeout = setTimeout(() => {
          setFontColor('black');
        }, 1000);

        return () => clearTimeout(timeout);
      }
    }, [bids]);

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
                  <td style={{ border: '1px solid black', padding: '5px', color: fontColor }}>{bid.bidPrice}</td>
                  <td style={{ border: '1px solid black', padding: '5px', color: fontColor }}>{bid.askPrice}</td>
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

  const OrderTable = () => (
    <div >
      <center>
        <h2>Order Table</h2>
        <table>
          <thead>
            <tr>
              <th>Stock Name</th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <th>Bid Price</th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <th>Ask Price</th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {orderTable.map((order, index) => (
              <tr key={index}>
                <td>{order.stockName}</td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <td>{order.bidPrice}</td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <td>{order.askPrice}</td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <td>{order.dateTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );

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
      <OrderTable />
    </div>
  );
};

export default StockAppComponent;
