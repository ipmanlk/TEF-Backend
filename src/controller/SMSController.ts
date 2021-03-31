import { Twilio } from "twilio";

export class SMSController {
	private static accountSid = "ACb97b27d82096e4da8f6c3a3f807c7772";
	private static authToken = "4f7978d696cf7524b12e87d36581fd80";
	static async sendSMS(receiver: string, message: string) {
		try {
			var client = new Twilio(this.accountSid, this.authToken);

			const msg = await client.messages.create({
				body: message,
				to: receiver, // Text this number
				from: "+12513130359", // From a valid Twilio number
			});

			return {
				status: true,
				msg: "SMS has been sent!.",
			};
		} catch (e) {
			console.log(e);
			return {
				status: false,
				type: "server",
				msg: "Unable to send sms!.",
			};
		}
	}
}
