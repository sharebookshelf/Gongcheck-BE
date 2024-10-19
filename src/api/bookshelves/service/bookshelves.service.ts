import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBook, UserInfo } from '../interface/createBook';
// import { data } from '../data';
import { CreateBookshelfDto } from '../dto/create-bookshelf.dto';
import { BookshelvesRepository } from '../repository/bookshelves.repository';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Like } from 'src/entities/like.entity';
// import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { kes_data } from '../kes_data';

@Injectable()
export class BookshelvesService {
  constructor(
    private readonly bookshelvesRepository: BookshelvesRepository,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Like)
    private likeRepository: Repository<Post>,
    private configService: ConfigService,
  ) {}

  async sendFile(
    createBookshelfDto: CreateBookshelfDto,
    userId: string,
    files: Array<Express.Multer.File>,
    filepaths: string[],
    filenames: string[],
  ): Promise<any> {
    // console.log(files);
    const formData = new FormData();
    files.forEach((file) => {
      const blob = new Blob([file.buffer]);
      formData.append('files', blob, file.originalname);
      // formData.append('files', file.buffer, file.originalname);
    });

    // const apiUrl = this.configService.get('API_HOST');
    const userInfo: UserInfo = {
      nickname: createBookshelfDto.nickname,
      birth: createBookshelfDto.birth,
      gender: createBookshelfDto.gender,
      userId,
    };
    console.log(userInfo);

    try {
      // Axios POST 요청
      // const response: AxiosResponse = await axios.post(apiUrl, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // const data = response.data;
      const data = filenames
        .map((filename) => kes_data[filename])
        .filter((item) => item !== undefined);

      await this.bookshelvesRepository.createUser(userInfo);

      // const userId: number = insertUserInfo.generatedMaps[0].userId;

      let books: Array<CreateBook> = [];
      let bookIds: Array<number> = [];

      let i = 0;
      for (const file of data) {
        // const result = file;
        // const url = file.file_url;
        const url = filepaths[i];
        // console.log(url);
        books = [];
        bookIds = [];
        console.log(file.length);

        // 하나의 bookshelf 저장
        await this.bookshelvesRepository.createBookshelf(url, userId);

        for (const res of file) {
          const {
            title,
            author,
            publisher,
            // img_url,
            ea_add_code,
            set_add_code,
            ea_isbn,
            set_isbn,
          } = res;

          const book: CreateBook = {
            title,
            author,
            publisher,
            titleUrl: '',
            eaAddCode: ea_add_code,
            setAddCode: set_add_code,
            eaIsbn: ea_isbn,
            setIsbn: set_isbn,
          };
          books.push(book);
        }
        i += 1;
        const { createdBook, existingBookIds } =
          await this.bookshelvesRepository.createBook(books);
        createdBook.forEach((res) => {
          bookIds.push(res.bookId);
        });
        existingBookIds.forEach((res) => {
          bookIds.push(res);
        });

        await this.bookshelvesRepository.createUserBook(userId, bookIds);
      }

      return userId;
    } catch (error) {
      throw error;
    }
  }

  async getPosts(page: number, order: any) {
    const take = 5;
    const skip = (page - 1) * take;

    const posts = await this.postRepository.find({
      relations: ['bookshelves', 'user'],
      where: {
        status: Not('deleted'),
      },
      take,
      skip,
      order,
      // order: { createdAt: 'DESC' },
    });

    // const postIds = posts.map((post) => post.postId);
    // const likes = await this.likeRepository
    //   .createQueryBuilder('like')
    //   .select('like.postId', 'postId')
    //   .addSelect('COUNT(like.likeId)', 'likeCount')
    //   .where('like.postId IN (:...postIds)', { postIds })
    //   .groupBy('like.postId')
    //   .getRawMany();

    // const likeCountMap = likes.reduce((map, like) => {
    //   map[like.postId] = parseInt(like.likeCount, 10);
    //   return map;
    // }, {});

    // posts.forEach((post) => {
    //   post['likeCount'] = likeCountMap[post.postId] || 0;
    // });

    // console.log(posts);

    return posts;
  }

  async deletePost(postId: number, password: string) {
    const post = await this.postRepository.findOne({
      where: { postId },
    });

    if (!post) {
      throw new NotFoundException('포스트가 존재하지 않습니다.');
    }

    if (post.password !== password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    post.status = 'deleted';
    await this.postRepository.save(post);

    return { success: true };
  }
}
