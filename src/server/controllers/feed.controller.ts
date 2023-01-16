import { TRPCError } from "@trpc/server";
import { getLinkPreview } from "link-preview-js";
import Parser from "rss-parser";

import { ApiError, HTTP_STATUS_CODE } from "../../utils/exceptions";
import {
  createFeed,
  deleteFeed,
  getAllFeeds,
  getFeedByUrl,
} from "../services/feed.service";
import { deleteFeedFromUser, getUserFeedByUrl } from "../services/user.service";

import type { LinkPreview } from "../../utils/types";
import type {
  CreateAndConnectFeedInput,
  DeleteAndDisconnectFeedInput,
  GetWebsiteDetailsInput,
} from "../../utils/validation";

export const createFeedHandler = async ({
  url,
  email,
}: CreateAndConnectFeedInput) => {
  try {
    const isFeedExists = await getUserFeedByUrl({ url, email });
    if (isFeedExists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "You've already added this feed!",
      });
    }

    const response = await fetch(url);

    if (
      response.status !== HTTP_STATUS_CODE.OK ||
      !response.headers.get("content-type")?.includes("xml")
    ) {
      throw new ApiError(
        HTTP_STATUS_CODE.BAD_REQUEST,
        "Error occured! Please check your provided url and try again!",
      );
    }

    const feed = await createFeed({ url, email });

    return {
      status: "Success",
      message: `Successfully added feed!`,
      feed,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteFeedHandler = async ({
  url,
  email,
}: DeleteAndDisconnectFeedInput) => {
  try {
    const feed = await getFeedByUrl({ url });
    if (!feed) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Post with that ID not found",
      });
    }

    if (feed.users.length > 1) {
      await deleteFeedFromUser({ email, url });
    } else {
      await deleteFeed({ url });
    }

    return {
      status: "Success",
      message: `Successfully deleted feed!`,
      feed,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getFeedDetailsHandler = async ({
  url,
}: GetWebsiteDetailsInput) => {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(url);
    const { origin } = new URL(url);
    const website = (await getLinkPreview(origin)) as LinkPreview;

    return {
      status: "Success",
      feed: {
        title: feed.title ?? website.title,
        description: feed.description ?? website.description,
        image: website.images[0] ?? feed.image?.url,
        url: feed.link ?? website.url,
      },
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllFeedsHandler = async () => {
  try {
    const feeds = await getAllFeeds();

    return {
      status: "Success",
      feeds,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
