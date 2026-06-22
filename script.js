/* =============================================================
   faydi.dev — Portfolio
   script.js
   ============================================================= */

/* ====================================================
   NAVIGATION — POINTS ACTIFS AU SCROLL
   ==================================================== */
const sections = document.querySelectorAll('.section[id]');
const navDots  = document.querySelectorAll('.nav-dot');

function updateActiveNavDot() {
    const viewportMid = window.scrollY + window.innerHeight * 0.45;

    sections.forEach(section => {
        const top    = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (viewportMid >= top && viewportMid < bottom) {
            navDots.forEach(dot => dot.classList.remove('active'));

            const sectionId = section.getAttribute('id');
            const matchDot  = document.querySelector(`.nav-dot[data-section="${sectionId}"]`);
            if (matchDot) matchDot.classList.add('active');
        }
    });
}

/* ====================================================
   SMOOTH SCROLL pour les liens d'ancre (#)
   ==================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href   = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ====================================================
   HEADER — opaque après le scroll initial
   ==================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.hero-header');
    if (!header) return;

    const toggle = () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', toggle, { passive: true });
    toggle(); // vérifier l'état au chargement
}

/* ====================================================
   ANIMATIONS AU SCROLL — Intersection Observer
   ==================================================== */
function initScrollAnimations() {
    /* Sections entières : déclenche quand 10% est visible */
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    /* On observe une seule fois : on désobserve après l'animation */
                    sectionObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    /* Items individuels (cards, etc.) : déclenche quand 12% est visible */
    const itemObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    itemObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );

    document.querySelectorAll('.fade-in-section').forEach(el => sectionObserver.observe(el));
    document.querySelectorAll('.fade-in-item').forEach(el => itemObserver.observe(el));
}

/* ====================================================
   FADE OUT HERO CONTENT — fondu au scroll
   ==================================================== */
function initHeroContentFade() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const getAbsoluteTop = (el) => {
        let top = 0;
        while (el) { top += el.offsetTop; el = el.offsetParent; }
        return top;
    };

    let contentTop    = getAbsoluteTop(heroContent);
    let contentHeight = heroContent.offsetHeight;

    window.addEventListener('resize', () => {
        contentTop    = getAbsoluteTop(heroContent);
        contentHeight = heroContent.offsetHeight;
    }, { passive: true });

    let ticking = false;

    const update = () => {
        const scrollY      = window.scrollY;
        const scrolledPast = scrollY - contentTop;
        const fadeStart    = contentHeight * 0.35;
        const fadeRange    = contentHeight * 0.5;

        if (scrolledPast <= fadeStart) {
            heroContent.style.opacity   = '1';
            heroContent.style.transform = 'translateY(0)';
        } else {
            const p = Math.min((scrolledPast - fadeStart) / fadeRange, 1);
            heroContent.style.opacity   = String(Math.max(1 - p, 0));
            heroContent.style.transform = `translateY(${-p * 50}px)`;
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update();
}

/* ====================================================
   PARALLAX LÉGER — photo du hero
   ==================================================== */
function initHeroParallax() {
    const photo = document.querySelector('.hero-photo');
    const hero  = document.getElementById('hero');
    if (!photo || !hero) return;

    /* Désactiver le parallax sur mobile (économise des ressources) */
    const mediaQuery = window.matchMedia('(min-width: 769px)');

    const onScroll = () => {
        if (!mediaQuery.matches) return;
        const scrolled = window.scrollY;
        if (scrolled < hero.offsetHeight) {
            photo.style.transform = `translateY(${scrolled * 0.12}px)`;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ====================================================
   PROTECTION DES IMAGES — clic droit désactivé
   ==================================================== */
function initImageProtection() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
        img.setAttribute('draggable', 'false');
    });
}

/* ====================================================
   ANNÉE DYNAMIQUE dans le footer
   ==================================================== */
function initFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
}

/* ====================================================
   SÉLECTEUR DE LANGUE — FR / EN
   ==================================================== */
