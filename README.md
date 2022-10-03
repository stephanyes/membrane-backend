
# Membrane Senior backend challenge


## Prerequisites

### Node 16 LTS

### Installation

    ~$ git clone https://github.com/stephanyes/membrane-backend.git
    cd membrane-backend
    npm install
    
    
# Description
## Market status API Rest
The goal of this project is to create a public API REST that retrieves market information for trading
pairs.

Specifications:
1) Use Express framework to set up the server.
2) The API should expose two endpoints:
    - One that receives a pair name, and retrieves the tips of the orderbook (i.e. the
better prices for bid-ask). Response should include both the total amounts and
prices. 
    - Other endpoint that is called with the pair name, the operation type (buy/sell) and
the amount to be traded. Should return the effective price that will result if the
order is executed (i.e. evaluate [Market Depth](https://www.investopedia.com/terms/m/marketdepth.asp)).
3) API should return market values for the following pairs: BTC-USD and ETH-USD. We expect
to handle unexpected pairs.

This engine must be written in Node.js and it must use websockets, without persistent storage. It
should also support a HTTP interface to fetch the endpoints.

For this particular case I'm using Bitfinex API -> [Public Websocket](https://docs.bitfinex.com/reference/rest-public-platform-status#ws-public-books)
 

## Prepare the environment

In `Environment.ts` you can either add or modify the `ExecutionEnvironmentConfig` object to bootstrap de app. There is a default configuration in case no `process.env.CONFIG` exists

    process.env.CONFIG = "DEV"

## Start the server
    npm run dev

## Run the tests (not working)

    npm run test
