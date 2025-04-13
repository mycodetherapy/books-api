import { IComment } from "../interfaces/IComment.js";

export abstract class CommentsRepository {
  abstract createComment(comment: IComment): Promise<IComment>;
  abstract getCommentsByBookId(
    bookId: string,
    page: number,
    limit: number,
  ): Promise<IComment[]>;
  abstract countCommentsByBookId(bookId: string): Promise<number>;
  abstract deleteCommentsByBookId(bookId: string): Promise<void>;
}
