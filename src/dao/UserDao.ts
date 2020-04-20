import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class UserDao {
    static async search({ keyword = "", skip = 0 }) {
        const users = await getRepository(User)
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.employee", "e")
            .leftJoinAndSelect("u.role", "r")
            .leftJoinAndSelect("u.userStatus", "us")
            .leftJoinAndSelect("u.employeeCreated", "ec")
            .select([
                "e.id", "e.number", "u.id", "u.username", "u.docreation", "ec.id", "ec.number", "r.id", "r.name", "us.id", "us.name"
            ])
            .where("u.username LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("e.number LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("ec.number LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("u.docreation LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("us.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.name LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()

        return users;
    }
}