import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class UserDao {
    static async search({ keyword = "", skip = 0 }) {
        const users = await getRepository(User)
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.employee", "e")
            .leftJoinAndSelect("u.userStatus", "us")
            .leftJoinAndSelect("u.employeeCreated", "ec")
            .select([
                "e.id", "e.number", "u.id", "u.username", "u.addedDate", "ec.id", "ec.number", "us.id", "us.name",
            ])
            .leftJoinAndSelect("u.userRoles", "ur")
            .leftJoinAndSelect("ur.role", "r")
            .where("u.username LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("e.number LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("ec.number LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("u.addedDate LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("us.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orderBy("e.id")
            .skip(skip)
            .take(15)
            .getMany()

        return users;
    }
}