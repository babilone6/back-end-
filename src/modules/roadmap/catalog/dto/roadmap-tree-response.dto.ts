import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const subStepSchema = z.object({
  stepId: z.string(),
  title: z.string(),
  description: z.string(),
  link: z.string().url().optional(),
});

const stepSchema = z.object({
  stepId: z.string(),
  side: z.enum(["left", "right"]),
  title: z.string(),
  description: z.string(),
  isHead: z.boolean(),
  subSteps: z.array(subStepSchema),
});

export const roadmapTreeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  steps: z.array(stepSchema),
});

export class RoadmapTreeResponseDto extends createZodDto(roadmapTreeResponseSchema) {}
