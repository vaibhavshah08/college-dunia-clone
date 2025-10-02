import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { v4 as uuidv4 } from 'uuid';

export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create({
      message_id: uuidv4(),
      ...createMessageDto,
    });

    return await this.messageRepository.save(message);
  }

  async getAllMessages(
    page: number = 1,
    limit: number = 10,
  ): Promise<MessageListResponse> {
    const [messages, total] = await this.messageRepository.findAndCount({
      where: { is_deleted: false },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      messages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMessageById(messageId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { message_id: messageId, is_deleted: false },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async markAsRead(messageId: string): Promise<Message> {
    const message = await this.getMessageById(messageId);
    message.is_read = true;
    return await this.messageRepository.save(message);
  }

  async deleteMessage(messageId: string): Promise<void> {
    const message = await this.getMessageById(messageId);
    message.is_deleted = true;
    await this.messageRepository.save(message);
  }

  async getUnreadCount(): Promise<number> {
    return await this.messageRepository.count({
      where: { is_read: false, is_deleted: false },
    });
  }
}
