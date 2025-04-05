/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { VeiculoService } from "../services/veiculo.service";
import { Veiculo } from "../entities/veiculo.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from 'multer';
import { RolesGuard } from "src/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/guards/roles.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiTags('Veiculos')
    @Controller('/veiculos')
    export class VeiculoController{
        constructor(
            private readonly veiculoService: VeiculoService
        ){}

        @Get()
        @HttpCode(HttpStatus.OK)
        findAll(): Promise<Veiculo[]>{
            return this.veiculoService.findAll()
        }

        @Get('/:id')
        @HttpCode(HttpStatus.OK)
        findById(@Param('id', ParseIntPipe) id: number): Promise<Veiculo>{
            return this.veiculoService.findById(id)
        }

        @Get('/modelo/:modelo')
        @HttpCode(HttpStatus.OK)
        findByModelo(@Param ('modelo') modelo: string): Promise<Veiculo[]>{
            return this.veiculoService.findByModelo(modelo)
        }

        
        @Get('/disponivel/:modelo')
        @HttpCode(HttpStatus.OK)
        async getVeiculoDisponivel(@Param('modelo') modelo: string): Promise<Veiculo[]> {
            return this.veiculoService.getVeiculoDisponivel(modelo);
        }

        @Roles('admin', 'motorista')
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
        

        @Roles('admin', 'motorista')
        @Post()
        @HttpCode(HttpStatus.CREATED)
        create(@Body() produto: Veiculo): Promise<Veiculo>{
            return this.veiculoService.create(produto)
        }

        @Roles('admin', 'motorista')
        @Put()
        @HttpCode(HttpStatus.OK)
        update(@Body() produto: Veiculo): Promise<Veiculo>{
            return this.veiculoService.update(produto)
        }

        @Roles('admin', 'motorista')
        @Delete('/:id')
        @HttpCode(HttpStatus.NO_CONTENT)
        delete(@Param('id', ParseIntPipe) id: number){
            return this.veiculoService.delete(id)
        }


    }