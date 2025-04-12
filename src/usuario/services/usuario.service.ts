import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, ILike, NumericType, Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Bcrypt } from "src/auth/bcrypt/bcrypt";
import { differenceInYears } from "date-fns";


@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) { }

    async findByUsuario(usuario: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({
            where: {
                usuario: usuario
            },
            relations: {
                viagem: true,
            }
        })
    }

    async findByGenero(genero: string): Promise<Usuario[]> {
        return this.usuarioRepository.find({
            where: { genero: ILike(`%${genero}%`) }
        })
    }

    async findByType(tipo_user: string): Promise<Usuario[]> {
        return this.usuarioRepository.find({
            where: { usuario: ILike(`%${tipo_user}%`) }
        })
    }


    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            relations: {
                viagem: true,
            }
        })
    }

    async findById(id: number): Promise<Usuario> {

        const usuario = await this.usuarioRepository.findOne({
            where: {
                id
            },
            relations: {
                viagem: true,
            }
        })
        if (!usuario)
            throw new HttpException("⚠️ Usuário não encontrado", HttpStatus.NOT_FOUND)
        return usuario
    }

    async create(usuario: Usuario): Promise<Usuario> {

        //utilizando método para calcular a idade 
        await this.calculoIdade(usuario)

        const buscaUsuario = await this.findByUsuario(usuario.usuario)

        if (buscaUsuario)
            throw new HttpException("⚠️ O Usuario já existe!", HttpStatus.BAD_REQUEST)


        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario)
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id)

        return await this.usuarioRepository.delete(id)
    }




    async update(usuario: Usuario): Promise<Usuario> {

        await this.findById(usuario.id)
        const buscaUsuario = await this.findByUsuario(usuario.usuario)

        if (buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException("⚠️ Usuário já está cadastrado!", HttpStatus.BAD_REQUEST)
        await this.calculoIdade(usuario)

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario)
    }

    async avaliarUsuario(userId: number, nota: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOneBy({ id: userId });
        if (!usuario) throw new Error('Usuário não encontrado!');

        usuario.avaliacao = usuario.avaliacao
            ? (usuario.avaliacao + nota) / 2
            : nota;

        return this.usuarioRepository.save(usuario);
    }


    //Método Extra para verificar a idade do usuário
    async calculoIdade(usuario: Usuario): Promise<Usuario> {
        const dataNascimento = usuario.birthday;
        const [dia, mes, ano] = dataNascimento.split('/').map(Number);
        const birthdayDate = new Date(ano, mes - 1, dia);
        const dataAtual = new Date();
        const idade = differenceInYears(dataAtual, birthdayDate);

        if (idade < 18) {
            throw new HttpException(
                `⚠️ Usuário deve ter pelo menos 18 anos. Sua idade é ${idade} anos`,
                HttpStatus.NOT_FOUND,
            );
        }

        return usuario;
    }
}