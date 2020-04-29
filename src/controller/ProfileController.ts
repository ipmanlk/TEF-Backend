import { ProfileDao } from "../dao/ProfileDao";

class ProfileController {
    static async getOne(session) {
        const profile = await ProfileDao.getOne(session.data.userId).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            data: profile
        };
    }
}

export default ProfileController;