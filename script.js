document.addEventListener('DOMContentLoaded', () => {
    const clinicSelect = document.getElementById('clinic-select');
    const scriptContent = document.getElementById('script-content');
    const quickInfo = document.getElementById('quick-info');
    
    // Elementos del Sidebar
    const infoLocation = document.getElementById('info-location');
    const infoRef = document.getElementById('info-ref');
    const infoOffer = document.getElementById('info-offer');
    const infoDocs = document.getElementById('info-docs');
    
    const copyBtn = document.getElementById('copy-btn');

    let clinicsData = [
    {
      "id": "clinica-dental-centro",
      "name": "Clínica Dental Centro",
      "address_short": "Calle Mayor 1",
      "reference_point": "al lado de la Puerta del Sol",
      "value_points": "cirugía guiada por ordenador, especialistas con más de 15 años de experiencia y tecnología 3D de última generación",
      "promotion": "implante completo con corona por solo 890€",
      "accepted_docs": "DNI o NIE permanente, y una nómina o pensión de al menos 900€",
      "location": "Calle Mayor 1, 28013 Madrid",
      "phone": "+34 912 345 678",
      "financing": {
        "provider": "Santander Consumer",
        "max_months_interest_free": 12,
        "max_months_total": 60,
        "min_amount": 300
      }
    },
    {
      "id": "dental-smile-vigo",
      "name": "Dental Smile Vigo",
      "address_short": "Avenida de la Marina 45",
      "reference_point": "frente al Club Náutico",
      "value_points": "expertos en carga inmediata (dientes en el mismo día) y sedación consciente para pacientes con miedo",
      "promotion": "2x1 en blanqueamiento al realizar tu primer implante",
      "accepted_docs": "DNI, NIE o Pasaporte con contrato de trabajo en vigor",
      "location": "Avenida de la Marina 45, 36201 Vigo",
      "phone": "+34 986 112 233",
      "financing": {
        "provider": "Sabadell Consumer",
        "max_months_interest_free": 24,
        "max_months_total": 48,
        "min_amount": 500
      }
    },
    {
      "id": "clinica-gijon",
      "name": "Clínica Dental Gijón",
      "address_short": "Calle Magnus Blikstad, 71",
      "reference_point": "en la misma calle que Los Alzas",
      "value_points": "más de 20 años de experiencia y un equipo de implantólogos altamente especializados. Ofrecemos carga inmediata, garantía en implantes de hasta 10 años y supervisión por el especialista de principio a fin",
      "promotion": "20% de descuento en el tratamiento completo",
      "accepted_docs": "DNI + Nómina, Jubilados, Terceros o Autónomos con ingresos regulares",
      "location": "Calle Magnus Blikstad, 71, 33207 Gijón, Asturias",
      "phone": "+34 985 000 000",
      "financing": {
        "provider": "Entidad Colaboradora",
        "max_months_interest_free": 12,
        "max_months_total": 60,
        "min_amount": 300
      }
    },
    {
      "id": "clinica-carranza-cadiz",
      "name": "Clínica Dental Carranza",
      "address_short": "Av. Cayetano del Toro, 34",
      "reference_point": "cerca del estadio Nuevo Mirandilla (donde era motos Payan)",
      "value_points": "carga inmediata, opción de sedación para pacientes nerviosos y más de 8 años de experiencia con 5000 pacientes atendidos",
      "promotion": "30% de descuento en Implantes y Ortodoncia + Blanqueamiento GRATIS al finalizar el tratamiento",
      "accepted_docs": "DNI/NIE/Pasaporte + Nómina, o DNI + cuenta bancaria/tarjeta, Jubilados, Terceros o Autónomos",
      "location": "Av. Cayetano del Toro, 34, 11010 Cádiz",
      "phone": "+34 956 000 000",
      "financing": {
        "provider": "Financiación Propia/Externa",
        "max_months_interest_free": 60,
        "max_months_total": 60,
        "min_amount": 200
      }
    }
  ];

    // Función para generar cada paso del guion
    function createStep(number, title, content, rebate = null) {
        let rebateHtml = rebate ? `
            <button class="btn-toggle" onclick="this.nextElementSibling.classList.toggle('active')">→ Mostrar Rebate (Si no cualifica)</button>
            <div class="conditional-box">
                ${rebate}
            </div>
        ` : '';

        return `
            <div class="step-container">
                <div class="step-title"><span class="step-number">${number}</span> ${title}</div>
                <div class="step-text">${content}</div>
                ${rebateHtml}
            </div>
        `;
    }

    // Cargar datos (Ahora locales)
    populateSelect();

    function populateSelect() {
        clinicSelect.innerHTML = '<option value="">-- Seleccione Clínica --</option>';
        clinicsData.forEach(clinic => {
            const option = document.createElement('option');
            option.value = clinic.id;
            option.textContent = clinic.name;
            clinicSelect.appendChild(option);
        });
    }

    clinicSelect.addEventListener('change', (e) => {
        const clinic = clinicsData.find(c => c.id === e.target.value);
        if (clinic) updateUI(clinic);
        else resetUI();
    });

    function updateUI(clinic) {
        quickInfo.style.display = 'block';
        infoLocation.textContent = clinic.address_short;
        infoRef.textContent = clinic.reference_point;
        infoOffer.textContent = clinic.promotion;
        infoDocs.textContent = clinic.accepted_docs;

        let html = "";

        // 1. Saludo
        html += createStep(1, "Saludo + Encaje + Ubicación", 
            `<p>Hola <strong>[Nombre]</strong>, te llamo de <strong>${clinic.name}</strong> porque dejaste una solicitud para implantes dentales. Estamos en <strong>${clinic.address_short}</strong>, ${clinic.reference_point}., ¿La zona te suena?</p>
            <p><em>→ Si dice que no conoce la zona:</em> No hay problema, le enviaremos la ubicación exacta y el enlace de Google Maps por Whatsapp.</p>`);

        // 2. Pitch
        html += createStep(2, "Autoridad + Oferta", 
            `<p>«Perfecto. Antes de seguir, te explico muy rápido: Bueno esta llamada puede ser grabada por motivos de calidad.</p>
            <p>En <strong>${clinic.name}</strong> trabajamos con <strong>${clinic.value_points}</strong>.</p>
            <p>Y ahora mismo tenemos una promoción vigente: <strong>${clinic.promotion}</strong>, válida solo durante esta semana/mes para las primeras reservas. Además, la primera cita es totalmente gratuita.»</p>`);

        // 3. Motivo
        html += createStep(3, "Motivo de la visita", 
            `<p>«Para ayudarte bien, ¿qué es exactamente lo que necesitas? ¿Una rehabilitación completa o solo una pieza en concreto?»</p>
            <p><em>→ Escuchar respuesta y resumir en 1 frase:</em> «Perfecto, entonces vienes por ______.»</p>`);

        // 4. Cualificación Documental
        html += createStep(4, "Cualificación Documental (Estricta)", 
            `<p>«Para poder abrir tu ficha y que el especialista te atienda, ¿qué documentación tienes disponible? Aceptamos: <strong>${clinic.accepted_docs}</strong>.»</p>`,
            `<p>«Te cuento, [Nombre]: Para esta campaña específica de salud dental, trabajamos con una entidad financiera externa que es la que gestiona las cuotas. Actualmente, sus condiciones de aprobación son muy estrictas... solo nos permiten tramitar solicitudes con <strong>${clinic.accepted_docs}</strong>.»</p>
             <p>Me sabe fatal... ¿Te parece que te avise si cambian estas condiciones? <strong>(Finalizar llamada)</strong></p>`);

        // 5. Cualificación Económica
        html += createStep(5, "Cualificación Económica", 
            `<p>«Cuando un paciente quiere financiar el tratamiento, las entidades suelen pedir cierta documentación. ¿Qué situación laboral o de ingresos tienes tú ahora mismo?»</p>
            <p><em>→ Si menciona ingresos regulares (nómina, autónomo, jubilado...):</em> Pasamos al siguiente bloque.</p>`,
            `<p>«Entiendo. En este caso, las entidades prefieren ingresos regulares. Si tu situación cambia, nos avisas y reabrimos la opción de financiación.» <strong>(Finalizar llamada)</strong></p>`);

        // 6. Cierre con Urgencia
        html += createStep(6, "Valor + Urgencia", 
            `<p>«Perfecto, entonces sí puedes optar tanto al diagnóstico como a la financiación. Como te decía, la promoción de <strong>${clinic.promotion}</strong> es para las primeras 10 personas que reserven.»</p>`);

        // 7. Datos y Agendamiento
        html += createStep(7, "Datos + Agendamiento", 
            `<p>«¿Me confirmas tu nombre y apellidos para la ficha? ¡Perfecto! ¿Te viene mejor por la mañana o por la tarde?»</p>
            <p><em>→ Ofrecer un único horario exacto en las próximas 72h.</em></p>`,
            `<p>«No pasa nada. Tengo otra opción dentro de los próximos 3 días: [alternativa]. Si prefieres más adelante, te llamo dos días antes. ¿A qué hora te viene bien?»</p>`);

        // 8. Resumen Final
        html += createStep(8, "Resumen Final", 
            `<div class="highlight-box">
                <p>«Perfecto: tu cita queda programada para el [Día] a las [Hora], en <strong>${clinic.name}</strong> (${clinic.address_short}). Ahora te envío por WhatsApp la ubicación e información. ¿Tienes alguna duda rápida?»</p>
            </div>`);

        scriptContent.innerHTML = html;

        // Actualizar Financiación
        const finDetails = document.getElementById('financing-details');
        finDetails.innerHTML = `
            <li style="margin-bottom:8px">✅ Hasta <strong>${clinic.financing.max_months_interest_free} meses</strong> SIN intereses</li>
            <li style="margin-bottom:8px">✅ Plazo máximo: ${clinic.financing.max_months_total} meses</li>
            <li style="margin-bottom:8px">✅ Entidad: ${clinic.financing.provider}</li>
        `;

        // Mostrar/Actualizar WhatsApp
        const waTile = document.getElementById('whatsapp-tile');
        const waPreview = document.getElementById('wa-preview');
        const waBtn = document.getElementById('wa-btn');

        waTile.style.display = 'block';
        waPreview.innerHTML = `Hola [Nombre], te confirmo tu cita para el [Día] a las [Hora] en <strong>${clinic.name}</strong> (${clinic.address_short}). Te envío la ubicación: ${clinic.location}`;

        waBtn.onclick = () => {
            const text = waPreview.innerText;
            navigator.clipboard.writeText(text).then(() => {
                waBtn.innerText = '¡Mensaje Copiado!';
                setTimeout(() => waBtn.innerText = 'Copiar Mensaje', 2000);
            });
        };
    }

    function resetUI() {
        quickInfo.style.display = 'none';
        scriptContent.innerHTML = "Seleccione una clínica para visualizar el guion...";
        document.getElementById('whatsapp-tile').style.display = 'none';
    }

    copyBtn.addEventListener('click', () => {
        const text = scriptContent.innerText.replace(/→ Mostrar Rebate.*/g, '');
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerText = '¡Copiado!';
            setTimeout(() => copyBtn.innerText = 'Copiar Todo', 2000);
        });
    });
});
