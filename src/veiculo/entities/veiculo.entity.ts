/* eslint-disable prettier/prettier */

import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Viagem } from "../../viagem/entities/viagem.entity";

@Entity({name: "tb_veiculo"})
export class Veiculo{

    @PrimaryGeneratedColumn()
    //@ApiProperty()
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    //@ApiProperty()
    @Column({length: 100, nullable: false})
    modelo: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    //@ApiProperty()
    @Column({length: 7, nullable: false})
    placa: string;

    @IsNotEmpty()
    //@ApiProperty()
    @Column({length: 30, nullable: false})
    cor: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    //@ApiProperty()
    @Column({length: 10, nullable: false})
    ano_fabricacao: string;

    @Column({length:5000, nullable: true})
    //@ApiProperty()
    foto:string


    @Transform(({ value }: TransformFnParams) => value?.trim())
    //@ApiProperty()
    @Column({length: 5000, nullable: false})
    observacao: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    //@ApiProperty()
    disponivel: string 

    // Relacionamentos 
    //@ApiProperty()
    @OneToMany(() => Viagem, (viagem) => viagem.veiculo)
    viagem: Viagem[]
}