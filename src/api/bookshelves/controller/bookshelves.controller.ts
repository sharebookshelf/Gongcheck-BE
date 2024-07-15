import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Session,
  Req,
  Get,
  Query,
  Delete,
  // ParseFilePipe,
  // FileTypeValidator,
} from '@nestjs/common';
import { BookshelvesService } from '../service/bookshelves.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookshelfDto } from '../dto/create-bookshelf.dto';
import { FileSaveInterceptor } from '../interceptor/fileSaveInterceptor';
import { UserIdNotFoundException } from 'src/exceptions/userIdNotFound.exception';
import { DeleteBookshelfDto } from '../dto/delete-bookshelf.dto';

@Controller('bookshelves')
export class BookshelvesController {
  constructor(private readonly bookshelvesService: BookshelvesService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('bookshelfImages'),
    FileSaveInterceptor,
    TransactionInterceptor,
  )
  async fetchAiData(
    @Body() createBookshelfDto: CreateBookshelfDto,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Session() session: Record<string, any>,
    @Req() request: Request,
  ) {
    const filepaths = request['filepaths'];
    console.log(filepaths);
    const userId = uuidv4();
    session.userId = userId;

    await this.bookshelvesService.sendFile(
      createBookshelfDto,
      userId,
      files,
      filepaths,
    );

    return { message: 'success upload bookshelf' };
  }

  @Get()
  async getPosts(
    @Query('page') page: number,
    @Query('sort') sort: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    let order = {};
    if (sort === 'createdAt') {
      order = { createdAt: 'DESC' };
    } else if (sort === 'likeCount') {
      order = { likeCount: 'DESC' };
    }

    return this.bookshelvesService.getPosts(page, order);
  }

  @Delete()
  async deletePost(
    @Body() deleteBookshelfDto: DeleteBookshelfDto,
    @Session() session: Record<string, any>,
  ) {
    const { postId, password } = deleteBookshelfDto;

    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    await this.bookshelvesService.deletePost(postId, password);
    return { message: 'delete bookshelf success' };
  }
}
