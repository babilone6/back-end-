import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CatalogService } from "./catalog.service";

@ApiTags("catalog")
@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("directions/:slug")
  getTree(@Param("slug") slug: string) {
    return this.catalogService.getTree(slug);
  }

  @Get("skills")
  searchSkills(@Query("q") q: string) {
    return this.catalogService.searchSkills(q ?? "");
  }
}
