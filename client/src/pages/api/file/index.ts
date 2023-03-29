import { withSessionRoute } from "@/lib/withSession";
import fileSchema from "@/schemas/file";
import redisClient from "@/utils/redis-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return saveFile(req, res);
    case "GET":
      return getFiles(req, res);
    default:
      return res.status(405).json({
        status: "error",
        msg: "Method not allowed",
      });
  }
}

async function saveFile(req: NextApiRequest, res: NextApiResponse) {
  const redis = new redisClient();
  const client = redis.initClient();
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({
      status: "error",
      msg: "You are not authenticated",
    });
  }
  try {
    const fileRepo = (await client).fetchRepository(fileSchema);
    const fileDetails = req.body;
    const newFile = fileRepo.createEntity(fileDetails);
    await fileRepo.save(newFile);
    res.status(200).json({
      status: "ok",
      data: newFile,
      msg: "File Bloc created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "File details could not be added",
    });
  } finally {
    await redis.closeClient();
  }
}

async function getFiles(req: NextApiRequest, res: NextApiResponse) {
  const redis = new redisClient();
  const client = redis.initClient();
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({
      status: "error",
      msg: "You are not authenticated",
    });
  }
  try {
    const fileRepo = (await client).fetchRepository(fileSchema);
    await fileRepo.createIndex();

    const files = await fileRepo
      .search()
      .where("ownerAddress")
      .equals(user.address)
      .return.all();

    res.status(200).json({
      status: "ok",
      data: files,
      msg: "Files fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Files could not be fetched at the moment",
    });
  } finally {
    await redis.closeClient();
  }
}
