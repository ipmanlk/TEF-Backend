import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class ProfileDao {
    static getOne(userId) {
        return getRepository(User)
            .createQueryBuilder("u")
            .select([
                "u.id", "u.username", "u.docreation", "u.description"
            ])
            .whereInIds([userId])
            .leftJoinAndSelect("u.employee", "e")
            .leftJoinAndSelect("u.role", "r")
            .leftJoinAndSelect("u.userStatus", "us")
            .leftJoinAndSelect("r.privileges", "p")
            .leftJoinAndSelect("p.module", "m")
            .getOne()
    }
}