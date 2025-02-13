import prisma from "@/lib/prisma";
import { Prisma, StatusTasks } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const DEFAULT_LIMIT = 10;
  const DEFAULT_OFFSET = 0;

  try {
    const url = new URL(req.url);

    const id = url.searchParams.get("id");
    const limit = Number(url.searchParams.get("limit")) || DEFAULT_LIMIT;
    const offset = Number(url.searchParams.get("offset")) || DEFAULT_OFFSET;
    const title = url.searchParams.get("title");

    const where: Prisma.taskWhereInput = {};

    if (id) {
      where.id = id;
    }

    if (title) {
      where.title = title;
    }

    const [tasks, count] = await Promise.all([
      await prisma.task.findMany({
        take: limit,
        skip: offset,
        where,
        orderBy: {
          createdAt: "desc",
        },
      }),

      await prisma.task.count({
        where,
      }),
    ]);

    const meta = {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: offset / limit + 1,
      perPage: limit || DEFAULT_LIMIT,
    };

    return NextResponse.json({ tasks, meta }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  const { title, description, status } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (status && !Object.values(StatusTasks).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const task = await prisma.task.create({
      data: { title, description, status },
    });

    return NextResponse.json(
      { message: "Task created successfully", task },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
