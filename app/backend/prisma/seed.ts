import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Simple hash function for demo (NOT for production!)
  const simpleHash = (password: string) => {
    return Buffer.from(password).toString('base64') + '_demo_hash';
  };

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wiki.local' },
    update: {},
    create: {
      email: 'admin@wiki.local',
      passwordHash: simpleHash('admin123'),
      name: 'System Administrator',
      role: 'ADMIN',
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@wiki.local' },
    update: {},
    create: {
      email: 'editor@wiki.local',
      passwordHash: simpleHash('editor123'),
      name: 'Content Editor',
      role: 'EDITOR',
    },
  });

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@wiki.local' },
    update: {},
    create: {
      email: 'viewer@wiki.local',
      passwordHash: simpleHash('viewer123'),
      name: 'Content Viewer',
      role: 'VIEWER',
    },
  });

  console.log('✅ Created users');

  // Create a test space
  const space = await prisma.space.create({
    data: {
      name: 'Dokumentation',
      slug: 'docs',
      description: 'Allgemeine Dokumentation',
      visibility: 'INTERNAL',
      createdBy: adminUser.id,
    },
  });

  // Create a test page
  const page = await prisma.page.create({
    data: {
      spaceId: space.id,
      title: 'Willkommen im Wiki',
      slug: 'welcome',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      createdBy: editorUser.id,
      contents: {
        create: {
          version: 1,
          markdown: `# Willkommen im Wiki System

## Über dieses Wiki

Dies ist ein modernes Wiki-System mit folgenden Features:

- 📝 **Markdown-Editor** mit Live-Preview
- 🔍 **Volltext-Suche** 
- 👥 **Benutzer-Rollen** (Admin, Editor, Viewer)
- 📁 **Spaces** für Organisation
- 🔄 **Versionierung** aller Änderungen

## Erste Schritte

1. Melde dich mit einem der Demo-Accounts an
2. Erstelle einen neuen Space
3. Füge Seiten hinzu
4. Nutze die Suche um Inhalte zu finden

## Demo-Accounts

- **Admin:** admin@wiki.local / admin123
- **Editor:** editor@wiki.local / editor123  
- **Viewer:** viewer@wiki.local / viewer123

Viel Spaß beim Erkunden! 🚀`,
          createdBy: editorUser.id,
        },
      },
    },
  });

  console.log('✅ Created test content');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });