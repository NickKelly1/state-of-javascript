import { PermissionCategoryModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { ist } from '../../common/helpers/ist.helper';
import { softDeleteableRo } from '../../common/helpers/soft-deleteable-ro.helper';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';

export class PermissionCategoryService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }
}
