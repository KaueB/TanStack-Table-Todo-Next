"use server";

import api from "@/lib/axios";
import { task } from "@prisma/client";
import { formSchema } from "./create-task";
import { z } from "zod";

interface getListTasksProps {
  limit?: number;
  offset?: number;
}

export async function getListTasks({
  limit = 10,
  offset = 0,
}: getListTasksProps): Promise<{
  data: task[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  error?: string;
}> {
  try {
    const res = await api.get<{
      tasks: task[];
      meta: {
        total: number;
        totalPages: number;
        currentPage: number;
        perPage: number;
      };
      error?: string;
    }>("/api/tasks", {
      params: {
        limit,
        offset,
      },
    });

    if (res.data.error) {
      return {
        data: [],
        meta: { total: 0, totalPages: 0, currentPage: 0, perPage: 0 },
        error: res.data.error,
      };
    }

    const data = res.data;

    return { data: data.tasks, meta: data.meta };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      data: [],
      meta: { total: 0, totalPages: 0, currentPage: 0, perPage: 0 },
      error: "Error fetching tasks",
    };
  }
}

export async function createTask(data: z.infer<typeof formSchema>) {
  try {
    const res = await api.post<{ message: string; task: task; error?: string }>(
      "/api/tasks",
      data
    );

    if (res.data.error) {
      return { error: res.data.error };
    }

    return { data: res.data };
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Error creating task" };
  }
}
