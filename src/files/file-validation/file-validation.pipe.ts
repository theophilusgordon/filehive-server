import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedExtensions = [
    'pdf',
    'docx',
    'xlsx',
    'jpg',
    'jpeg',
    'png',
    'gif',
  ];
  private readonly maxFileSize = 5 * 1024 * 1024;

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!this.isFileValid(file)) {
      throw new BadRequestException('Invalid file.');
    }
    return file;
  }

  private isFileValid(file: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }

    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (!this.allowedExtensions.includes(fileExtension)) {
      return false;
    }

    if (file.size > this.maxFileSize) {
      return false;
    }

    return true;
  }
}
