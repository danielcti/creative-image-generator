import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  try {
    if (!id.startsWith("cs_")) {
      throw Error("Incorrect CheckoutSession ID.");
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(id);

    const prisma = new PrismaClient();
    const session = await prisma.stripeSession.findUnique({
      where: {
        sessionId: id,
      },
    });

    if (session) {
      res
        .status(400)
        .json({ statusCode: 400, message: "Session already processed." });
    }

    await prisma.stripeSession.create({
      data: {
        sessionId: id,
      },
    });

    await prisma.user.update({
      where: {
        email: checkout_session.customer_email ?? "",
      },
      data: {
        credits: {
          increment: 1,
        },
      },
    });

    res.status(200).json(checkout_session);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err });
  }
}
