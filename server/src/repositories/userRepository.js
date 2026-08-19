import { BaseRepository } from "./baseRepository.js";
import { User } from "../models/User.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async findByIdWithoutPassword(id) {
    return await this.findOne({ _id: id }, "", "-password");
  }
}

export const userRepository = new UserRepository();
