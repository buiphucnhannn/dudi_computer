/**
 * BaseRepository cung cấp các hàm CRUD cơ bản dùng chung cho tất cả các Mongoose Model.
 * Giúp tái sử dụng code, giảm trùng lặp và tách biệt tầng dữ liệu khỏi Controller.
 */
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async insertMany(dataList) {
    return await this.model.insertMany(dataList);
  }

  async findById(id, populate = "") {
    let query = this.model.findById(id);
    if (populate) {
      query = query.populate(populate);
    }
    return await query.exec();
  }

  async findOne(filter = {}, populate = "", select = "") {
    let query = this.model.findOne(filter);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    return await query.exec();
  }

  async find(filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20, populate = "", select = "") {
    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    return await query.exec();
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter).exec();
  }

  async updateById(id, updateData, options = { new: true }) {
    return await this.model.findByIdAndUpdate(id, updateData, options).exec();
  }

  async update(id, updateData, options = { new: true }) {
    return await this.updateById(id, updateData, options);
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async deleteMany(filter = {}) {
    return await this.model.deleteMany(filter).exec();
  }
}
