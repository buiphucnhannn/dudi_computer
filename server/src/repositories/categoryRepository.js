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
    if (!identifier) return null;

    if (typeof identifier === "object") {
      if (identifier._id) {
        const byObjId = await this.model.findById(identifier._id).exec();
        if (byObjId) return byObjId;
      }
      identifier = identifier.name || identifier.slug || "";
    }

    if (typeof identifier !== "string" || !identifier.trim()) return null;

    const trimmed = identifier.trim();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(trimmed);

    if (isObjectId) {
      const byId = await this.model.findById(trimmed).exec();
      if (byId) return byId;
    }

    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return await this.model.findOne({
      $or: [
        { slug: trimmed.toLowerCase() },
        { name: { $regex: new RegExp(`^${escaped}$`, "i") } },
        { name: { $regex: escaped, $options: "i" } },
      ],
    }).exec();
  }
}

export const categoryRepository = new CategoryRepository();
