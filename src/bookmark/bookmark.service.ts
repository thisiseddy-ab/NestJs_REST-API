import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../src/prisma/prisma.service';

/// DTO'S ///
import { CreateBookmarkDTO,EditBookmarkDTO } from './dto';

/// Prisma Models ///
import { Bookmark} from '@prisma/client';

@Injectable()
export class BookmarkService {

    constructor(
        private prismaService : PrismaService
    ){

    }

    public async getBookmarks(userId : number,) {
        return this.prismaService.bookmark.findMany({
            where: {
              userId,
            },
        });
    }

    public async  getBookmarkById(userId : number, bookmarkId : number) {
        
        return this.prismaService.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            },
        });
    }

    public async createBookmark(userId : number , dto : CreateBookmarkDTO) : Promise<Bookmark> { 
        
        const bookmark = await this.prismaService.bookmark.create({
            data: {
            userId,
            ...dto,
            },
        });

        return bookmark;
    }

    public async editBookmarkById(
        userId: number,
        bookmarkId: number,
        dto: EditBookmarkDTO) {

        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
            });


        if (!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException(
            'Access to resources denied',
            );

        return this.prismaService.bookmark.update({
            where: {
            id: bookmarkId,
            },
            data: {
            ...dto,
            },
        });
    }

    public async deleteBookmarkById(userId : number, bookmarkId : number) {
        
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
            id: bookmarkId,
            },
        });

        // check if user owns the bookmark
        if (!bookmark || bookmark.userId !== userId)
        throw new ForbiddenException(
            'Access to resources denied',
        );

        await this.prismaService.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });
    }
}
