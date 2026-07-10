import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { AnswerAddDto } from "./dto/answer-add.dto";
import { PrismaService } from "@app/prisma";
import { ExcelService } from "@app/excel";

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(ExcelService)
  private readonly excelService: ExcelService;

  async add(dto: AnswerAddDto, userId: number) {
    return this.prismaService.answer.create({
      data: {
        content: dto.content,
        score: 0,
        answerer: {
          connect: { id: userId }
        },
        exam: {
          connect: { id: dto.examId }
        }
      }
    });
  }

  async list(id: number) {
    if (!id) throw new BadRequestException("examId不能为空");
    return this.prismaService.answer.findMany({
      where: {
        examId: id
      },
      include: {
        exam: true,
        answerer: true
      }
    });
  }

  async find(id: number) {
    return this.prismaService.answer.findUnique({
      where: {
        id
      },
      include: {
        exam: true,
        answerer: true
      }
    });
  }

  async export(id: number) {
    if (!id) {
      throw new BadRequestException("examId 不能为空");
    }
    const data = await this.list(id);
    const columns = [
      { header: "ID", key: "id", width: 20 },
      { header: "分数", key: "score", width: 30 },
      { header: "答题人", key: "answerer", width: 30 },
      { header: "试卷", key: "exam", width: 30 },
      { header: "创建时间", key: "createTime", width: 30 },
    ];

    const res = data.map(item => {
      return {
        id: item.id,
        score: item.score,
        answerer: item.answerer.username,
        exam: item.exam.name,
        createTime: item.createTime,
      };
    });

    return this.excelService.export(columns, res, "answers.xlsx");
  }
}
