export interface BitfinexData {
	price: string
	count: string
	amount: string
}

export type Bid = BitfinexData | undefined
export type Ask = BitfinexData | undefined

export type Orderbook = {
	bestBid: Bid
	bestAsk: Ask
	pair: string
}

export type Order = {
	pair: string
	opType: string
	amount: string
}

export type ExecutedOrder = {
	filledOrders: BitfinexData[]
	avgPrice: number
}