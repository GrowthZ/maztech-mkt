import bcrypt from 'bcryptjs';
import { Prisma, PrismaClient, Brand, ContentType, DataSource, OwnerName, Role } from '@prisma/client';
import { subDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('12345678', 10);

  const [admin, nam, duc, thien, phuong] = await Promise.all([
    prisma.user.upsert({
      where: { username: 'admin' },
      update: { fullName: 'Admin Maztech', passwordHash, role: Role.ADMIN, isActive: true },
      create: { fullName: 'Admin Maztech', username: 'admin', passwordHash, role: Role.ADMIN, isActive: true }
    }),
    prisma.user.upsert({
      where: { username: 'nam' },
      update: { fullName: 'Nam', passwordHash, role: Role.CONTENT, isActive: true },
      create: { fullName: 'Nam', username: 'nam', passwordHash, role: Role.CONTENT, isActive: true }
    }),
    prisma.user.upsert({
      where: { username: 'duc' },
      update: { fullName: 'Đức', passwordHash, role: Role.CONTENT, isActive: true },
      create: { fullName: 'Đức', username: 'duc', passwordHash, role: Role.CONTENT, isActive: true }
    }),
    prisma.user.upsert({
      where: { username: 'thien' },
      update: { fullName: 'Thiên', passwordHash, role: Role.ADS, isActive: true },
      create: { fullName: 'Thiên', username: 'thien', passwordHash, role: Role.ADS, isActive: true }
    }),
    prisma.user.upsert({
      where: { username: 'phuong' },
      update: { fullName: 'Phượng', passwordHash, role: Role.DATA_INPUT, isActive: true },
      create: { fullName: 'Phượng', username: 'phuong', passwordHash, role: Role.DATA_INPUT, isActive: true }
    })
  ]);

  await prisma.contentEntry.deleteMany({});
  await prisma.seoEntry.deleteMany({});
  await prisma.adsEntry.deleteMany({});
  await prisma.dataEntry.deleteMany({});
  await prisma.auditLog.deleteMany({});

  const days = [subDays(new Date(), 6), subDays(new Date(), 5), subDays(new Date(), 4), subDays(new Date(), 3), subDays(new Date(), 2), subDays(new Date(), 1)];

  await prisma.contentEntry.createMany({
    data: [
      { date: days[0], ownerName: OwnerName.NAM, brand: Brand.WINHOME, fanpage: 'Winhome Fanpage Chính', contentType: ContentType.IMAGE, quantity: 3, createdById: nam.id },
      { date: days[1], ownerName: OwnerName.NAM, brand: Brand.WINHOME, fanpage: 'Winhome Fanpage Chính', contentType: ContentType.VIDEO, quantity: 2, createdById: nam.id },
      { date: days[2], ownerName: OwnerName.NAM, brand: Brand.SIEU_THI_KE_GIA, fanpage: 'Siêu Thị Kệ Giá', contentType: ContentType.IMAGE, quantity: 4, createdById: nam.id },
      { date: days[1], ownerName: OwnerName.DUC, brand: Brand.WINHOME, fanpage: 'Winhome Miền Nam', contentType: ContentType.IMAGE, quantity: 2, createdById: duc.id },
      { date: days[3], ownerName: OwnerName.DUC, brand: Brand.SIEU_THI_KE_GIA, fanpage: 'Siêu Thị Kệ Giá', contentType: ContentType.VIDEO, quantity: 3, createdById: duc.id },
      { date: days[4], ownerName: OwnerName.DUC, brand: Brand.WINHOME, fanpage: 'Winhome Fanpage Chính', contentType: ContentType.IMAGE, quantity: 3, createdById: duc.id }
    ]
  });

  await prisma.seoEntry.createMany({
    data: [
      { date: days[0], ownerName: OwnerName.NAM, website: 'nhadidongwinhome.com', quantity: 2, createdById: nam.id },
      { date: days[2], ownerName: OwnerName.DUC, website: 'sieuthikegia.com', quantity: 3, createdById: duc.id },
      { date: days[4], ownerName: OwnerName.NAM, website: 'sieuthikegia.com', quantity: 1, createdById: nam.id },
      { date: days[5], ownerName: OwnerName.DUC, website: 'nhadidongwinhome.com', quantity: 2, createdById: duc.id }
    ]
  });

  await prisma.adsEntry.createMany({
    data: [
      { date: days[0], brand: Brand.WINHOME, spend: 2500000, messages: 80, data: 24, createdById: thien.id },
      { date: days[2], brand: Brand.SIEU_THI_KE_GIA, spend: 1800000, messages: 46, data: 14, createdById: thien.id },
      { date: days[4], brand: Brand.WINHOME, spend: 3200000, messages: 95, data: 28, createdById: thien.id },
      { date: days[5], brand: Brand.SIEU_THI_KE_GIA, spend: 2200000, messages: 52, data: 17, createdById: thien.id }
    ]
  });

  await prisma.dataEntry.createMany({
    data: [
      { date: days[0], brand: Brand.WINHOME, source: DataSource.FACEBOOK, count: 15, createdById: phuong.id },
      { date: days[0], brand: Brand.SIEU_THI_KE_GIA, source: DataSource.HOTLINE, count: 7, createdById: phuong.id },
      { date: days[1], brand: Brand.WINHOME, source: DataSource.WEBSITE, count: 10, createdById: phuong.id },
      { date: days[2], brand: Brand.SIEU_THI_KE_GIA, source: DataSource.ZALO, count: 5, createdById: phuong.id },
      { date: days[3], brand: Brand.WINHOME, source: DataSource.TIKTOK, count: 8, createdById: phuong.id },
      { date: days[4], brand: Brand.SIEU_THI_KE_GIA, source: DataSource.FACEBOOK, count: 9, createdById: phuong.id },
      { date: days[5], brand: Brand.WINHOME, source: DataSource.HOTLINE, count: 11, createdById: phuong.id }
    ]
  });

  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'SEED',
        module: 'SYSTEM',
        recordId: 'initial-seed',
        oldValueJson: Prisma.JsonNull,
        newValueJson: { ok: true, seededAt: new Date().toISOString() }
      },
      {
        userId: nam.id,
        action: 'CREATE',
        module: 'content_entries',
        recordId: 'seed-content-nam',
        oldValueJson: Prisma.JsonNull,
        newValueJson: { ownerName: 'NAM', fanpage: 'Winhome Fanpage Chính' }
      },
      {
        userId: thien.id,
        action: 'UPDATE',
        module: 'ads_entries',
        recordId: 'seed-ads-thien',
        oldValueJson: { spend: 1800000 },
        newValueJson: { spend: 2200000 }
      },
      {
        userId: phuong.id,
        action: 'CREATE',
        module: 'data_entries',
        recordId: 'seed-data-phuong',
        oldValueJson: Prisma.JsonNull,
        newValueJson: { source: 'FACEBOOK', count: 15 }
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
