import { PartialType } from '@nestjs/mapped-types';
import { CreateReqServicoDto } from './create-req_servico.dto';

export class UpdateReqServicoDto extends PartialType(CreateReqServicoDto) {}
