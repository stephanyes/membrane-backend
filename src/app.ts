import { environmentConfig } from "./config/Environment";
import { Service } from "./service/Service";
import { ApiStorage } from "./utils/ApiStorage";

async function main(): Promise<void> {
	const config = environmentConfig();
	const storage = new ApiStorage(config.pairs)
	const ms = new Service(config, storage)
	await ms.start()
}

main()