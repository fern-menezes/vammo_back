//import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { NumericTransformer } from "src/util/numericTransformer"


@Entity({name: "tb_viagens"})

export class Viagem {

    @PrimaryGeneratedColumn() 
    //@ApiProperty() 
    id: number

    //@ApiProperty()  
    @CreateDateColumn()
    data_ida: Date;

    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    //@ApiProperty() 
    origem: string

    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    //@ApiProperty() 
    destino: string

    @IsNotEmpty()
    //@ApiProperty() 
    @Column({ type: 'int' })  
    distancia: number;

    @IsNotEmpty()
    //@ApiProperty() 
    @Column({ type: 'int' })  
    velocidade: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @IsPositive()
    //@ApiProperty() 
    @Column({ type: "decimal", precision: 10, scale: 2, transformer: new NumericTransformer() })
    preco: number
    
    //@ApiProperty()
    @Column({length: 10, nullable: true})
    duracao: string;

    @IsNotEmpty()
    @Column({length: 255, nullable: false }) 
    //@ApiProperty() 
    status: string

    /**  Relacionamentos 
    @ApiProperty({ type: () => Veiculo })  
    @ManyToOne(() => Veiculo, (veiculo) => veiculo.viagem, {
        onDelete: "CASCADE"
    })
    veiculo: Veiculo

    @ApiProperty({ type: () => Usuario })  
    @ManyToOne(() => Usuario, (usuario) => usuario.viagem, {
            onDelete: "CASCADE"
        })
        usuario: Usuario
*/
}