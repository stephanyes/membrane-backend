import { ApiStorage } from "../utils/ApiStorage";
import ws from "ws";

const BTCUSD = "BTCUSD"
const ETHUSD = "ETHUSD"

export class Websocket {
	// Set websocket callbacks
	private ws = new ws(this.wsURL)
	constructor(
		readonly wsURL: string,
		readonly pairs: string[] = ['BTCUSD', 'ETHUSD'], // TODO extract from config
		public storage: ApiStorage,
		public isAlive: boolean = false,
		public connected: boolean = false,
		public connecting: boolean = false,
	) {
		this.wsOnMessage = this.wsOnMessage.bind(this)
		this.wsOnClose = this.wsOnClose.bind(this)
		this.wsOnOpen = this.wsOnOpen.bind(this)
		
		this.ws.on('message', this.wsOnMessage)
		this.ws.on('open', this.wsOnOpen)
		this.ws.on('close', this.wsOnClose)
	}

	wsOnMessage(message: any): void {
		message = JSON.parse(message)
		if (message.event) {
			if (message.pair) {
				this.storage.storePairCode(message.chanId, message.pair)
			}
			return
		}

		if (message[1] === 'hb') {
      return
    }

		let chanId = message[0]
		let msgInfo = this.storage.extractMessageInfo(message)
		let pairSymbol = this.storage.getPairSymbol(chanId)
		let side = msgInfo.amount >= '0' ? 'bids' : 'asks' // Bitfinex docs https://docs.bitfinex.com/reference/ws-public-books

		//if count = 0 we have to delete the price level
		if (!msgInfo.count) {
			if (msgInfo.amount > '0') {
				if (pairSymbol === BTCUSD) {
					this.storage.deleteBidAsk(pairSymbol, side, msgInfo.price, msgInfo)
				} else {
					this.storage.deleteBidAsk(pairSymbol, side, msgInfo.price, msgInfo)
				}
			} else if (msgInfo.amount < '0') {
				if (pairSymbol === BTCUSD) {
					this.storage.deleteBidAsk(pairSymbol, side, msgInfo.price, msgInfo)
				} else {
					this.storage.deleteBidAsk(pairSymbol, side, msgInfo.price, msgInfo)
				}
			}
		} else {
			msgInfo.amount = Math.abs(parseInt(msgInfo.amount)).toString()
			if (side === "bids") {
				if (pairSymbol === BTCUSD){
					this.storage.storeBidAsk(pairSymbol, side, msgInfo.price, msgInfo)
				} else {
					this.storage.storeBidAsk(pairSymbol, side, msgInfo.price, msgInfo)
				}
			} else {
				if (pairSymbol === BTCUSD) {
					this.storage.storeBidAsk(pairSymbol, side, msgInfo.price, msgInfo)
				} else {
					this.storage.storeBidAsk(pairSymbol, side, msgInfo.price, msgInfo)
				}
			}
		}
	}
	wsOnClose(message: any): void {
		this.storage.destroyAll()
		this.closeWs()
	}
	wsOnOpen(): void {
		this.connecting = false
		this.connected = true
		const firstPair = this.createMessage(this.pairs[0], "subscribe", "book", "P0")
		const secondPair = this.createMessage(this.pairs[1], "subscribe", "book", "P0")
		// Here we subscribe to those two channels
		this.ws.send(firstPair)
		this.ws.send(secondPair)
	}

	async closeWs(): Promise<void> {
		this.ws.terminate()
		this.connected = false;
		this.connecting = false;
		this.isAlive = false;
		console.log("WS Close");
	}
	
	private createMessage(pair: any, event: string, channel: string, prec: string): string {
		const msg = {
			event: event,
			channel: channel,
			pair: pair,
			prec: prec
		}
		return JSON.stringify(msg)
	}
}