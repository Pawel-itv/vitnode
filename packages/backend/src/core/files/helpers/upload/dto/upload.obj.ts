import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadCoreFilesObj {
  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  file_name: string;

  @Field(() => String)
  file_name_original: string;

  @Field(() => String)
  dir_folder: string;

  @Field(() => String)
  extension: string;

  @Field(() => Int)
  file_size: number;

  @Field(() => Int, { nullable: true })
  width: number | null;

  @Field(() => Int, { nullable: true })
  height: number | null;
}
