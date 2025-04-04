/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { VeiculoService } from "../services/veiculo.service";
import { Veiculo } from "../entities/veiculo.entity";


//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth()
//@ApiTags('Veiculos')
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
    

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() produto: Veiculo): Promise<Veiculo>{
        return this.veiculoService.create(produto)
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() produto: Veiculo): Promise<Veiculo>{
        return this.veiculoService.update(produto)
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number){
        return this.veiculoService.delete(id)
    }


}