import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3 = new AWS.S3();
  }

  async uploadFile(
    bucketName: string,
    fileKey: string,
    file: Buffer,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }
}
