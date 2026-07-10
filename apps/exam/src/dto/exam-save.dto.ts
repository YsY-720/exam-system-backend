import { IsNotEmpty, IsString } from "class-validator";

export class ExamSaveDto {
  @IsNotEmpty({ message: "考试 id 不能空" })
  id: number;

  @IsString()
  content: string;
}