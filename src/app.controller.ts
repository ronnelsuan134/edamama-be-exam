import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs'
import * as path from 'path'
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): Object {
    return { data: new Date(), env: 'dev' }
  }

  @Get('/uploads/:filePath')
  async getFile(@Param('filePath') filePath: string, @Res() res: Response) {
    const fPath = fs.createReadStream(path.join(__dirname.replace('/dist', ''), '..', `${filePath}`))
    fPath.pipe(res)
  }
}
