import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const skillSearchResponseSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
  })
);

export class SkillSearchResponseDto extends createZodDto(skillSearchResponseSchema) {}
