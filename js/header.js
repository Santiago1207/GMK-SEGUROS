/* ============================================================================
   MAIN.JS - GMK SEGUROS
   Menú hamburguesa + Dropdown Ecosistema GMK
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------
       1. MENÚ HAMBURGUESA
    ------------------------------------------------------------------ */
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu   = document.querySelector('.nav__menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
                closeAllDropdowns();
            }
        });

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
                closeAllDropdowns();
                navToggle.focus();
            }
        });
    }


    /* ------------------------------------------------------------------
       2. DROPDOWN ECOSISTEMA GMK (mobile + táctil en desktop)
    ------------------------------------------------------------------ */
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav__link');

        link.addEventListener('click', (e) => {
            // Solo en mobile o dispositivos táctiles
            if (window.innerWidth < 1024 || isTouchDevice()) {
                e.preventDefault();

                const isOpen = item.classList.contains('open');

                // Cerrar otros dropdowns abiertos
                closeAllDropdowns();

                if (!isOpen) {
                    item.classList.add('open');
                    link.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });


    /* ------------------------------------------------------------------
       3. SOMBRA DEL HEADER AL HACER SCROLL
    ------------------------------------------------------------------ */
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }


    /* ------------------------------------------------------------------
       HELPERS
    ------------------------------------------------------------------ */
    function closeAllDropdowns() {
        document.querySelectorAll('.nav__item--dropdown.open').forEach(item => {
            item.classList.remove('open');
            const link = item.querySelector('.nav__link');
            if (link) link.setAttribute('aria-expanded', 'false');
        });
    }

    function isTouchDevice() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    }

});