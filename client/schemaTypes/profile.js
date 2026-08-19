import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'profile',
  title: 'البيانات الشخصية والـ CV',
  type: 'document',
  fields: [
    defineField({ name: 'fullName', title: 'الاسم الكامل', type: 'string' }),
    defineField({ name: 'bio', title: 'النبذة التعريفية', type: 'text' }),
    defineField({ name: 'profileImage', title: 'الصورة الشخصية', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'resumeFile', title: 'ملف السيرة الذاتية (PDF)', type: 'file' }),
  ],
})