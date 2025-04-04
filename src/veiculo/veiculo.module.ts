import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Veiculo } from "./entities/veiculo.entity";
import { VeiculoController } from "./controllers/veiculo.controller";
import { VeiculoService } from "./services/veiculo.service";

@Module({
    imports:[TypeOrmModule.forFeature([Veiculo])],
    controllers:[VeiculoController],
    providers:[VeiculoService],
    exports:[TypeOrmModule, VeiculoService],
})
export class VeiculoModule{}