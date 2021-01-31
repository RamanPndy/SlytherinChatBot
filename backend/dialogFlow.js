const dialogflow = require('dialogflow');
const fs = require('fs');

const LANGUAGE_CODE = 'en-US'

class DialogFlow {
	constructor () {
        let config = this.getConfig()
        this.projectId = config.credentials.project_id

		this.sessionClient = new dialogflow.SessionsClient(config)
		this.contextClient = new dialogflow.v2.ContextsClient(config);
	}

    getConfig() {
		if (fs.existsSync('secrets.json')) {
			let secrets = fs.readFileSync('secrets.json');
			let config = JSON.parse(secrets);
			return {
				credentials: {
					project_id: config.project_id,
					private_key: config.private_key,
					client_email: config.client_email
				}
			};
		} else {
			throw new Error("Dialogflow secrets file not found.")
		}  
    }

	async sendTextMessageToDialogFlow(textMessage, sessionId) {
		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		// The text query request.
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: LANGUAGE_CODE
				}
			}
		}
		try {
			let responses = await this.sessionClient.detectIntent(request)
			return responses
		}
		catch(err) {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		}
	}

	async getContextParameters (sessionId, contextName) {
		const formattedContextName = this.contextClient.contextPath(this.projectId, sessionId, contextName);
		try {
			let responses = await this.contextClient.getContext({name: formattedContextName})
			return responses[0]["parameters"]["fields"]
		}
		catch(err) {
			console.error("Dialogflow getcontext ERROR:", err)
			throw err
		}
	}

	async triggerEvent(eventName, sessionId) {
		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		// The text query request.
		const request = {
			session: sessionPath,
			queryInput: {
			  event: {
				name: eventName,  
				languageCode: LANGUAGE_CODE
			  },
			},
		  };
		try {
			let responses = await this.sessionClient.detectIntent(request)
			return responses
		}
		catch(err) {
			console.error('DialogFlow.triggerEvent ERROR:', err);
			throw err
		}
	}
}

module.exports = DialogFlow;