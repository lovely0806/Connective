import type { NextApiRequest, NextApiResponse } from "next";
import { DAO } from "../../../lib/dao";
import {
  ProfileApiResponse,
  IApiResponseError,
} from "../../../types/apiResponseTypes";
import { ActivityFeed } from "../../../services/activity/activityFeed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //@ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      let users = await DAO.Discover.getAll();
      ActivityFeed.Discover.viewDiscover(user.id)
      res.status(200).json({ users } as ProfileApiResponse.IDiscoverProfiles);
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, error: e } as IApiResponseError);
  }
}
