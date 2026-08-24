import { BaseRepository } from "./baseRepository.js";
import { Brand } from "../models/Brand.js";

class BrandRepository extends BaseRepository {
  constructor() {
    super(Brand);
  }

  async findAll(query = {}) {
    return await this.model.find(query).sort({ order: 1, name: 1 }).lean();
  }

  async findBySlug(slug) {
    return await this.findOne({ slug });
  }

  async findByName(name) {
    return await this.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
  }
}

export const brandRepository = new BrandRepository();
