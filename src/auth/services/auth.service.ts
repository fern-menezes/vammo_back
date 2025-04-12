import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';


@Injectable()
export class AuthService{
    
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ){ }

    async validateUser(username: string, password: string): Promise<any> {
        const buscaUsuario = await this.usuarioService.findByUsuario(username);
    
        if (!buscaUsuario) {
            throw new HttpException('⚠️ Usuário não encontrado!', HttpStatus.NOT_FOUND);
        }
    
        const matchPassword = await this.bcrypt.compararSenhas(password, buscaUsuario.senha);
    
        if (!matchPassword) {
            throw new HttpException('⚠️ Senha incorreta!', HttpStatus.UNAUTHORIZED);
        }
    
        // Retorna os dados do usuário sem a senha
        const { senha, ...resposta } = buscaUsuario;
        return resposta;
    }

    // Login com email e senha
    async login(usuarioLogin: UsuarioLogin) {
        // Valida o usuário reutilizando a função validateUser
        const usuarioValido = await this.validateUser(usuarioLogin.usuario, usuarioLogin.senha);
    
        // Define o payload para o JWT
        const payload = { sub: usuarioValido.id, usuario: usuarioValido.usuario, tipo_user: usuarioValido.tipo_user };
    
        return {
            id: usuarioValido.id,
            nome: usuarioValido.nome,
            tipo_user: usuarioValido.tipo_user,
            usuario: usuarioValido.usuario,
            birthday: usuarioValido.birthday,            
            token: `Bearer ${this.jwtService.sign(payload)}`,
        };
    }
    
}