import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Viagem } from "src/viagem/entities/viagem.entity";
import { Veiculo } from "src/veiculo/entities/veiculo.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";

@Injectable()
export class DevService implements TypeOrmOptionsFactory {

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_vammo_app',
      entities: [Viagem, Veiculo, Usuario],
      synchronize: true,
    };
  }
}