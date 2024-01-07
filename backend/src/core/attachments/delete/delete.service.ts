// import { unlink } from 'fs';

// import { Injectable } from '@nestjs/common';

// import { DeleteCoreAttachmentsArgs } from './dto/delete.args';

// import { PrismaService } from '@/prisma/prisma.service';
// import { CustomError } from '@/utils/errors/CustomError';

// @Injectable()
// export class DeleteCoreAttachmentsService {
//   constructor(private readonly prisma: PrismaService) {}

//   async deleteFile({ id, module }: DeleteCoreAttachmentsArgs) {
//     if (!module && !id) {
//       throw new CustomError({
//         code: 'INTERNAL_SERVER_ERROR',
//         message: 'Module and id are required'
//       });
//     }

//     const file = await this.prisma.core_attachments.findFirst({
//       where: id
//         ? { id }
//         : {
//             AND: [
//               {
//                 module: module.module
//               },
//               {
//                 module_id: module.id
//               }
//             ]
//           }
//     });

//     if (!file) {
//       throw new CustomError({
//         code: 'ATTACHMENT_NOT_FOUND',
//         message: 'Attachment not found'
//       });
//     }

//     // Remove file from server
//     unlink(file.url, err => {
//       // eslint-disable-next-line no-console
//       if (err) console.error(err);
//     });

//     // Remove file from database
//     await this.prisma.core_attachments.delete({
//       where: {
//         id: file.id
//       }
//     });

//     return 'Success!';
//   }
// }
