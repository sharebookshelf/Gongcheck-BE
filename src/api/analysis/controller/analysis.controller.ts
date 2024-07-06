import { Controller, Get, Session } from '@nestjs/common';
import { AnalysisService } from '../service/analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}
  @Get()
  async getAnalysisResult(@Session() session: Record<string, any>) {
    // const id: number = request.cookies['userId'];
    const userId = session.userId;
    const data = await this.analysisService.getAnalysisResult(userId);
    return { data, meta: {} };
  }
}
