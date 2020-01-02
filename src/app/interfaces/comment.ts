export interface RootComment {
    songCommentId: string;
    comment: Comment;
}

export interface Comment {
    writing?: boolean;
    commentId?: string;
    author: string;
    text: string;
    comments?: Comment[];
    createdAt?: string;
    updatedAt?: string;
}
