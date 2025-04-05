import { TypeOrmModule } from '@nestjs/typeorm';
import { ViagemModule } from './viagem/viagem.module';
import { Module } from '@nestjs/common';
import { VeiculoModule } from './veiculo/veiculo.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProdService } from './auth/data/services/prod.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
	  useClass: ProdService,
    imports: [ConfigModule],
    }),
    ViagemModule,
    VeiculoModule,
    AuthModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
