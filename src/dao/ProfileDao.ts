import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class ProfileDao {
    static getOne(userId) {
        return getRepository(User)
            .createQueryBuilder("u")
            .select([
                "u.id", "u.username", "u.addedDate", "u.description"
            ])
            .whereInIds([userId])
            .leftJoinAndSelect("u.employee", "e")
            .leftJoinAndSelect("e.gender", "g")
            .leftJoinAndSelect("e.designation", "de")
            .leftJoinAndSelect("e.employeeStatus", "es")
            .leftJoinAndSelect("e.civilStatus", "cv")
            .leftJoinAndSelect("u.userRoles", "ur")
            .leftJoinAndSelect("ur.role", "r")
            .leftJoinAndSelect("u.userStatus", "us")
            .leftJoinAndSelect("r.privileges", "p")
            .leftJoinAndSelect("p.module", "m")
            .getOne()
    }
}