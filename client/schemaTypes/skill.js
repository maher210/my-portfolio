import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'skill',
  title: 'المهارات (Skills)',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'اسم المهارة', type: 'string' }),
    defineField({ name: 'iconClass', title: 'اسم كلاس الأيقونة (مثل: fa-brands fa-unity)', type: 'string' }),
    defineField({ name: 'description', title: 'شرح وتفاصيل المهارة', type: 'text' }),
  ],
})