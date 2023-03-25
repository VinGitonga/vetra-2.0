import fileSchema from "@/schemas/file";
import redisClient from "@/utils/redis-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return saveFile(req, res);
  }
}

async function saveFile(req: NextApiRequest, res: NextApiResponse) {
  const redis = new redisClient();
  const client = redis.initClient();
  try {
    const fileRepo = (await client).fetchRepository(fileSchema);
    const fileDetails = req.body
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
      msg: "Bloc could not be added",
    });
  } finally {
    await redis.closeClient();
  }
}
