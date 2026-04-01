import { z } from 'zod';

export const contentEntrySchema = z.object({
  date: z.string().min(1, 'Ngày là bắt buộc'),
  ownerName: z.enum(['NAM', 'DUC']),
  brand: z.enum(['WINHOME', 'SIEU_THI_KE_GIA']),
  fanpage: z.string().min(1, 'Fanpage là bắt buộc'),
  contentType: z.enum(['IMAGE', 'VIDEO']),
  quantity: z.coerce.number().int().positive('Số lượng phải lớn hơn 0')
});

export const seoEntrySchema = z.object({
  date: z.string().min(1, 'Ngày là bắt buộc'),
  ownerName: z.enum(['NAM', 'DUC']),
  website: z.string().min(1, 'Website là bắt buộc'),
  quantity: z.coerce.number().int().positive('Số bài phải lớn hơn 0')
});

export const adsEntrySchema = z.object({
  date: z.string().min(1, 'Ngày là bắt buộc'),
  brand: z.enum(['WINHOME', 'SIEU_THI_KE_GIA']),
  spend: z.coerce.number().min(0, 'Chi tiêu không được âm'),
  messages: z.coerce.number().int().min(0, 'Số mess không được âm'),
  data: z.coerce.number().int().min(0, 'Số data không được âm')
});

export const dataEntrySchema = z.object({
  date: z.string().min(1, 'Ngày là bắt buộc'),
  brand: z.enum(['WINHOME', 'SIEU_THI_KE_GIA']),
  source: z.enum(['FACEBOOK', 'HOTLINE', 'ZALO', 'TIKTOK', 'WEBSITE']),
  count: z.coerce.number().int().positive('Số data phải lớn hơn 0')
});

export const userSchema = z.object({
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  username: z.string().min(3, 'Tài khoản tối thiểu 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'CONTENT', 'ADS', 'DATA_INPUT']),
  isActive: z.boolean().default(true)
});
