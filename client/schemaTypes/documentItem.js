import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'documentItem',
  title: 'المستندات والتحليلات (Folders)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'عنوان المستند', type: 'string' }),
    defineField({ 
      name: 'category', 
      title: 'الفولدر (التصنيف)', 
      type: 'string',
      options: {
        list: [
          { title: 'Game Analysis', value: 'analysis' },
          { title: 'Level Designs', value: 'level' },
          { title: 'System Analysis', value: 'system' },
        ]
      }
    }),
    defineField({ name: 'image', title: 'صورة توضيحية', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'content', title: 'المحتوى والشرح', type: 'text' }),
  ],
})