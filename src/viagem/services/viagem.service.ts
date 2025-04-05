import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Viagem } from '../entities/viagem.entity';
import { VeiculoService } from 'src/veiculo/services/veiculo.service';



@Injectable()
export class ViagemService {
  
  constructor(
    @InjectRepository(Viagem)
    private viagemRepository: Repository<Viagem>,
    private veiculoService: VeiculoService,
  ) {}

  async findAll(): Promise<Viagem[]> {
    return await this.viagemRepository.find({
      relations: {
        veiculo: true,
        usuario: true,
      },
    });
  }

  async findById(id: number): Promise<Viagem> {
    const viagem = await this.viagemRepository.findOne({
      where: {
        id,
      },
      relations: {
        veiculo: true,
        usuario: true,
      },
    });

    if (!viagem)
      throw new HttpException(
        '⚠️ Viagem não encontrada!',
        HttpStatus.NOT_FOUND,
      );

    return viagem;
  }

  async findAllByOrigem(origem: string): Promise<Viagem[]> {
    return await this.viagemRepository.find({
      where: {
        origem: ILike(`%${origem}%`),
      },
      relations: {
        veiculo: true,
        usuario: true,
      },
    });
  }

  async create(viagem: Viagem): Promise<Viagem> {
    //Calculo Tempo
    const tempoViagem = this.calcularDuracaoViagem(viagem.distancia,viagem.velocidade);

    //Formata Hora
    viagem.duracao = this.formatarDuracaoEmTempo(tempoViagem);
    
    await this.veiculoService.findById(viagem.veiculo.id);
    return await this.viagemRepository.save(viagem);
  }

  async update(viagem: Viagem): Promise<Viagem> {
    await this.findById(viagem.id);
    await this.veiculoService.findById(viagem.veiculo.id);

    return await this.viagemRepository.save(viagem);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);

    return await this.viagemRepository.delete(id);
  }

  //**Métodos especiais  */

  //Historico completo
  async findByHistorico(nome: string): Promise<any> {
    const hist = await this.viagemRepository
      .createQueryBuilder('viagens')
      .innerJoin('viagens.veiculo', 'veiculo')
      .innerJoin('viagens.usuario', 'usuario')
      .where('usuario.nome ILike :nome', { nome: `%${nome}%` })
      .select([
        'usuario.nome As Nome',
        'viagens.origem As Origem',
        'viagens.destino As Destino',
        'veiculo.modelo As Modelo',
        'usuario.tipo_user As Usuario',
      ])
      .getRawMany();

    if (!hist || hist.length === 0)
      throw new HttpException(
        '⛔ Usuario(s) não localizada!',
        HttpStatus.NOT_FOUND,
      );

    return {
      Mensage: 'Historico da Viagem 🧳',
      Resultado: hist,
    };
  }


  //Calcular e fortarma Duração da Viagem
  calcularDuracaoViagem(distancia: number, velocidade: number): number {
    // Conversão para m/s
    distancia = distancia * 1000; // Distância em metros
    velocidade = velocidade / 3.6; // Velocidade em m/s

    const duracaoPorSegundos = distancia / velocidade; // Duração em segundos

    return duracaoPorSegundos;
  }

  formatarDuracaoEmTempo(segundosTotais: number): string {
    const horas = Math.floor(segundosTotais / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);
    const segundos = Math.floor(segundosTotais % 60);

    // Formatador para garantir 2 dígitos
    const formatador = new Intl.NumberFormat('pt-BR', {
      minimumIntegerDigits: 2,
    });

    return `${formatador.format(horas)}:${formatador.format(minutos)}:${formatador.format(segundos)}`;
  }


}