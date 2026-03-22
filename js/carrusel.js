// CARRUSEL HERO - FUNCIONALIDAD
// GMK SEGUROS - 2026
// JavaScript nativo (Vanilla JS) - Sin dependencias
// =============================================

class HeroCarousel {
    constructor(options = {}) {
        // Configuración por defecto
        this.config = {
            containerSelector: '.hero-carousel',
            autoplayDelay: 5000, // 5 segundos
            pauseOnHover: true,
            transitionSpeed: 350, // ms (coincide con --transition-slow)
            swipeThreshold: 50, // Distancia mínima para detectar swipe en móviles
            ...options // Permite sobrescribir config al instanciar
        };

        // Elementos del DOM
        this.container = document.querySelector(this.config.containerSelector);
        
        // Si no existe el carrusel en la página, salimos silenciosamente
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.hero-carousel__slide');
        this.indicators = this.container.querySelectorAll('.hero-carousel__indicator');
        this.prevButton = this.container.querySelector('.hero-carousel__arrow--prev');
        this.nextButton = this.container.querySelector('.hero-carousel__arrow--next');
        this.timerProgress = this.container.querySelector('.hero-carousel__timer-progress');
        
        // Estado del carrusel
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        this.isPaused = false;
        this.isTransitioning = false; // Para evitar clics múltiples durante la animación
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Inicializar el carrusel
        this.init();
    }
    
    // =========================================
    // INICIALIZACIÓN
    // =========================================
    init() {
        // Si no hay slides, no hacemos nada
        if (this.totalSlides === 0) return;
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Iniciar autoplay
        this.startAutoplay();
        
        // Mostrar el primer slide (por si acaso)
        this.goToSlide(0);
        
        console.log('Carrusel inicializado correctamente');
    }
    
    // =========================================
    // MANEJO DE EVENTOS
    // =========================================
    setupEventListeners() {
        // Eventos de botones
        if (this.prevButton) {
            this.prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
        
        // Eventos de indicadores (puntos)
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(index);
            });
        });
        
        // Pausar al hover (si está configurado)
        if (this.config.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
        }
        
        // Eventos táctiles para móviles (swipe)
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        
        // Teclado para accesibilidad
        document.addEventListener('keydown', (e) => {
            // Solo si el carrusel está visible en pantalla
            if (!this.isElementInViewport(this.container)) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
        
        // Pausar cuando la pestaña no está visible (ahorra recursos)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
    }
    
    // =========================================
    // NAVEGACIÓN PRINCIPAL
    // =========================================
    goToSlide(index) {
        // Validar índice
        if (index < 0 || index >= this.totalSlides) return;
        if (this.isTransitioning) return; // Evitar cambios durante la animación
        
        // Si ya estamos en ese slide, no hacer nada
        if (index === this.currentIndex) return;
        
        this.isTransitioning = true;
        
        // Actualizar slides (quitar clase active de todos, poner al nuevo)
        this.slides.forEach(slide => {
            slide.classList.remove('is-active');
        });
        this.slides[index].classList.add('is-active');
        
        // Actualizar indicadores
        this.indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('is-active');
                indicator.setAttribute('aria-selected', 'true');
            } else {
                indicator.classList.remove('is-active');
                indicator.setAttribute('aria-selected', 'false');
            }
        });
        
        // Actualizar índice actual
        this.currentIndex = index;
        
        // Reiniciar barra de progreso
        this.resetTimerProgress();
        
        // Después de la transición, permitir nuevos clics
        setTimeout(() => {
            this.isTransitioning = false;
        }, this.config.transitionSpeed);
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    // =========================================
    // MANEJO DE SWIPE EN MÓVILES
    // =========================================
    handleSwipe() {
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        // Detectar dirección del swipe
        if (Math.abs(swipeDistance) > this.config.swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe hacia la derecha → slide anterior
                this.prevSlide();
            } else {
                // Swipe hacia la izquierda → slide siguiente
                this.nextSlide();
            }
        }
    }
    
    // =========================================
    // AUTOPLAY (CAMBIOS AUTOMÁTICOS)
    // =========================================
    startAutoplay() {
        if (this.autoplayInterval) return; // Ya está corriendo
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.config.autoplayDelay);
        
        // Iniciar animación de la barra de progreso
        this.startTimerProgress();
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    pauseAutoplay() {
        this.isPaused = true;
        this.container.classList.add('hero-carousel--paused');
    }
    
    resumeAutoplay() {
        this.isPaused = false;
        this.container.classList.remove('hero-carousel--paused');
        
        // Reiniciar barra de progreso (empieza de nuevo)
        this.resetTimerProgress();
    }
    
    // =========================================
    // BARRA DE PROGRESO VISUAL
    // =========================================
    startTimerProgress() {
        if (!this.timerProgress) return;
        
        // Resetear la barra
        this.timerProgress.style.transition = 'none';
        this.timerProgress.style.width = '0%';
        
        // Forzar reflow para que la animación funcione
        void this.timerProgress.offsetWidth;
        
        // Iniciar animación
        this.timerProgress.style.transition = `width ${this.config.autoplayDelay}ms linear`;
        this.timerProgress.style.width = '100%';
    }
    
    resetTimerProgress() {
        if (!this.timerProgress) return;
        
        // Detener animación actual y reiniciar
        this.timerProgress.style.transition = 'none';
        this.timerProgress.style.width = '0%';
        
        // Si no está pausado, iniciar nueva animación
        if (!this.isPaused && this.autoplayInterval) {
            // Pequeño delay para que la reinicialización se vea suave
            setTimeout(() => {
                this.startTimerProgress();
            }, 50);
        }
    }
    
    // =========================================
    // UTILIDADES
    // =========================================
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // =========================================
    // MÉTODOS PÚBLICOS (POR SI SE NECESITAN DESDE FUERA)
    // =========================================
    destroy() {
        // Limpiar todo al salir (útil para SPAs)
        this.stopAutoplay();
        
        // Remover clases
        this.slides.forEach(slide => {
            slide.classList.remove('is-active');
        });
        this.indicators.forEach(indicator => {
            indicator.classList.remove('is-active');
        });
        
        // Remover event listeners no es estrictamente necesario
        // si el elemento se va a eliminar del DOM
        
        console.log('Carrusel destruido');
    }
}

// =========================================
// INICIALIZACIÓN AUTOMÁTICA
// =========================================
// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el carrusel
    const carousel = new HeroCarousel();
    
    // Si necesitas múltiples carruseles en la misma página:
    // document.querySelectorAll('.hero-carousel').forEach(container => {
    //     new HeroCarousel({ containerSelector: `#${container.id}` });
    // });
    
    // Exponer globalmente para debugging (opcional)
    window.heroCarousel = carousel;
});