import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class UserDao {
    static async search({ keyword }) {
        const users = await getRepository(User)
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.employee", "e")
            .leftJoinAndSelect("u.role", "r")
            .leftJoinAndSelect("u.userStatus", "us")
            .leftJoinAndSelect("u.employeeCreated", "ec")
            .select("u.id")
            .addSelect("u.username")
            .addSelect("u.docreation")
            .addSelect("e.number")
            .addSelect("ec.number")
            .addSelect("r.name")
            .addSelect("us.name")
            .where("u.username LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("e.number LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("ec.number LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("u.docreation LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("us.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.name LIKE :keyword", { keyword: `%${keyword}%` })
            .getMany();

        return users;
    }
}