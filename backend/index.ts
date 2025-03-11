import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors({ credentials: true, origin: true }));

app.get("/api/", async () => {
  try {
    await prisma.game.deleteMany({});
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/start", async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    await prisma.game.createMany({
      data: [
        {
          user: 1,
          square: 1,
          value: user1[0],
        },
        {
          user: 1,
          square: 2,
          value: user1[1],
        },
        {
          user: 1,
          square: 3,
          value: user1[2],
        },
        {
          user: 1,
          square: 4,
          value: user1[3],
        },
        {
          user: 1,
          square: 5,
          value: user1[4],
        },
        {
          user: 1,
          square: 6,
          value: user1[5],
        },
        {
          user: 1,
          square: 7,
          value: user1[6],
        },
        {
          user: 1,
          square: 8,
          value: user1[7],
        },
        {
          user: 1,
          square: 9,
          value: user1[8],
        },
        {
          user: 2,
          square: 1,
          value: user2[0],
        },
        {
          user: 2,
          square: 2,
          value: user2[1],
        },
        {
          user: 2,
          square: 3,
          value: user2[2],
        },
        {
          user: 2,
          square: 4,
          value: user2[3],
        },
        {
          user: 2,
          square: 5,
          value: user2[4],
        },
        {
          user: 2,
          square: 6,
          value: user2[5],
        },
        {
          user: 2,
          square: 7,
          value: user2[6],
        },
        {
          user: 2,
          square: 8,
          value: user2[7],
        },
        {
          user: 2,
          square: 9,
          value: user2[8],
        },
      ],
    });

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.put("/api/newturn/:num", async (req, res) => {
  const num = Number(req.params.num);

  try {
    await prisma.game.updateMany({
      where: {
        value: num,
      },
      data: {
        strikethrough: true,
      },
    });

    const result = await prisma.game.findMany({
      where: {
        strikethrough: true,
      },
      select: {
        user: true,
        square: true,
      },
    });

    const winner: number[] = findWinner(result);
    res.status(200).json(winner);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.delete("/api/finish", async (req, res) => {
  try {
    await prisma.game.deleteMany({});
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on localhost:${process.env.PORT || 3000}`);
});

const findWinner = (arr: any[]) => {
  const user1: any[] = [];
  const user2: any[] = [];
  const nums1: any[] = [];
  const nums2: any[] = [];
  const winner: number[] = [];
  arr.forEach((obj) => {
    if (obj.user === 1) {
      user1.push(obj);
    } else {
      user2.push(obj);
    }
  });

  user1.forEach((obj) => {
    nums1.push(obj.square);
  });
  user2.forEach((obj) => {
    nums2.push(obj.square);
  });

  if (
    (nums1.includes(1) && nums1.includes(2) && nums1.includes(3)) ||
    (nums1.includes(4) && nums1.includes(5) && nums1.includes(6)) ||
    (nums1.includes(7) && nums1.includes(8) && nums1.includes(9)) ||
    (nums1.includes(1) && nums1.includes(4) && nums1.includes(7)) ||
    (nums1.includes(2) && nums1.includes(5) && nums1.includes(8)) ||
    (nums1.includes(3) && nums1.includes(6) && nums1.includes(9))
  ) {
    winner.push(1);
  }
  if (
    (nums2.includes(1) && nums2.includes(2) && nums2.includes(3)) ||
    (nums2.includes(4) && nums2.includes(5) && nums2.includes(6)) ||
    (nums2.includes(7) && nums2.includes(8) && nums2.includes(9)) ||
    (nums2.includes(1) && nums2.includes(4) && nums2.includes(7)) ||
    (nums2.includes(2) && nums2.includes(5) && nums2.includes(8)) ||
    (nums2.includes(3) && nums2.includes(6) && nums2.includes(9))
  ) {
    winner.push(2);
  }

  return winner;
};
