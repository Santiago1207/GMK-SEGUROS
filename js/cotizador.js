// Archivo: cotizador.js
(function () {
    'use strict';

    // ─── STATE ───────────────────────────────────────────────────────────────────
    let currentStep = 1;
    const TOTAL_STEPS = 4;
    let selectedInsurance = null;

    // ─── QUESTIONS CONFIG ─────────────────────────────────────────────────────
    const questions = {
        auto: [
            { id: 'q_marca', label: 'Marca del vehículo', type: 'input', placeholder: 'Ej: Chevrolet, Toyota...' },
            { id: 'q_anio', label: 'Año del modelo', type: 'input', placeholder: 'Ej: 2020' },
            { id: 'q_ciudad', label: 'Ciudad de circulación', type: 'input', placeholder: 'Ej: Bogotá' },
            { id: 'q_uso', label: 'Uso del vehículo', type: 'pills', options: ['Personal', 'Trabajo', 'Ambos'] },
            { id: 'q_valor', label: 'Valor aproximado', type: 'select', options: ['Menos de $30M', '$30M – $60M', '$60M – $100M', 'Más de $100M'] },
        ],
        moto: [
            { id: 'q_marca', label: 'Marca de la moto', type: 'input', placeholder: 'Ej: Honda, Yamaha...' },
            { id: 'q_anio', label: 'Año del modelo', type: 'input', placeholder: 'Ej: 2021' },
            { id: 'q_ciudad', label: 'Ciudad de circulación', type: 'input', placeholder: 'Ej: Medellín' },
            { id: 'q_uso', label: 'Uso de la moto', type: 'pills', options: ['Personal', 'Domicilios', 'Otro'] },
        ],
        hogar: [
            { id: 'q_tipo', label: 'Tipo de inmueble', type: 'pills', options: ['Casa', 'Apartamento', 'Local'] },
            { id: 'q_estrato', label: 'Estrato', type: 'select', options: ['1', '2', '3', '4', '5', '6'] },
            { id: 'q_ciudad', label: 'Ciudad', type: 'input', placeholder: 'Ej: Bogotá' },
            { id: 'q_valor', label: 'Valor estimado del inmueble', type: 'select', options: ['Menos de $150M', '$150M – $300M', '$300M – $600M', 'Más de $600M'] },
        ],
        vida: [
            { id: 'q_edad', label: 'Tu edad', type: 'input', placeholder: 'Ej: 34' },
            { id: 'q_ingreso', label: 'Ingreso mensual aproximado', type: 'select', options: ['Menos de $2M', '$2M – $5M', '$5M – $10M', 'Más de $10M'] },
            { id: 'q_dep', label: 'Personas que dependen de ti', type: 'pills', options: ['Ninguna', '1 – 2', '3 o más'] },
            { id: 'q_obj', label: 'Objetivo del seguro', type: 'pills', options: ['Protección familiar', 'Ahorro', 'Retiro'] },
        ],
        salud: [
            { id: 'q_edad', label: 'Tu edad', type: 'input', placeholder: 'Ej: 28' },
            { id: 'q_plan', label: '¿Qué tipo de cobertura buscas?', type: 'pills', options: ['Individual', 'Familiar', 'Empresarial'] },
            { id: 'q_ciudad', label: 'Ciudad', type: 'input', placeholder: 'Ej: Cali' },
            { id: 'q_preex', label: '¿Tienes condiciones preexistentes?', type: 'pills', options: ['Sí', 'No', 'No sé'] },
        ],
        empresarial: [
            { id: 'q_tipo', label: 'Tipo de empresa', type: 'pills', options: ['PYME', 'Grande', 'Startup'] },
            { id: 'q_sector', label: 'Sector', type: 'select', options: ['Comercio', 'Servicios', 'Manufactura', 'Salud', 'Tecnología', 'Otro'] },
            { id: 'q_empleados', label: 'Número de empleados', type: 'select', options: ['1 – 10', '11 – 50', '51 – 200', 'Más de 200'] },
            { id: 'q_cob', label: '¿Qué deseas asegurar?', type: 'pills', options: ['Activos', 'Responsabilidad civil', 'Empleados', 'Todo'] },
        ],
        otro: [
            { id: 'q_desc', label: '¿Qué deseas asegurar?', type: 'input', placeholder: 'Cuéntanos brevemente...' },
            { id: 'q_ciudad', label: 'Ciudad', type: 'input', placeholder: 'Ej: Bogotá' },
        ],
    };

    // ─── DOM ELEMENTS ──────────────────────────────────────────────────────────
    const getEl = (id) => document.getElementById(id);

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    function updateProgress() {
        const pct = (currentStep / TOTAL_STEPS) * 100;
        const progressFill = getEl('progress-fill');
        const progressLabel = getEl('progress-label');
        const btnBack = getEl('btn-back');
        const btnNext = getEl('btn-next');

        if (progressFill) progressFill.style.width = pct + '%';
        if (progressLabel) progressLabel.textContent = `Paso ${currentStep} de ${TOTAL_STEPS}`;

        const stepDots = document.querySelectorAll('.step-dot');
        stepDots.forEach(dot => {
            const s = parseInt(dot.dataset.step);
            dot.classList.remove('active', 'done');
            if (s === currentStep) dot.classList.add('active');
            if (s < currentStep) dot.classList.add('done');
        });

        if (btnBack) btnBack.disabled = (currentStep === 1);
        checkNextEnabled();

        if (btnNext) btnNext.style.display = (currentStep === 4) ? 'none' : '';
    }

    function checkNextEnabled() {
        const btn = getEl('btn-next');
        if (!btn) return;

        if (currentStep === 1) {
            btn.disabled = !selectedInsurance;
        } else {
            btn.disabled = false;
        }
    }

    function goToStep(step) {
        const currentPanel = getEl('step-' + currentStep);
        const nextPanel = getEl('step-' + step);

        if (currentPanel) {
            currentPanel.classList.remove('active');
            currentPanel.classList.add('exit');
            setTimeout(() => {
                currentPanel.classList.remove('exit');
            }, 400);
        }

        currentStep = step;

        if (nextPanel) {
            nextPanel.classList.add('active');
        }
        updateProgress();
    }

    window.nextStep = function () {
        if (currentStep < TOTAL_STEPS) {
            if (currentStep === 1 && selectedInsurance) {
                buildQuestions(selectedInsurance);
            }
            goToStep(currentStep + 1);
        }
    };

    window.prevStep = function () {
        if (currentStep > 1) goToStep(currentStep - 1);
    };

    // ─── STEP 1 ───────────────────────────────────────────────────────────────
    window.selectInsurance = function (el) {
        const cards = document.querySelectorAll('.insurance-card');
        cards.forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        selectedInsurance = el.dataset.value;
        checkNextEnabled();
    };

    // ─── STEP 2 ───────────────────────────────────────────────────────────────
    function buildQuestions(type) {
        const qs = questions[type] || questions.otro;
        const container = getEl('questions-container');
        if (!container) return;
        container.innerHTML = '';

        const labels = {
            auto: 'Tu vehículo',
            moto: 'Tu moto',
            hogar: 'Tu hogar',
            vida: 'Tu perfil de vida',
            salud: 'Tu perfil de salud',
            empresarial: 'Tu empresa',
            otro: 'Tu necesidad',
        };

        const step2Title = getEl('step2-title');
        if (step2Title) step2Title.textContent = labels[type] || 'Cuéntanos más';

        qs.forEach(q => {
            const group = document.createElement('div');
            group.className = 'q-group';

            const label = document.createElement('label');
            label.className = 'q-label';
            label.textContent = q.label;
            group.appendChild(label);

            if (q.type === 'input') {
                const inp = document.createElement('input');
                inp.className = 'q-input';
                inp.type = 'text';
                inp.id = q.id;
                inp.placeholder = q.placeholder || '';
                group.appendChild(inp);

            } else if (q.type === 'select') {
                const wrap = document.createElement('div');
                wrap.className = 'q-select-wrap';
                const sel = document.createElement('select');
                sel.className = 'q-select';
                sel.id = q.id;
                const def = document.createElement('option');
                def.value = '';
                def.textContent = 'Selecciona una opción';
                sel.appendChild(def);
                q.options.forEach(o => {
                    const opt = document.createElement('option');
                    opt.value = o;
                    opt.textContent = o;
                    sel.appendChild(opt);
                });
                wrap.appendChild(sel);
                group.appendChild(wrap);

            } else if (q.type === 'pills') {
                const pillWrap = document.createElement('div');
                pillWrap.className = 'q-pills';
                q.options.forEach(o => {
                    const pill = document.createElement('div');
                    pill.className = 'q-pill';
                    pill.textContent = o;
                    pill.onclick = () => {
                        pillWrap.querySelectorAll('.q-pill').forEach(p => p.classList.remove('selected'));
                        pill.classList.add('selected');
                    };
                    pillWrap.appendChild(pill);
                });
                group.appendChild(pillWrap);
            }

            container.appendChild(group);
        });
    }

    // ─── STEP 4 ───────────────────────────────────────────────────────────────
    window.submitForm = function () {
        const nombre = getEl('f-nombre')?.value.trim() || '';
        const telefono = getEl('f-telefono')?.value.trim() || '';
        const email = getEl('f-email')?.value.trim() || '';

        if (!nombre || !telefono || !email) {
            alert('Por favor completa los campos de nombre, teléfono y correo.');
            return;
        }

        const card = getEl('cotizador');
        if (card) {
            card.innerHTML = `
                <div class="success-wrap">
                    <div class="success-icon">✅</div>
                    <h2 class="success-title">¡Cotización recibida!</h2>
                    <p class="success-msg">Hola <strong>${escapeHtml(nombre)}</strong>, un asesor de GMK Seguros se comunicará contigo pronto al número <strong>${escapeHtml(telefono)}</strong> con la mejor opción para ti.</p>
                </div>
            `;
        }
    };

    window.openWhatsApp = function () {
        const nombre = getEl('f-nombre')?.value.trim() || '';
        const seguro = selectedInsurance || 'seguro';
        const msg = encodeURIComponent(`Hola GMK Seguros 👋, me gustaría cotizar un *${seguro}*. Mi nombre es ${nombre || '(completar)'}.`);
        window.open(`https://wa.me/573142772874?text=${msg}`, '_blank');
    };

    // Función de seguridad para evitar XSS
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ─── INITIALIZE EVENT LISTENERS ───────────────────────────────────────────
    function init() {
        updateProgress();

        // Agregar event listeners para inputs en step 4 (validación en tiempo real)
        const inputsStep4 = ['f-nombre', 'f-telefono', 'f-email'];
        inputsStep4.forEach(id => {
            const input = getEl(id);
            if (input) {
                input.addEventListener('input', () => {
                    const btnNext = getEl('btn-next');
                    if (btnNext && currentStep === 4) {
                        // No hacemos nada específico, pero podemos mantener consistencia
                    }
                });
            }
        });

        // Prevenir envío de formulario por Enter
        const formElements = document.querySelectorAll('.f-input, .f-textarea');
        formElements.forEach(el => {
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        });
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();