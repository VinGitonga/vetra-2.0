import { withSessionRoute } from "@/lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return auth(req, res);
    default:
      return res.status(405).json({
        status: "error",
        msg: "Method not allowed",
      });
  }
}

async function auth(req: NextApiRequest, res: NextApiResponse) {
  const { address, email, phone, secret } = req.body;
  req.session.user = {
    address,
    email,
    phone,
    secret,
  };

  await req.session.save();

  res.status(200).json({
    status: "ok",
    msg: "Session Updated",
    data: req.session.user,
  });
}
