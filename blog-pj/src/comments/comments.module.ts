import { Comments, CommentsSchema } from './comments.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
//import { UserModule } from 'src/user/user.module';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './services/comments.service';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    AuthModule,
    BlogModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
