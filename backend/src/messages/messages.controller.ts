import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.createMessage(createMessageDto);
    return {
      success: true,
      message: 'Message sent successfully',
      data: message,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllMessages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await this.messagesService.getAllMessages(pageNum, limitNum);
    return {
      success: true,
      data: result,
    };
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUnreadCount() {
    const count = await this.messagesService.getUnreadCount();
    return {
      success: true,
      data: { count },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getMessageById(@Param('id') id: string) {
    const message = await this.messagesService.getMessageById(id);
    return {
      success: true,
      data: message,
    };
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async markAsRead(@Param('id') id: string) {
    const message = await this.messagesService.markAsRead(id);
    return {
      success: true,
      message: 'Message marked as read',
      data: message,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteMessage(@Param('id') id: string) {
    await this.messagesService.deleteMessage(id);
    return {
      success: true,
      message: 'Message deleted successfully',
    };
  }
}
