import { ApiStorage } from "../utils/ApiStorage";
import { ExecutionEnvironmentConfig } from "../config/Environment";
import { RestService } from "./Server";
import { Websocket } from "../websocket/Websocket";

export class Service {
	private restService?: RestService
	private webSocketService?: Websocket

	constructor(
		private config: ExecutionEnvironmentConfig,
		private storage: ApiStorage,
	) {}

	async start(): Promise<void> {
		if (this.restService)
			throw new Error("Server already started")

		console.log("Starting server :)")

		this.restService = new RestService(this.config, this.config, this.storage)
		if (!this.config.testing)
			this.webSocketService = new Websocket(this.config.wsURL, this.config.pairs, this.storage)

		await this.restService.start()
	}

	async stop(): Promise<void> {
		if (this.restService) {
			console.log("Server is being stopped ... :(")
			await this.restService.stop()
			if (!this.config.testing && this.webSocketService)
				await this.webSocketService.closeWs()
		} else {
			throw new Error("The server is already stopped.")
		}
	}

	public isServerOn(): boolean {
		return this.restService ? this.restService.isOn() : false
	}
}