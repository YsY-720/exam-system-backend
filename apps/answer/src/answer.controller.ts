import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { RequireLogin, UserInfo } from "@app/common";
import { AnswerAddDto } from "./dto/answer-add.dto";
import { ExcelService } from "@app/excel";

@Controller("answer")
export class AnswerController {
  @Inject(AnswerService)
  private readonly answerService: AnswerService;

  @Post("add")
  @RequireLogin()
  async add(@Body() addDto: AnswerAddDto, @UserInfo("userId") userId: number) {
    return this.answerService.add(addDto, userId);
  }

  @Get("list")
  @RequireLogin()
  async list(@Query("examId") id: string) {
    return this.answerService.list(+id);
  }

  @Get("find/:id")
  @RequireLogin()
  async find(@Param("id") id: string) {
    return this.answerService.find(+id);
  }

  @Get("export")
  // @RequireLogin()
  async export(@Query("examId") examId: string) {
    return this.answerService.export(+examId);
  }
}
