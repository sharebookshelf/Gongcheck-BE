import { Body, Controller, Post, Session } from '@nestjs/common';
import { FleaService } from './flea.service';
import { UploadInfoDto } from './dto/upload-info.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('flea')
export class FleaController {
  constructor(private readonly fleaService: FleaService) {}

  @Post('upload')
  async create(
    @Body() surveyDto: UploadInfoDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = uuidv4();
    session.userId = userId;

    console.log(surveyDto);

    await this.fleaService.upload(surveyDto, userId);
    // return { message: 'successfully updated survey' };
  }
}
