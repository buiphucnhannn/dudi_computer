import { BaseRepository } from "./baseRepository.js";
import { Category } from "../models/Category.js";

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findAllWithParent() {
    return await this.model.find().populate("parent").sort({ order: 1, name: 1 }).exec();
  }

  async findBySlug(slug) {
    return await this.findOne({ slug });
  }

  async findByNameOrSlug(identifier) {
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    return await this.model.findOne({
      $or: [
        { slug: identifier },
        { name: { $regex: identifier, $options: "i" } },
        ...(isObjectId ? [{ _id: identifier }] : []),
      ],
    }).exec();
  }
}

export const categoryRepository = new CategoryRepository();
