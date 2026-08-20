import { BaseRepository } from "./baseRepository.js";
import { Feedback } from "../models/Feedback.js";

export class FeedbackRepository extends BaseRepository {
  constructor() {
    super(Feedback);
  }
}

export const feedbackRepository = new FeedbackRepository();
