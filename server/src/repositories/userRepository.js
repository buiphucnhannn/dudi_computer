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
    const user = await this.findOne({ _id: id }, "", "-password");
    if (!user) return null;
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    delete userObj.refreshToken;
    const isSet = userObj.authType === "local" || Boolean(userObj.isPasswordSet);
    userObj.isPasswordSet = isSet;
    userObj.hasPassword = isSet;
    return userObj;
  }
}

export const userRepository = new UserRepository();
