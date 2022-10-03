import {describe, expect, afterAll, it, beforeAll} from '@jest/globals';
import { Service } from "../service/Service";
import { Fetch } from '../utils/Fetch';
import { ApiStorage } from "../utils/ApiStorage";
import { ExecutionEnvironmentConfig, INITIAL_CONFIG } from "../config/Environment";

describe("Testing the server", () => {
	let config: ExecutionEnvironmentConfig;
	let storage: ApiStorage;
	let ms: Service;
	let fetch: Fetch;

	beforeAll(async () => {
		try {
			config = INITIAL_CONFIG
			storage = new ApiStorage(config.pairs)
			ms = new Service(config, storage)
			fetch = new Fetch(config.serverUrl)

			await ms.start()
		} catch (error) {
			console.error("Error on beforeAll: ", error)
			throw error
		}
	})

	it("Testing fetch module", async () => {
		let server = ms.isServerOn()
		
		expect(server).toBe(true)
	})

	// it("Testing endpoint one", async () => {
	// 	const obj = fetch.getObject("/orderbook/BTCUSD")
	// 	console.log("obj ", obj)
	// 	// expect(obj).toBeNull(false)
	// })

	afterAll(async () => {
		await ms.stop()
	})
})

// Calls a funciones 