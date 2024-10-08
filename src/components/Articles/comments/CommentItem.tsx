"use client";

import { useState } from "react";
import Image from "next/image";
import CommentControls from "./CommentControls";
import CommentForm from "./CommentForm";
import Link from "next/link";
import FixTextDirection from "@/components/shared/FixTextDirection";
import CreatedAt from "./CreatedAt";
import { TComment, TypeJWTPayload } from "@/types";

type TProps = {
  comment: TComment & {
    user: {
      profilePicture: string | null;
      userName: string;
    };
  };
  user: TypeJWTPayload | null;
};

const CommentItem = ({ comment, user }: TProps) => {
  const [isEditComment, setIsEditComment] = useState(false);

  return (
    <div className="comment_wrapper mt-1 flex items-start gap-0.5 p-1 md:gap-1 md:p-2">
      <div className="flex-shrink-0">
        <Link
          href={`/profile/${comment.userId === user?.id ? "" : comment.userId}`}
        >
          <Image
            src={comment.user.profilePicture ?? "/anonymous_user.svg"}
            alt={"user"}
            width={48}
            height={48}
            className="aspect-square w-12 rounded-full border bg-slate-100 object-cover object-top shadow-sm"
            loading="lazy"
          />
        </Link>
      </div>

      {!isEditComment ? (
        <div className="z-10 grow rounded border border-gray-200 bg-gray-100 p-2 md:p-3">
          <div className="mb-1.5 flex flex-wrap items-center justify-between">
            <b className="shrink-0 text-sm md:text-base">
              {comment.user.userName}
            </b>

            <CreatedAt createdAt={comment.createdAt} />
          </div>

          <div className="mb-3 break-all text-sm font-normal text-gray-700 md:text-base">
            <FixTextDirection text={comment.content} />
          </div>

          {user && comment.userId === user.id && (
            <CommentControls
              commentId={comment.id}
              setIsEditComment={setIsEditComment}
            />
          )}
        </div>
      ) : (
        <CommentForm
          onCancelEdit={setIsEditComment}
          status="update"
          commentId={comment.id}
          prevValue={comment.content}
        />
      )}
    </div>
  );
};

export default CommentItem;
