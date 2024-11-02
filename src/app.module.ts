import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvKeyConstants } from './common/constants';
import { ConfigModule } from '@nestjs/config';
import { JWTService } from './common/helper/jwt.service';
import { RecordSessionKqjModule } from './record_session_kqj/record_session_kqj.module';
import { GameLaunchModule } from './game_launch/game_launch.module';
import { GameSessionKqjModule } from './game_session_kqj/game_session.module';
import { TransactionSessionModule } from './transaction_session/transaction_session.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    JwtModule.register({
      global: true,
      secret: EnvKeyConstants.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    TransactionModule,
    RecordSessionKqjModule,
    GameLaunchModule,
    GameSessionKqjModule,
    TransactionSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService, JWTService],
  exports: [JWTService, JwtModule],
})
export class AppModule {}
