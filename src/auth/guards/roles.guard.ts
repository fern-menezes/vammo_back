import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler()); // Busca os roles definidos na rota
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Recupera o usuário autenticado

        console.log('Roles permitidos na rota:', roles);
        console.log('Tipo de usuário autenticado:', user.tipo_user);


        if (!roles) {
            return true; // Se não houver roles, permite acesso
        }

        if (!user || !roles.includes(user.tipo_user)) {
            throw new HttpException('Permissão negada!', HttpStatus.FORBIDDEN); // Bloqueia o acesso
        }

        return true;
    }
}
