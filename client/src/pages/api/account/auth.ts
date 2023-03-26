import { withSessionRoute } from "@/lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(auth);

async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { address, email, phone } = req.body;
    req.session.user = {
      address,
      email,
      phone,
    };

    await req.session.save();

    res.status(200).json({
      status: "ok",
      msg: "Session Updated",
      data: req.session.user,
    });
  } else {
    res.status(500).json({
      status: "error",
      msg: "Invalid Method Type",
    });
  }
}
