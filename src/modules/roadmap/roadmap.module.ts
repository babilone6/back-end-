import { Module } from "@nestjs/common";
import { RoadmapController } from "./roadmap.controller";
import { RoadmapService } from "./roadmap.service";
import { CatalogModule } from "./catalog/catalog.module";

@Module({
  imports: [CatalogModule],
  controllers: [RoadmapController],
  providers: [RoadmapService],
})
export class RoadmapModule {}
