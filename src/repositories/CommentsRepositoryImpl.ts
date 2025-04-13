import { injectable } from "inversify";
import { CommentsRepository } from "./CommentsRepository.js";
import { IComment } from "../interfaces/IComment.js";
import Comment from "../models/Comment.js";

@injectable()
export class CommentsRepositoryImpl extends CommentsRepository {
  async createComment(comment: IComment): Promise<IComment> {
    return await Comment.create(comment);
  }

  async getCommentsByBookId(
    bookId: string,
    page: number,
    limit: number,
  ): Promise<IComment[]> {
    return Comment.find({ bookId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("userId", "username")
      .lean();
  }

  async countCommentsByBookId(bookId: string): Promise<number> {
    return Comment.countDocuments({ bookId });
  }

  async deleteCommentsByBookId(bookId: string): Promise<void> {
    await Comment.deleteMany({ bookId });
  }
}
