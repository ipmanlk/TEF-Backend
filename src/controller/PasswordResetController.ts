require("dotenv").config();

import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { SMSController } from "./SMSController";
const crypto = require("crypto");

export class PasswordResetController {
	private static state = {} as any;

	static async startPasswordReset(username: String) {
		const user = await getRepository(User).findOne({
			where: { username: username },
			relations: ["employee"],
		});

		if (!user) {
			throw {
				status: false,
				type: "input",
				msg: "Unable to find a user with that username!",
			};
		}

		// assign random number to state with username
		const randomNumber = Math.floor(Math.random() * 90000) + 10000;
		this.state[user.username] = randomNumber;

		// send sms
		// fix mobile number for international code
		const mobileNumber =
			"+94" + user.employee.mobile.trim().slice(1, user.employee.mobile.length);
		try {
			await SMSController.sendSMS(
				mobileNumber,
				`TwoElephantsFireworks confirmation code: ${randomNumber}`
			);
		} catch (error) {
			throw error;
		}

		// clear verification code after 5 min
		setTimeout(() => {
			delete this.state[user.username];
		}, 480000);

		return {
			status: true,
			msg: "Verification has been sent!",
		};
	}

	static async verifyPasswordResetCode(username: string, verifyCode: number) {
		if (!this.state[username]) {
			throw {
				status: false,
				type: "input",
				msg: "Please request a verify code first!",
			};
		}

		if (this.state[username] != verifyCode) {
			throw {
				status: false,
				type: "input",
				msg: "Invalid verification code!. Please check again.",
			};
		}

		return {
			status: true,
			msg: "You have been verified!",
		};
	}

	static async resetPassword(
		username: string,
		verifyCode: number,
		newPassword: string
	) {
		if (!this.state[username]) {
			throw {
				status: false,
				type: "input",
				msg: "Please request a verify code first!",
			};
		}

		if (this.state[username] != verifyCode) {
			throw {
				status: false,
				type: "input",
				msg: "Invalid verification code!. Please check again.",
			};
		}

		try {
			// update user password
			const user = await getRepository(User).findOne({
				where: { username: username },
				relations: ["employee"],
			});

			user.password = crypto
				.createHash("sha512")
				.update(`${newPassword}${process.env.SALT}`)
				.digest("hex");

			await getRepository(User).save(user);

			return {
				status: true,
				msg: "Password has been updated!",
			};
		} catch (e) {
			console.log(e);
			throw {
				status: false,
				type: "server",
				msg: "Failed to update the password!.",
			};
		}
	}
}
