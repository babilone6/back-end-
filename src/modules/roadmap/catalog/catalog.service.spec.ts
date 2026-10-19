import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { PrismaService } from "../../../prisma/prisma.service";

describe("CatalogService", () => {
  let service: CatalogService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      direction: { findUnique: jest.fn() },
      skill: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  it("returns tree for known direction", async () => {
    prisma.direction.findUnique.mockResolvedValue({
      id: "dir-1",
      title: "JavaScript",
    });

    prisma.skill.findMany.mockResolvedValue([
      {
        id: "skill-1",
        title: "Основы JS",
        children: [{ id: "skill-1-1", title: "Переменные", sourceUrl: "https://example.com" }],
      },
    ]);

    const result = await service.getTree("javascript");

    expect(result.name).toBe("JavaScript");
    expect(result.steps[0].isHead).toBe(true);
    expect(result.steps[0].subSteps.length).toBe(1);
  });

  it("throws NotFoundException for unknown direction", async () => {
    prisma.direction.findUnique.mockResolvedValue(null);

    await expect(service.getTree("unknown")).rejects.toThrow(NotFoundException);
  });

  it("returns skill search results", async () => {
    prisma.skill.findMany.mockResolvedValue([{ id: "s1", title: "TypeScript" }]);

    const result = await service.searchSkills("type");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("TypeScript");
  });
});
