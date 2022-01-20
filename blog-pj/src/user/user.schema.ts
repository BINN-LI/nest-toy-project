import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';
import { IsString, IsNotEmpty, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'id_test',
    description: 'id',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'pwd_test',
    description: 'password',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '김가나',
    description: 'name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 11,
    description: 'age',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    example: 'test@test.abc',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'F',
    description: 'gender',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  readonly readOnlyUser: {
    id: string;
    name: string;
    age: number;
    email: string;
    gender: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('readOnlyUser').get(function (this: User) {
  return {
    id: this.id,
    name: this.name,
    age: this.age,
    email: this.email,
    gender: this.gender,
  };
});
