import { EntityRepository, Repository } from "typeorm";
import { Teacher } from "../entity/Teacher";

@EntityRepository(Teacher)
export class UserRepository extends Repository<Teacher> {
    findById(id: number) {
        return this.findOne({ id: id});
    }
}