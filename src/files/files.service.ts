import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileDto } from './dtos/create-file.dto';
import { File } from './interface/file.interface';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async createFile(
    createFileDto: CreateFileDto,
    file: Express.Multer.File,
  ): Promise<File> {
    const { title, description } = createFileDto;

    const fileUrl = await this.upload(file);

    const fileSize =
      file.size / (1024 * 1024) < 1
        ? `${(file.size / 1024).toFixed(2)}KB`
        : `${(file.size / (1024 * 1024)).toFixed(2)}MB`;

    return await this.prismaService.file.create({
      data: {
        title,
        description,
        url: fileUrl,
        size: fileSize,
      },
    });
  }

  async findAll(): Promise<File[]> {
    return await this.prismaService.file.findMany();
  }

  async findOne(id: string): Promise<File> {
    const file = await this.prismaService.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new Error(`File with id: ${id} does not exist`);
    }
    return file;
  }

  async updateOne(id: string, updateFileDto: CreateFileDto): Promise<File> {
    await this.findOne(id);

    const { title, description } = updateFileDto;

    return await this.prismaService.file.update({
      where: { id },
      data: {
        title,
        description,
      },
    });
  }

  async deleteOne(id: string): Promise<File> {
    await this.findOne(id);

    return await this.prismaService.file.delete({
      where: { id },
    });
  }

  private async upload(file: Express.Multer.File): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const fileKey = `uploads/${file.originalname}`;
    const fileBuffer = file.buffer;

    const fileUrl = await this.s3Service.uploadFile(
      bucketName,
      fileKey,
      fileBuffer,
    );
    return fileUrl;
  }
}
