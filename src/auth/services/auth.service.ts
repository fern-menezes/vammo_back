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

    async validateUser(username: string, password: string): Promise<any>{

        const buscaUsuario = await this.usuarioService.findByUsuario(username)

        if(!buscaUsuario)
            throw new HttpException('⚠️ O Usuario já existe!', HttpStatus.NOT_FOUND)

        const matchPassword = await this.bcrypt.compararSenhas(password, buscaUsuario.senha)

        if(buscaUsuario && matchPassword){
            const { senha, ...resposta } = buscaUsuario
            return resposta
        }

        return null
    }

    // Login com email e senha
    async login(usuarioLogin: UsuarioLogin) {
        const buscaUsuario = await this.usuarioService.findByUsuario(usuarioLogin.usuario);
    
        if (!buscaUsuario) {
            throw new HttpException("⚠️ O Usuário não foi encontrado!", HttpStatus.NOT_FOUND); // Corrigido o erro aqui também
        }
    
        // Inclui `tipo_user` no payload
        const payload = { sub: buscaUsuario.id, usuario: buscaUsuario.usuario, tipo_user: buscaUsuario.tipo_user };
    
        return {
            id: buscaUsuario.id,
            nome: buscaUsuario.nome,
            usuario: usuarioLogin.usuario,
            senha: '',
            foto: buscaUsuario.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`, // Gera o token com os dados adicionais
        };
    }
    
}