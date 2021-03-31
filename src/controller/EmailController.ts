import * as nodemailer from "nodemailer";
export class EmailController {
	static async sendMail(
		receivers: Array<String> = [],
		subject: string = "",
		text: string = "",
		html: string = ""
	) {
		try {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: "2elephantsfireworks@gmail.com",
					pass: "F@#!qt%v8^24Q$Ds*owB37Cni@58XK",
				},
				debug: false,
				logger: false,
			});

			for (let receiver of receivers) {
				// send mail with defined transport object
				let info = await transporter.sendMail({
					from: "2elephantsfireworks@gmail.com", // sender address
					to: receiver,
					subject: subject,
					text: text,
					html: html,
				});

				console.log("Message sent: %s", info.messageId);

				return {
					status: true,
					data: info,
				};
			}
		} catch (e) {
			console.log(e);
			return {
				status: false,
				type: "server",
				msg: "Unable to send mail!.",
			};
		}
	}
}
