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
import { GamesModule } from './games/games.module';
import { GameSessionKqjModule } from './game_session_kqj/game_session.module';
import { TransactionSessionModule } from './transaction_session/transaction_session.module';
import { DailyGameModule } from './daily_game/daily_game.module';
import { TaskSchedulerModule } from './task_scheduler/task_scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DashboardModule } from './dashboard/dashboard.module';
import { GamesocketModule } from './gamesocket/gamesocket.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { PermissionModule } from './permission/permission.module';
import { NotificationModule } from './notification/notification.module';
import { GameRouletteModule } from './game_roulette/game_roulette.module';
import { DailyGameRouletteModule } from './daily_game_roulette/daily_game_roulette.module';
import { GameSessionRouletteModule } from './game_session_roulette/game_session_roulette.module';
import { RecordSessionRouletteModule } from './record_session_roulette/record_session_roulette.module';
import { GameResultRouletteModule } from './game_result_roulette/game_result_roulette.module';

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
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    TransactionModule,
    RecordSessionKqjModule,
    GamesModule,
    GameSessionKqjModule,
    TransactionSessionModule,
    DailyGameModule,
    TaskSchedulerModule,
    DashboardModule,
    GamesocketModule,
    AuditLogModule,
    PermissionModule,
    NotificationModule,
    GameRouletteModule,
    DailyGameRouletteModule,
    GameSessionRouletteModule,
    RecordSessionRouletteModule,
    GameResultRouletteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JWTService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AuditLogInterceptor,
    // },
  ],
  exports: [JWTService, JwtModule],
})
export class AppModule {}
