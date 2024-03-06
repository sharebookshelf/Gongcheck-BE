import { Controller, Get, Req } from '@nestjs/common';
import { AnalysisService } from '../service/analysis.service';
import { Request } from 'express';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}
  @Get()
  async getAnalysisResult(@Req() request: Request) {
    const id: number = request.cookies['userId'];
    const data = await this.analysisService.getAnalysisResult(id);
    return { data, meta: {} };
  }
}
