import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
    constructor(
        @Inject('USUARIO_REPOSITORY')
        private usuarioRepository: Repository<Usuario>,
    ) { }

    async listar(): Promise<Usuario[]> {
        return this.usuarioRepository.find();
    }

    async cadastrar(data: UsuarioCadastrarDto): Promise<ResultadoDto> {
        let usuario = new Usuario()
        usuario.email = data.email
        usuario.nome = data.nome
        usuario.password = bcrypt.hashSync(data.senha, 8)
        usuario.telefone = data.telefone
        usuario.cpf = data.cpf
        return this.usuarioRepository.save(usuario)
        .then((result) => {
            return <ResultadoDto>{
                status: true,
                mensagem: "Usuário cadastrado com sucesso"
            }
        })
        .catch((error) => {
            return <ResultadoDto>{
                status: false,
                mensagem: "Houve um erro ao cadastrar o usuário"
            }
        }) 
    }

    async findOne(email: string): Promise<Usuario | undefined> {
        return this.usuarioRepository.findOne({where: {email: email}});
      }
}
