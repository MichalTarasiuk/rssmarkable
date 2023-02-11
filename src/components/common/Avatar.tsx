import { memo } from "react";
import { twMerge } from "tailwind-merge";

import AvatarIcon from "public/svg/avatar.svg";

interface AvatarProps {
  readonly image?: string | null | undefined;
  readonly name?: string | null | undefined;
  readonly isSmall?: boolean;
}

export const Avatar = memo<AvatarProps>(({ image, name, isSmall = false }) => {
  const sizeClassName = isSmall ? "h-10 w-10" : "h-14 w-14";

  console.log({ sizeClassName });

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={twMerge(`rounded-full`, sizeClassName)}
        src={image}
        alt=""
      />
    );
  }

  if (name) {
    return (
      <span
        className={twMerge(
          "inline-flex items-center justify-center rounded-full",
          sizeClassName,
          isSmall ? "text-lg" : "text-2xl",
        )}
        style={{ backgroundColor: "#fcce54" }}
      >
        <span className="font-medium leading-none text-white">{name[0]}</span>
      </span>
    );
  }

  return (
    <span
      className={twMerge(
        "inline-block overflow-hidden rounded-full bg-gray-100",
        sizeClassName,
      )}
    >
      <AvatarIcon className="h-full w-full text-gray-300" />
    </span>
  );
});

Avatar.displayName = "Avatar";
