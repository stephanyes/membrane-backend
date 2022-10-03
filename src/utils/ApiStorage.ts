import { BitfinexData } from "../types"

export class ApiStorage {
	public pairs: Map<string, any> = new Map()
	public orderbook: any = {}
	constructor(private allowedPairs: string[]) {
		for(let pair of this.allowedPairs) {
			this.orderbook[pair] = {bids: new Map(), asks: new Map()}
		}
	}
	
	public storePairCode(pairId: string, pair:string): void {
		if (!this.pairs.has(pairId)){
			this.pairs.set(pairId, pair)
		}
	}
	public getPairSymbol(pairId: string): string {
		return this.pairs.get(pairId)
	}
	public extractMessageInfo(wsMessage: any): BitfinexData {
		// if Length > 4 means its a snapshot and not an update
		let info = wsMessage[1].length > 4 ? wsMessage[1][0] : wsMessage[1]
		return {
			price: info[0],
			count: info[1],
			amount: info[2]
		}
	}

	public getInfo(pair: any, side: any): Map<string, any> {
		return side === 'bids' ? this.orderbook[pair].bids : this.orderbook[pair].asks
	}

	public getInfoXPrice(pair: any, side: any, price: any): BitfinexData {
		return side === 'bids' ? this.orderbook[pair].bids.get(price) : this.orderbook[pair].asks.get(price)
	}
	

	public storeBidAsk(pair:any, side:any, price: any, obj: any): void {
		return side === "bids" ? this.orderbook[pair].bids.set(price, obj) : this.orderbook[pair].asks.set(price, obj)
	}

	public deleteBidAsk(pair:any, side:any, price: any, obj: any): void {
		return side === 'bids' ? this.orderbook[pair].bids.delete(price) : this.orderbook[pair].asks.delete(price)
	}

	public destroyAll(): void {
		let temp = this.allowedPairs
		for (let pair in temp) {
			this.orderbook[pair].asks.clear()
			this.orderbook[pair].bids.clear()
		}
		this.pairs.clear()
	}
}