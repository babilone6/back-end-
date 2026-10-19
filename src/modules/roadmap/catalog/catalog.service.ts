import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import type { RoadmapTreeResponseDto } from "./dto/roadmap-tree-response.dto";
import type { SkillSearchResponseDto } from "./dto/skill-search-response.dto";

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getTree(directionSlug: string): Promise<RoadmapTreeResponseDto> {
    const direction = await this.prisma.direction.findUnique({
      where: { slug: directionSlug },
      select: {
        id: true,
        title: true,
      },
    });

    if (!direction) {
      throw new NotFoundException(`Direction "${directionSlug}" not found`);
    }

    const rootSkills = await this.prisma.skill.findMany({
      where: {
        directionId: direction.id,
        parentId: null,
      },
      include: {
        children: true,
      },
      orderBy: { title: "asc" },
    });

    return {
      id: direction.id,
      name: direction.title,
      description: "Описание направления",
      steps: rootSkills.map((skill: any) => ({
        stepId: skill.id,
        side: "right",
        title: skill.title,
        description: "Описание шага",
        isHead: skill.children.length > 0,
        subSteps: skill.children.map((child: any) => ({
          stepId: child.id,
          title: child.title,
          description: "Описание подшага",
          link: child.sourceUrl ?? undefined,
        })),
      })),
    };
  }

  async searchSkills(query: string): Promise<SkillSearchResponseDto> {
    const skills = await this.prisma.skill.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        title: true,
      },
      take: 20,
    });

    return skills as any;
  }
}
