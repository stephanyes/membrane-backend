import { ExecutionEnvironmentConfig } from "../config/Environment";
import { Ask, Bid, BitfinexData, ExecutedOrder, Order, Orderbook } from "../types";
import { ApiStorage } from "../utils/ApiStorage";

export const isValidPair = (pairId: string, allowedPairs: string[]): boolean => {
	return allowedPairs.some(pair => pairId === pair)
}

const isValidOperation = (opType: string, allowedOp: string[]): boolean => {
	return allowedOp.some(op => opType === op)
}

const isValidAmount = (amount: string): boolean => {
	return parseInt(amount) < 0 ? false : true
}

export const canPerform = (pair: string, opType: string, amount: string, config: ExecutionEnvironmentConfig): boolean => {
	if (isValidPair(pair, config.pairs) && isValidOperation(opType, config.opType) && isValidAmount(amount))
		return true
	return false
}

export const orderbook = (pairId: string, storage: ApiStorage): Orderbook => {
	const bestBid = getBestBidPair(pairId, storage)
	const bestAsk = getBestAskPair(pairId, storage)
	return { bestBid, bestAsk, pair: pairId }
}

const getBestBidPair = (pairId: string, storage: ApiStorage): Bid | undefined => {
	const bidsArr = Array.from((storage.getInfo(pairId, 'bids')).values())
	const result = getBestBidAsk(bidsArr, pairId)
	return result
}

const getBestAskPair = (pairId: string, storage: ApiStorage): Ask | undefined => {
	const asksArr = Array.from((storage.getInfo(pairId, 'asks')).values())
	const result = getBestBidAsk(asksArr, pairId)
	return result
}

const getBestBidAsk = (data: any[], pairId: string): BitfinexData | undefined => {
	const ids = data.map(object => object.price);
	const bestPrice = Math.max(...ids)
	// Extracting the tip of the orderbook and filtering undefined values
	const extract = data.map((obj) => bestPrice === obj.price && obj).filter((value) => value !== undefined && value)
	if (extract.length > 0) {
		const { price, count, amount } = extract[0]
		return { price, count, amount }
	}
}	

export const executeOrder = (order: Order, storage: ApiStorage): ExecutedOrder => {
	let dataStorage;
	if (order.opType === "BUY") {
		dataStorage = Array.from((storage.getInfo(order.pair, 'asks')).values()).sort((a, b) => a.price < b.price ? -1 : 1)
	} else {
		dataStorage = Array.from((storage.getInfo(order.pair, 'bids')).values()).sort((a, b) => a.price > b.price ? -1 : 1)
	}
	const sizeArr: number = dataStorage.length
	let anchorAmount: number = parseInt(order.amount)

	let obj: ExecutedOrder = {
		filledOrders: [],
		avgPrice: 0
	}
	if (sizeArr != 0) {
		for(let i = 0; i <= sizeArr; i++) {
			const orderFromArr = dataStorage[i]
			
			//Filled order
			if (orderFromArr.amount >= anchorAmount) {
				obj.filledOrders.push(orderFromArr)
				obj.avgPrice = ((obj.avgPrice + orderFromArr.price) / obj.filledOrders.length)
				return obj
			}
			//Partially filled order
			if(orderFromArr.amount < anchorAmount) {
				obj.filledOrders.push(orderFromArr)
				anchorAmount = anchorAmount - orderFromArr.amount
				obj.avgPrice = obj.avgPrice + orderFromArr.price
			}
		}
		return obj
	}
	return obj
}