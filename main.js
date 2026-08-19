//  إعدادات Sanity
const PROJECT_ID = 'jel7k5km'; // معرّف مشروعك في Sanity
const DATASET = 'production';

// دالة عامة لجلب البيانات من Sanity API
async function fetchSanityData(query) {
    const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.result || [];
    } catch (error) {
        console.error("خطأ في الاتصال بـ Sanity:", error);
        return [];
    }
}

//  البيانات المؤقتة (Fallback / Default Data)
const defaultSkills = [
    {
        name: "Unity 3D",
        iconClass: "fa-brands fa-unity",
        description: "خبرة ممتازة في برمجة أنظمة اللعب (Gameplay Systems)، إدارة الـ Physics، الـ Player Movement، وبناء C# Scripts منظمة ومستقلة."
    },
    {
        name: "Laravel",
        iconClass: "fa-brands fa-laravel",
        description: "بناء RESTful APIs، إدارة قواعد البيانات، إعداد أنظمة التوثيق (Auth)، وتطوير معمارية وتطبيقات خلفية متكاملة."
    }
];

const defaultProjects = [
    {
        title: "اسم اللعبة التجريبية",
        imageUrl: "https://placehold.co/600x400/007bff/white?text=Game+Cover",
        description: "شرح تفصيلي عن اللعبة والأفكار المبتكرة فيها ودوري في البرمجة والتطوير.",
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        gameUrl: "#"
    }
];

const defaultFolders = {
    analysis: [
        { title: "Game Economy Analysis", imageUrl: "https://placehold.co/400x250/333/white?text=Analysis", content: "تفاصيل تحليل اقتصاد اللعبة وحساب اتزان الموارد..." }
    ],
    level: [
        { title: "Dungeon Level Blockout", imageUrl: "https://placehold.co/400x250/333/white?text=Level+Design", content: "تخطيط مسارات اللاعب وأماكن المواجهات..." }
    ],
    system: [
        { title: "Inventory System Architecture", imageUrl: "https://placehold.co/400x250/333/white?text=System", content: "معمارية نظام الحقيبة باستخدام Scriptable Objects..." }
    ]
};


//  عرض المهارات (Skills Logic)
let activeSkills = [];

async function loadSkills() {
    const query = '*[_type == "skill"]{name, iconClass, description}';
    const sanitySkills = await fetchSanityData(query);
    
    activeSkills = (sanitySkills && sanitySkills.length > 0) ? sanitySkills : defaultSkills;
    
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;

    // حفظ مربع التفاصيل
    const detailBox = document.getElementById('skill-detail');

    // بناء الأيقونات
    skillsGrid.innerHTML = activeSkills.map((skill, index) => `
        <div class="skill-item" onclick="showSkillDetail(${index})">
            <i class="${skill.iconClass || 'fa-solid fa-code'}"></i>
            <span>${skill.name}</span>
        </div>
    `).join('') + `<div id="skill-detail" class="skill-detail-box hidden"></div>`;
}

function showSkillDetail(index) {
    const skill = activeSkills[index];
    const detailBox = document.getElementById('skill-detail');

    document.querySelectorAll('.skill-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (skill && detailBox) {
        detailBox.classList.remove('hidden');
        detailBox.innerHTML = `
            <h3>${skill.name}</h3>
            <p>${skill.description}</p>
        `;
    }
}


//  عرض المشاريع (Projects Logic)
let activeProjects = [];

async function loadProjects() {
    const query = '*[_type == "project"]{title, "imageUrl": image.asset->url, description, youtubeUrl, gameUrl}';
    const sanityProjects = await fetchSanityData(query);

    activeProjects = (sanityProjects && sanityProjects.length > 0) ? sanityProjects : defaultProjects;

    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = activeProjects.map((proj, idx) => `
        <div class="project-card" onclick="openProjectModal(${idx})">
        <img src="${proj.imageUrl || 'https://placehold.co/600x400/007bff/white?text=No+Image'}" alt="${proj.title}">            <h3>${proj.title}</h3>
        </div>
    `).join('');
}

function openProjectModal(index) {
    const proj = activeProjects[index];
    if (!proj) return;

    // تحويل أي رابط يوتيوب إلى صيغة embed تلقائياً
    let embedUrl = proj.youtubeUrl;
    if (embedUrl && embedUrl.includes('watch?v=')) {
        embedUrl = embedUrl.replace('watch?v=', 'embed/');
    } else if (embedUrl && embedUrl.includes('youtu.be/')) {
        embedUrl = embedUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    }

    const videoHTML = embedUrl 
        ? `<div style="margin: 1rem 0;">
             <iframe width="100%" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
           </div>`
        : '';

    const linkHTML = proj.gameUrl && proj.gameUrl !== '#'
        ? `<div style="margin-top: 1.5rem;">
             <a href="${proj.gameUrl}" target="_blank" class="btn">تجربة اللعبة</a>
           </div>`
        : '';

    const content = `
        <h2>${proj.title}</h2>
        ${videoHTML}
        <p>${proj.description || ''}</p>
        ${linkHTML}
    `;

    openOverlay(content);
}


//  عرض المستندات والفولدرات (Folders Logic)
let activeFolders = defaultFolders;

async function loadFolders() {
    const query = '*[_type == "documentItem"]{title, category, "imageUrl": image.asset->url, content}';
    const sanityDocs = await fetchSanityData(query);

    if (sanityDocs && sanityDocs.length > 0) {
        activeFolders = { analysis: [], level: [], system: [] };
        sanityDocs.forEach(doc => {
            if (activeFolders[doc.category]) {
                activeFolders[doc.category].push(doc);
            }
        });
    }

    // فتح الفولدر الأول افتراضياً
    openFolder('analysis');
}

function openFolder(categoryKey) {
    document.querySelectorAll('.folder-tab').forEach(tab => tab.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    const container = document.getElementById('folder-content');
    if (!container) return;

    const items = activeFolders[categoryKey] || [];

    if (items.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; color: #777;">لا توجد مستندات في هذا الفولدر حالياً.</p>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="doc-card" onclick="openDocModal('${item.title}', '${item.content}')">
            <img src="${item.imageUrl || 'https://placehold.co/400x250/333/white?text=No+Image'}" alt="${item.title}">            <h4>${item.title}</h4>
            </div>
    `).join('');
}

function openDocModal(title, content) {
    const docHTML = `
        <h2>${title}</h2>
        <hr style="margin: 1rem 0;">
        <p style="font-size: 1.1rem; line-height: 1.8;">${content || 'لا يوجد محتوى تفصيلي.'}</p>
    `;
    openOverlay(docHTML);
}


//  عرض السيرة الذاتية والنوافذ المنبثقة (Overlays)
function openOverlay(contentHTML) {
    const overlay = document.getElementById('global-overlay');
    const body = document.getElementById('overlay-body');
    if (overlay && body) {
        body.innerHTML = contentHTML;
        overlay.classList.remove('hidden');
    }
}

function closeOverlay() {
    const overlay = document.getElementById('global-overlay');
    if (overlay) overlay.classList.add('hidden');
}

function openResumeOverlay() {
    const resumeHTML = `
        <h2>السيرة الذاتية</h2>
        <p style="margin-bottom: 1rem;">معاينة السيرة الذاتية:</p>
        <iframe src="cv.pdf" width="100%" height="450px" style="border: none; border-radius: 8px;"></iframe>
    `;
    openOverlay(resumeHTML);
}


//  تهيئة الصفحة عند التحميل (Init)
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadProjects();
    loadFolders();
});