import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ViagemService } from "../services/viagem.service";
import { Viagem } from "../entities/viagem.entity";



//@ApiTags('Viagens')
//@UseGuards(JwtAuthGuard)
@Controller("/viagens")
//@ApiBearerAuth()
export class ViagemController {
  constructor(private readonly viagemService: ViagemService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Viagem[]> {
    return this.viagemService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Viagem> {
    return this.viagemService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() viagem: Viagem): Promise<Viagem> {
    return this.viagemService.create(viagem);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() viagem: Viagem): Promise<Viagem> {
    return this.viagemService.update(viagem);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.viagemService.delete(id);
  }


  //Métodos Especiais
  @Get('/origem/:origem')
  @HttpCode(HttpStatus.OK)
  findByTitulo(@Param('origem') origem: string): Promise<Viagem[]>{
    return this.viagemService.findAllByOrigem(origem)
  }

  @Get('/historico/:usuario')  
  @HttpCode(HttpStatus.OK)
  findByHistorico(@Param('usuario') usuario: string): Promise<any> {  
    return this.viagemService.findByHistorico(usuario);  
  }

}