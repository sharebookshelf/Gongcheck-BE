import { MemoryStoredFile, HasMimeType, MaxFileSize } from 'nestjs-form-data';

// TODO: File 사이즈가 너무 큰 경우 validation 에러 발생
export class UploadDto {
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'])
  files: MemoryStoredFile[];
}
