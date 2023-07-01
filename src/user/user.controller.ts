import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

// Para todas as rotas

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Só para o CREATE
  //@UseInterceptors(LogInterceptor)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }
  @Roles(Role.Admin, Role.User)
  @Get()
  async read() {
    return this.userService.list();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async show(@ParamId('id', ParseIntPipe) id: number) {
    console.log('id :>> ', id);
    return this.userService.show(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Body() data: UpdatePutUserDTO, @Param('id', ParseIntPipe) id) {
    return this.userService.update(id, data);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchUserDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return this.userService.updatePartial(id, data);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return this.userService.delete(id);
  }
}
