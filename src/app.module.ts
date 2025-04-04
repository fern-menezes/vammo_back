import { TypeOrmModule } from '@nestjs/typeorm';
import { Viagem } from './viagem/entities/viagem.entity';
import { ViagemModule } from './viagem/viagem.module';
import { Module } from '@nestjs/common';
import { Veiculo } from './veiculo/entities/veiculo.entity';
import { VeiculoModule } from './veiculo/veiculo.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database:'db_vammo_app',
      entities: [Viagem, Veiculo],
      synchronize: true,
      logging: true,
    }),
    ViagemModule,
    VeiculoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
