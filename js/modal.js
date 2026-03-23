document.addEventListener('DOMContentLoaded', function() {
    
    // Mapeo de botones "VER MÁS" con sus respectivos modales
    const modales = {
        'vida': document.getElementById('modal-seguro-vida'),
        'salud': document.getElementById('modal-seguro-salud'),
        'exequial': document.getElementById('modal-seguro-exequial'),
        'accidentes': document.getElementById('modal-seguro-accidentes'),
        'hogar': document.getElementById('modal-seguro-hogar'),
        'arrendamiento': document.getElementById('modal-seguro-arrendamiento'),
        'copropiedades': document.getElementById('modal-seguro-copropiedades'),
        'auto': document.getElementById('modal-seguro-auto'),
        'moto': document.getElementById('modal-seguro-moto'),
        'micromovilidad': document.getElementById('modal-seguro-micromovilidad'),
        'rc': document.getElementById('modal-seguro-rc'),
        'fianzas': document.getElementById('modal-seguro-fianzas'),
        'empresarial': document.getElementById('modal-seguro-empresarial')
    };

    // Función para abrir modal
    function abrirModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evita scroll del fondo
        }
    }

    // Función para cerrar modal
    function cerrarModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restaura scroll
        }
    }

    // Event listeners para botones "VER MÁS" de las tarjetas principales
    // Asume que tus tarjetas tienen data-attribute: data-seguro="vida/salud/exequial"
    const botonesVerMas = document.querySelectorAll('[data-seguro]');
    
    botonesVerMas.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const tipoSeguro = this.getAttribute('data-seguro');
            abrirModal(modales[tipoSeguro]);
        });
    });

    // Cerrar al hacer clic en X
    const botonesCerrar = document.querySelectorAll('.modal-close');
    
    botonesCerrar.forEach(boton => {
        boton.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            cerrarModal(modal);
        });
    });

    // Cerrar al hacer clic fuera del contenido (en el overlay)
    const overlays = document.querySelectorAll('.modal-overlay');
    
    overlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal(this);
            }
        });
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            overlays.forEach(overlay => {
                if (overlay.classList.contains('activo')) {
                    cerrarModal(overlay);
                }
            });
        }
    });

});