import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'مشاريع الألعاب (Projects)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'اسم اللعبة', type: 'string' }),
    defineField({ name: 'image', title: 'صورة غلاف اللعبة', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: 'وصف اللعبة', type: 'text' }),
    defineField({ name: 'youtubeUrl', title: 'رابط فيديو يوتيوب', type: 'url' }),
    defineField({ name: 'gameUrl', title: 'رابط تجربة اللعبة (Itch.io)', type: 'url' }),
  ],
})