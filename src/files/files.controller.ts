import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from './file-validation/file-validation.pipe';
import { CreateFileDto } from './dtos/create-file.dto';
import { FilesService } from './files.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UpdateFileDto } from './dtos/update-file.dto';
import { File } from './interface/file.interface';
import { SendFileDto } from './dtos/send-file.dto';
import { UsersService } from 'src/users/users.service';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'), FileValidationPipe)
  async uploadFile(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.filesService.createFile(createFileDto, file);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('file/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateFile(
    @Body() updateFileDto: UpdateFileDto,
    @Param('id') id: string,
  ) {
    try {
      return await this.filesService.updateOne(id, updateFileDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('file/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async getFile(@Param('id') id: string): Promise<File> {
    try {
      return await this.filesService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async getAllFiles(): Promise<File[]> {
    try {
      return await this.filesService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('file/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteFile(@Param('id') id: string): Promise<File> {
    try {
      return await this.filesService.deleteOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('file/:id/send')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async sendFile(
    @Param('id') id: string,
    @Body() sendFileDto: SendFileDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const sender = await this.usersService.getUserById(req.user.sub);
      return await this.filesService.sendFile(id, sendFileDto.email, sender);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
