const { createApp, ref, reactive, computed, onMounted, onBeforeUnmount } = Vue;

/* ------------------------------------------------------------------
  Everything on the page comes from here
   or from index.html.
------------------------------------------------------------------- */

// Phone numbers as written locally (0XXXXXXXXX)
const PHONE_NUMBERS = ['0243631511', '0248683770', '0248714806', '0245276032'];

// email address !!
const EMAIL = 'info@adanfopa.com';

const toIntl = (n) => '233' + n.slice(1);
const toDisplay = (n) => `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;

const WHATSAPP_GREETING = 'Hello Adanfopa Commodities Ltd, ';

createApp({
  setup() {
    /* ---- phones ---- */
    const phones = PHONE_NUMBERS.map((raw) => ({
      raw,
      intl: toIntl(raw),
      display: toDisplay(raw),
      tel: `tel:+${toIntl(raw)}`,
      wa: `https://wa.me/${toIntl(raw)}`,
    }));

    /* ---- navigation ---- */
    const links = [
      { href: '#about', label: 'About' },
      { href: '#services', label: 'Sell or buy' },
      { href: '#process', label: 'How it works' },
      { href: '#faq', label: 'FAQ' },
      { href: '#contact', label: 'Contact' },
    ];
    const scrolled = ref(false);
    const navEl = ref(null);
    const onScroll = () => { scrolled.value = window.scrollY > 24; };
    const closeMenu = () => {
      const el = navEl.value;
      if (el && el.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(el).hide();
      }
    };

    /* ---- hero emblem ---- */
    const pieces = {
      tree: { title: 'On the farm', text: 'Cocoa trees grow on farms across Ghana\'s cocoa-growing regions.' },
      pod: { title: 'The pod', text: 'Ripe pods are cut from the tree by hand, then split open.' },
      beans: { title: 'The beans', text: 'Beans are fermented and dried before they are sold.' },
      open: { title: 'Inside the pod', text: 'Fresh beans sit in sweet white pulp, ready for fermenting.' },
    };
    const activePiece = ref('tree');

    /* ---- sell / buy tabs ---- */
    const audiences = {
      farmers: {
        tab: 'I grow cocoa',
        icon: 'bi-tree-fill',
        title: 'Sell your cocoa to Adanfopa',
        lead: 'We buy cocoa from farmers. Call any of our lines to agree a time and place to sell.',
        cta: 'Call to sell',
        points: [
          'Your cocoa is weighed openly, in front of you',
          'Quality is checked when we buy',
          'You are paid promptly, in cash or by mobile money',
        ],
      },
      buyers: {
        tab: 'I want to buy cocoa',
        icon: 'bi-bag-fill',
        title: 'Buy cocoa from Adanfopa',
        lead: 'We sell cocoa beans to buyers. Tell us how much you need and where, and we will reply with what is available.',
        cta: 'Call to buy',
        points: [
          'Ask for the quantity you need',
          'Get a clear answer on availability and price',
          'Reach us by phone or on WhatsApp',
        ],
      },
    };
    const audience = ref('farmers');

    /* ---- process ---- */
    const steps = [
      { icon: 'bi-telephone-fill', title: 'You call us', text: 'We agree when and where to meet.' },
      { icon: 'bi-speedometer2', title: 'We weigh and check', text: 'Your cocoa is weighed and its quality is checked.' },
      { icon: 'bi-cash-coin', title: 'We pay you', text: 'You are paid for what was weighed.' },
      { icon: 'bi-truck', title: 'We sell on', text: 'The cocoa goes on to buyers.' },
    ];

    /* ---- why choose us ---- */
    const reasons = [
      { icon: 'bi-person-check-fill', title: 'Straight from the farmer', text: 'We buy cocoa directly from the people who grow it.' },
      { icon: 'bi-chat-dots-fill', title: 'Easy to reach', text: 'Four phone lines, WhatsApp and email, all in one place.' },
      { icon: 'bi-clipboard-check-fill', title: 'Clear dealings', text: 'You know the weight, the quality check and the price before we agree.' },
    ];

    /* ---- gallery (replace the images in images/gallery with your own photos) ---- */
    const gallery = [
      { src: 'images/gallery/farm.jpg', alt: 'Cocoa tree with ripe pods', caption: 'The farm' },
      { src: 'images/gallery/pod.jpg', alt: 'A ripe cocoa pod', caption: 'The pod' },
      { src: 'images/gallery/open.jpg', alt: 'An opened cocoa pod full of beans', caption: 'Inside the pod' },
      { src: 'images/gallery/beans.jpg', alt: 'Dried cocoa beans', caption: 'The beans' },
    ];

    /* ---- FAQ ---- */
    const faqs = [
      { q: 'How do I sell my cocoa to Adanfopa?', a: 'Call any of our phone lines or send us a WhatsApp message. We will agree a time and place to meet.' },
      { q: 'What price will I get?', a: 'The price depends on the market and the quality of your cocoa. Call us for the current price.' },
      { q: 'How do I buy cocoa from you?', a: 'Tell us how much you need and where it should go, by phone, WhatsApp or email. We will reply with what is available.' },
      { q: 'Where are you?', a: 'Our office is in Santasi, Kumasi. Our postal address is P.O.Box SN 35, Santasi, Kumasi.' },
    ];

    /* ---- opening hours (confirm these) ---- */
    const hours = [
      { day: 'Monday to Friday', time: '8:00 am to 5:00 pm' },
      { day: 'Saturday', time: '8:00 am to 2:00 pm' },
      { day: 'Sunday', time: 'Closed' },
    ];

    /* ---- cocoa calendar ---- */
    // main: Oct-Mar, light: Jul-Sep, quiet: Apr-Jun (general pattern, confirm with your own experience)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const crops = ['main', 'main', 'main', 'quiet', 'quiet', 'quiet', 'light', 'light', 'light', 'main', 'main', 'main'];
    const months = monthNames.map((name, i) => ({ name, crop: crops[i] }));
    const currentMonth = new Date().getMonth();

    /* ---- contact form -> WhatsApp ---- */
    const form = reactive({
      name: '',
      email: '',
      to: phones[0].intl,
      topic: 'Sell my cocoa',
      message: '',
    });
    const waLink = computed(() => {
      let text = WHATSAPP_GREETING + `I would like to: ${form.topic.toLowerCase()}.`;
      if (form.message) text += ` ${form.message}`;
      if (form.name) text += ` (${form.name})`;
      if (form.email) text += ` Email: ${form.email}`;
      return `https://wa.me/${form.to}?text=${encodeURIComponent(text)}`;
    });

    const mailLink = computed(() => {
      const subject = `${form.topic} - enquiry for Adanfopa Commodities Ltd`;
      const body = [
        'Hello Adanfopa Commodities Ltd,',
        '',
        `I would like to: ${form.topic.toLowerCase()}.`,
        form.message,
        '',
        form.name ? `Name: ${form.name}` : '',
        form.email ? `My email: ${form.email}` : '',
      ].filter((l, i, a) => l || (i > 0 && a[i - 1] !== '')).join('\n');
      return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    const year = new Date().getFullYear();

    onMounted(() => {
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    });
    onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));

    return {
      phones, links, scrolled, navEl, closeMenu,
      pieces, activePiece,
      audiences, audience,
      steps,
      months, currentMonth,
      form, waLink, mailLink, EMAIL,
      reasons, gallery, faqs, hours,
      year,
    };
  },
})
  /* Reveal-on-scroll directive.
     v-reveal           fades the element up when it enters view
     v-reveal.watch     only adds .is-in (for custom CSS transitions) */
  .directive('reveal', {
    mounted(el, binding) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!binding.modifiers.watch) el.classList.add('reveal');
      if (binding.value && binding.value.delay) el.style.transitionDelay = binding.value.delay + 'ms';
      if (reduce || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.15 });
      io.observe(el);
    },
  })
  .mount('#app');
