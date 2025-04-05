import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Headers, Param, ParseIntPipe, Post, Put, UseGuards, Logger, UploadedFile, UseInterceptors, Delete } from "@nestjs/common";
import { Usuario } from "../entities/usuario.entiry";
import { UsuarioService } from "../services/usuario.service";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from 'multer'; 
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/guards/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


    @ApiBearerAuth()
    @ApiTags('Usuarios')
    @Controller('/usuarios')
    export class UsuarioController{
        
        //logs
        private readonly logger = new Logger(UsuarioController.name);
        constructor(private readonly usuarioService:UsuarioService){}

        @UseGuards(JwtAuthGuard)
        @Get('/all')
        @HttpCode(HttpStatus.OK)
        findAll(): Promise<Usuario[]>{
            return this.usuarioService.findAll();
        }

        @UseGuards(JwtAuthGuard)
        @Get('/:id')
        @HttpCode(HttpStatus.OK)
        findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario>{
            return this.usuarioService.findById(id)
        }

        @UseGuards(JwtAuthGuard)
        @Get('/genero/:genero')
        @HttpCode(HttpStatus.OK)
        findByGenero(@Param("genero")genero:string):Promise<Usuario[]>{
            return this.usuarioService.findByGenero(genero)
        }

        @Post('/upload-foto')
        @UseInterceptors(FileInterceptor('file', {
            storage: multer.diskStorage({
                destination: './uploads/fotos',
                filename: (_req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${uniqueSuffix}-${file.originalname}`);
                },
            }),
        }))
        async uploadFoto(@UploadedFile() file: Express.Multer.File): Promise<{ filePath: string }> {
            return { filePath: file.path };
        }


        @Post('avaliar')
        async avaliarUsuario(@Body() { userId, nota }: { userId: number; nota: number }) {
        return this.usuarioService.avaliarUsuario(userId, nota);
        }

        @Post('/cadastrar')
        @HttpCode(HttpStatus.CREATED)
        async create(@Body() usuario: Usuario): Promise<Usuario>{
            return this.usuarioService.create(usuario)
        }
    
        @UseGuards(JwtAuthGuard)
        @Put('/atualizar')
        @HttpCode(HttpStatus.OK)
        async update(@Body() usuario: Usuario): Promise<Usuario>{
            return this.usuarioService.update(usuario)
        }

        @UseGuards(JwtAuthGuard)
        @Get('/tipo/:usuario')
        @HttpCode(HttpStatus.OK)
        findByType(@Param('usuario') usuario:string): Promise<Usuario[]>{
            return this.usuarioService.findByType(usuario);
        }

        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin')
        @Delete('/:id')
            @HttpCode(HttpStatus.NO_CONTENT)
            delete(@Param('id', ParseIntPipe) id: number){
                return this.usuarioService.delete(id)
            }

    
    }