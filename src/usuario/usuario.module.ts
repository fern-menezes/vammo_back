import {forwardRef, Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { Bcrypt } from "../auth/bcrypt/bcrypt";
import { UsuarioController } from "./controllers/usuario.controller";
import { Usuario } from "./entities/usuario.entiry";
import { UsuarioService } from "./services/usuario.service";

@Module({
    imports:[TypeOrmModule.forFeature([Usuario]), forwardRef(() => AuthModule), ],
    controllers:[UsuarioController],
    providers:[Bcrypt,UsuarioService],
    exports:[TypeOrmModule, UsuarioService]
})
export class UsuarioModule{}