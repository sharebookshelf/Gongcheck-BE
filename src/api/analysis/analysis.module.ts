import { Module } from '@nestjs/common';
import { AnalysisController } from './controller/analysis.controller';
import { AnalysisService } from './service/analysis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
