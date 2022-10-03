type WSConfig = {
	pairs: string[],
	opType: string[],
	wsURL: string,
}

export type ExecutionEnvironmentConfig = WSConfig & {
	sleep: boolean,
	interval: number
	apiPort: number | string
	serverUrl: string
	testing: boolean
}

export const INITIAL_CONFIG: ExecutionEnvironmentConfig = {
	pairs: ['BTCUSD', 'ETHUSD'],
	opType: ['BUY', 'SELL'],
	wsURL: 'wss://api-pub.bitfinex.com/ws/2',
	sleep: false,
	interval: 0,
	apiPort: 3000,
	serverUrl: 'http://localhost:3000',
	testing: false
}

export function environmentConfig(): ExecutionEnvironmentConfig {
	if (process.env.CONFIG === 'DEV') { return INITIAL_CONFIG }

	return {
		pairs: ['BTCUSD', 'ETHUSD'],
		opType: ['BUY', 'SELL'],
		wsURL: 'wss://api-pub.bitfinex.com/ws/2',
		sleep: false,
		interval: 0,
		apiPort: 3000,
		serverUrl: 'http://localhost:3000',
		testing: false
	}
}