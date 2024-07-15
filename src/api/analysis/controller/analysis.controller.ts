import { Controller, Get, Session } from '@nestjs/common';
import { AnalysisService } from '../service/analysis.service';
import { UserIdNotFoundException } from 'src/exceptions/userIdNotFound.exception';

@Controller('users/me/books/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  async getAnalysisResult(@Session() session: Record<string, any>) {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    const data = await this.analysisService.getAnalysisResult(userId);
    return { data, meta: {} };
  }

  @Get('type')
  async getAnalysisType(@Session() session: Record<string, any>) {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    const data = await this.analysisService.getAnalysisType(userId);
    return data;
  }
}
