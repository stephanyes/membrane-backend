import fetch from 'node-fetch'
// This file is to test the server
export class Fetch {
	// E2E
	constructor(private serverURL: string) {}
	// In this particular case we dont need to post anything since the API doesn't allow that but 
	// perhaps in the future this will come handy
	async postObject(object: any, path: string): Promise<any> {
		const response = await fetch(this.serverURL + path, {
				method: 'POST',
				body: JSON.stringify(object),
				headers: {'Content-Type': 'application/json'}
		})
		if (response.status !== 200)
				throw await response.text()
		return await response.text()
	}

	async getObject(path: string): Promise<any> {
		const response = await fetch(this.serverURL + path, {
				method: 'GET'
		})
		if (response.status !== 200)
				throw await response.text()
		return await response.text()
	}
}