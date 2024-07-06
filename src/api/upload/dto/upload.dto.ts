import { IsDefined } from 'class-validator';
// import {
//   MemoryStoredFile,
//   HasMimeType,
//   IsFiles,
//   MaxFileSize,
// } from 'nestjs-form-data';

export class UploadDto {
  // @IsFiles({ each: true })
  // @MaxFileSize(1e7, {
  //   each: true,
  //   message: '파일의 최대 사이즈는 10MB입니다',
  // })
  // @HasMimeType(['image/png', 'image/jpeg', 'image/jpg'], {
  //   each: true,
  //   message: (e) => {
  //     return `error: ${e.constraints}`;
  //   },
  // })
  // files: MemoryStoredFile[];

  @IsDefined()
  nickname: string;

  @IsDefined()
  birth: string;

  @IsDefined()
  gender: string;
}
