/* ============================================================================
   HEADER.JS - GMK SEGUROS
   ============================================================================ */

console.log('=== HEADER.JS EJECUTANDO ===');

const dropdownItem = document.querySelector('.nav__item--dropdown');
const dropdownLink = dropdownItem ? dropdownItem.querySelector('.nav__link') : null;

console.log('dropdownItem:', dropdownItem);
console.log('dropdownLink:', dropdownLink);

if (!dropdownItem || !dropdownLink) {
    console.error('ERROR: No se encontró el dropdown');
} else {
    console.log('Agregando event listener...');
    
    dropdownLink.addEventListener('click', function(event) {
        console.log('=== CLICK DETECTADO ===');
        event.preventDefault();
        
        const isOpen = dropdownItem.classList.toggle('open');
        dropdownLink.setAttribute('aria-expanded', isOpen);
        
        console.log('Dropdown ahora está:', isOpen ? 'ABIERTO' : 'CERRADO');
    });
    
    console.log('Event listener agregado correctamente');
}

/**
 * Cerrar al hacer clic fuera
 */
document.addEventListener('click', function(event) {
    if (dropdownItem && !dropdownItem.contains(event.target)) {
        dropdownItem.classList.remove('open');
        if (dropdownLink) {
            dropdownLink.setAttribute('aria-expanded', 'false');
        }
    }
});