const translations = {
    fr: {
        'nav.hero': 'Accueil',
        'nav.services': 'Services',
        'nav.projects': 'Projets',
        'nav.why': 'Pourquoi moi',
        'nav.contact': 'Contact',

        'hero.label': 'Présentation',
        'hero.title': 'Bonjour',
        'hero.subtitle': 'Vous avez une idée,<br>\n                je la transforme en site<br>\n                qui travaille pour vous <span class="accent">24h/24</span>',
        'hero.cta': 'Démarrons votre projet',

        'services.label': 'Services',
        'services.title': 'Mes <em>Services</em>',
        'services.showcase.title': 'Site vitrine',
        'services.showcase.desc': 'Un site élégant pour présenter votre entreprise, vos services et convaincre vos visiteurs de vous contacter.',
        'services.shop.title': 'Boutique en ligne',
        'services.shop.desc': 'Une boutique e-commerce clé en main pour vendre vos produits 24h/24 et encaisser des commandes pendant que vous dormez.',
        'services.app.title': 'Application web sur mesure',
        'services.app.desc': 'Un outil numérique entièrement personnalisé pour automatiser votre business et gagner du temps au quotidien.',
        'services.design.title': 'Design unique',
        'services.design.desc': 'Un design qui vous ressemble et qui vous distingue de la concurrence, pour une image professionnelle sublimée.',

        'projects.label': 'Projets',
        'projects.title': 'Mes <em>Réalisations</em>',
        'projects.text': 'Vous souhaitez voir mes réalisations ?<br>\n                    Chaque projet est unique et confidentiel.<br>\n                    Écrivez-moi directement et je vous envoie<br>\n                    mes travaux en privé selon votre domaine.',
        'projects.cta': 'Voir mes projets',

        'why.label': 'Pourquoi moi',
        'why.title': 'Pourquoi <em>faydi.dev</em>&nbsp;?',
        'why.fast.title': 'Livraison rapide',
        'why.fast.desc': 'Votre site en ligne en 7 à 14 jours. Garanti.',
        'why.comm.title': 'Communication claire',
        'why.comm.desc': 'Vous recevez une mise à jour à chaque étape.<br>Vous savez toujours où on en est.',
        'why.design.title': 'Design sur mesure',
        'why.design.desc': 'Un design unique créé pour vous.<br>Vos clients voient la différence.',
        'why.support.title': 'Support après livraison',
        'why.support.desc': 'Je reste disponible après la mise en ligne.<br>Vous n\'êtes jamais seul.',

        'contact.label': 'Contact',
        'contact.title': 'Travaillons <em>ensemble</em>',
        'contact.text': 'Vous avez un projet en tête ? Décrivez-le moi et je vous reviens rapidement avec une proposition adaptée à vos besoins et à votre budget.',

        'form.name.label': 'Nom',
        'form.name.placeholder': 'Votre nom complet',
        'form.email.label': 'Email',
        'form.message.label': 'Message',
        'form.message.placeholder': 'Décrivez votre projet, vos besoins, votre budget estimé...',
        'form.website.label': 'Site web',
        'form.submit': 'Envoyer le message',

        'footer.rights': 'Tous droits réservés',
    },
    en: {
        'nav.hero': 'Home',
        'nav.services': 'Services',
        'nav.projects': 'Projects',
        'nav.why': 'Why me',
        'nav.contact': 'Contact',

        'hero.label': 'Introduction',
        'hero.title': 'Hello',
        'hero.subtitle': 'You have an idea,<br>\n                I turn it into a website<br>\n                that works for you <span class="accent">24/7</span>',
        'hero.cta': "Let's start your project",

        'services.label': 'Services',
        'services.title': 'My <em>Services</em>',
        'services.showcase.title': 'Showcase website',
        'services.showcase.desc': 'An elegant website to showcase your business, your services, and convince visitors to contact you.',
        'services.shop.title': 'Online store',
        'services.shop.desc': 'A turnkey e-commerce store to sell your products 24/7 and take orders while you sleep.',
        'services.app.title': 'Custom web application',
        'services.app.desc': 'A fully customized digital tool to automate your business and save time every day.',
        'services.design.title': 'Unique design',
        'services.design.desc': 'A design that reflects who you are and sets you apart from the competition, for a polished professional image.',

        'projects.label': 'Projects',
        'projects.title': 'My <em>Work</em>',
        'projects.text': "Want to see my work?<br>\n                    Every project is unique and confidential.<br>\n                    Message me directly and I'll send you<br>\n                    my work privately based on your field.",
        'projects.cta': 'See my work',

        'why.label': 'Why me',
        'why.title': 'Why <em>faydi.dev</em>&nbsp;?',
        'why.fast.title': 'Fast delivery',
        'why.fast.desc': 'Your website live in 7 to 14 days. Guaranteed.',
        'why.comm.title': 'Clear communication',
        'why.comm.desc': 'You get an update at every step.<br>You always know where things stand.',
        'why.design.title': 'Custom design',
        'why.design.desc': 'A unique design created for you.<br>Your clients will see the difference.',
        'why.support.title': 'Support after delivery',
        'why.support.desc': "I stay available after launch.<br>You're never alone.",

        'contact.label': 'Contact',
        'contact.title': "Let's work <em>together</em>",
        'contact.text': "Have a project in mind? Describe it to me and I'll get back to you quickly with a proposal tailored to your needs and budget.",

        'form.name.label': 'Name',
        'form.name.placeholder': 'Your full name',
        'form.email.label': 'Email',
        'form.message.label': 'Message',
        'form.message.placeholder': 'Describe your project, your needs, your estimated budget...',
        'form.website.label': 'Website',
        'form.submit': 'Send message',

        'footer.rights': 'All rights reserved',
    },
};

function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key] !== undefined) el.setAttribute('title', dict[key]);
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    localStorage.setItem('lang', lang);
}

function initLanguageSwitch() {
    const buttons = document.querySelectorAll('.lang-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
    });

    const savedLang = localStorage.getItem('lang') || 'fr';
    applyLanguage(savedLang);
}

/* ====================================================
   INIT
   ==================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
    initHeroContentFade();
    initHeroParallax();
    initFooterYear();
    initImageProtection();
    initLanguageSwitch();

    /* Lancer la détection de section active dès le chargement */
    updateActiveNavDot();
});

window.addEventListener('scroll', updateActiveNavDot, { passive: true });
