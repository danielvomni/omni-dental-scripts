// Script templates by treatment type
const SCRIPT_TEMPLATES = {

  implantes: {
    label: "Implantes Dentales",
    icon: "🦷",
    steps: [
      { title: "Saludo + Encaje + Ubicación", text: (c) => `Hola <b>[Nombre]</b>, te llamo de <b>${c.name}</b> porque dejaste una solicitud para una cita de valoración gratuita de <b>implantes dentales</b>, ¿correcto? Estamos en <b>${c.address}</b>${c.ref && c.ref !== '—' ? `, cerca de ${c.ref}` : ''}. ¿La zona te suena?`, note: "→ Si no conoce la zona: No hay problema, le enviaremos la ubicación exacta y el enlace de Google Maps por WhatsApp." },
      { title: "Autoridad + Oferta", text: (c) => { let t = `Perfecto. Antes de seguir, te explico muy rápido: esta llamada puede ser grabada por motivos de calidad.`; if (c.valuePoints) t += `\n\nEn <b>${c.name}</b> trabajamos con <b>${c.valuePoints}</b>.`; if (c.promo && c.promo !== '—') t += `\n\nY ahora mismo tenemos una promoción vigente: <b>${c.promo}</b>, válida solo durante esta semana/mes para las primeras reservas.`; t += `\n\nY la primera visita ahora mismo sigue siendo totalmente gratuita dentro de la campaña activa.`; return t; } },
      { title: "Motivo de la visita", text: () => `Para ayudarte bien, ¿qué es exactamente lo que necesitas? ¿Una rehabilitación completa o solo una pieza en concreto?`, note: "→ Escuchar respuesta y resumir: «Perfecto, entonces vienes por ______.»" },
      { title: "Cualificación Documental", text: (c) => `Para poder abrir tu ficha y que el especialista te atienda, ¿qué documentación tienes disponible? Aceptamos: <b>${c.qualifDoc}</b>.`, rebate: (c) => `Te entiendo perfectamente [Nombre], nos encantaría poder ayudarte. El tema es que para esta campaña específica trabajamos con una financiera externa que, por normativa, nos exige presentar <b>${c.qualifDoc}</b>.\n\nSé que es un fastidio... si te parece bien, dejo tu ficha anotada y en cuanto cambien las condiciones te doy un aviso, ¿te parece bien? <b>(Finalizar llamada)</b>` },
      { title: "Cualificación Económica", text: () => `Cuando un paciente quiere financiar el tratamiento, las entidades suelen pedir cierta documentación. ¿Qué situación laboral o de ingresos tienes tú ahora mismo?`, note: (c) => `→ Aceptamos: <b>${c.qualifEcon}</b>.\n→ Si menciona ingresos regulares: Pasamos al siguiente bloque.\n→ Si solo dice ‹Trabajo›: «¿Cómo recibes tus ingresos? ¿Por nómina o eres autónomo?»`, rebate: () => `Te comprendo totalmente. El tema es que las entidades financieras nos piden ingresos regulares (nómina, jubilación, autónomo) para poder aprobarlo.\n\nNo te preocupes, lo dejamos anotado. Si más adelante tu situación cambia, avísanos con confianza y retomamos. ¡Mucho ánimo! <b>(Finalizar llamada)</b>`, condition: "econQualif" },
      { title: "Valor + Urgencia", text: (c) => `Perfecto, entonces sí puedes optar tanto al diagnóstico como a la financiación.${(c.promo && c.promo !== '—') ? ` Como te decía, la promoción de <b>${c.promo}</b> es para las primeras 10 personas que reserven.` : ''}` },
      { title: "Verificación de datos", text: () => `Antes de agendar, necesito confirmar tus datos para abrir bien tu ficha. ¿Me confirmas tu nombre y apellido?`, note: "→ Si solo da nombre: «¿Me podrías facilitar también tus apellidos? Es para que tu ficha quede registrada correctamente.»" },
      { title: "Agendamiento", text: () => `¿Te viene mejor por la mañana o por la tarde?`, note: "→ Ofrecer un único horario exacto dentro de las próximas 72h.", rebate: () => `No pasa nada. Tengo otra opción dentro de los próximos 3 días: [alternativa]. Si prefieres más adelante, te llamo dos días antes. ¿A qué hora te viene bien?` },
      { title: "Resumen Final", text: (c) => `Perfecto: tu cita queda programada para el [Día] a las [Hora], en <b>${c.name}</b> (${c.address}). Ahora te envío por WhatsApp la ubicación e información. ¿Tienes alguna duda rápida?`, highlight: true }
    ],
    rebates: [
      { label: "NO QUIERE AGENDAR EN CORTO PLAZO", response: "Claro, no hay problema.\n\nLo que sí te recomiendo es hacer primero la valoración, porque así el especialista puede revisar tu caso con calma y decirte exactamente qué opciones tendrías y qué necesitarías realmente.\n\nAdemás, ahora mismo sigue activa la promoción especial y estamos trabajando con pocos huecos para primeras visitas. Lo ideal sería dejarte ya una cita reservada para que no te quedes sin disponibilidad mientras la promoción sigue vigente.", cierre: "¿Qué te suele venir mejor normalmente, mañana o tarde?" },
      { label: "QUIERE SABER EL PRECIO ANTES", response: "Te entiendo perfectamente. Mucha gente nos pregunta eso primero.\n\nLo que pasa es que en implantes el precio cambia bastante según el número de piezas, el estado del hueso y si hace falta algún procedimiento adicional.\n\nPor eso el especialista primero hace la valoración y ya sales con un presupuesto claro y adaptado a tu caso, sin compromiso.", cierre: "¿Te viene mejor una visita por la mañana o por la tarde?" },
      { label: "NO QUIERE IR SIN SABER INFORMACIÓN CONCRETA", response: "Es totalmente normal querer entender bien el tratamiento antes de venir.\n\nPrecisamente la primera visita es gratuita para eso: el especialista revisa tu caso, te explica qué opciones tienes, cómo sería el procedimiento y resuelve todas tus dudas con calma.\n\nY lo más importante: vienes simplemente a informarte y valorar opciones, sin ningún compromiso de empezar el tratamiento.", cierre: "¿Qué horario te suele venir mejor?" },
      { label: "TIENE QUE PENSARLO", response: "Claro, es una decisión importante y es normal querer pensarlo bien.\n\nDe hecho, muchos pacientes primero vienen a la valoración gratuita precisamente para tener toda la información clara antes de decidir nada.\n\nAsí puedes valorar opciones, tiempos y presupuesto con tranquilidad y sin compromiso.", cierre: "¿Te dejo un hueco y ya luego decides con calma?" },
      { label: "TIENE QUE CONSULTARLO CON SU PAREJA O FAMILIA", response: "Perfecto, es completamente normal.\n\nDe hecho, muchas veces viene la pareja o un familiar para escuchar toda la información juntos y así tomar la decisión con tranquilidad.\n\nSi quieres, podéis venir los dos a la valoración y el especialista os explica todo directamente.", cierre: "¿Qué día os encajaría mejor?" },
      { label: "MIEDO AL DENTISTA", response: "Es más común de lo que imaginas, de verdad.\n\nMuchos pacientes vienen con ese mismo miedo y precisamente por eso el especialista suele ir explicando todo con mucha calma y sin hacer nada que el paciente no entienda o no quiera.\n\nAdemás, en esta primera visita solo se hace la valoración y te explican el procedimiento paso a paso.", cierre: "¿Te parece si te reservamos un hueco tranquilo para que puedas informarte sin presión?" },
      { label: "YO ME PASO POR LA CLÍNICA", response: "Perfecto, también puedes acercarte directamente si lo prefieres.\n\nLo único es que la primera visita gratuita forma parte de esta campaña y solo podemos garantizarla a las personas que dejan la cita reservada previamente por este medio.\n\nSi vienes sin cita, por supuesto te atenderán con gusto, pero dependiendo de la disponibilidad y del tipo de valoración, la visita podría tener coste.\n\nSi quieres, te la dejo reservada ahora mismo y así te aseguras la valoración gratuita.", cierre: "¿Te suele venir mejor por la mañana o por la tarde?" }
    ]
  },

  ortodoncia: {
    label: "Ortodoncia",
    icon: "😁",
    steps: [
      { title: "Saludo + Encaje + Ubicación", text: (c) => `Hola <b>[Nombre]</b>, te llamo de <b>${c.name}</b> en <b>${c.city || ''}</b> porque dejaste una solicitud para una cita de valoración gratuita de <b>ortodoncia</b>, ¿correcto? Estamos en <b>${c.address}</b>${c.ref && c.ref !== '—' ? `, cerca de ${c.ref}` : ''}. ¿La zona te suena?`, note: "→ Si no conoce la zona: enviaremos ubicación por WhatsApp." },
      { title: "Autoridad + Oferta", text: (c) => { let t = `Perfecto. Esta llamada puede ser grabada por motivos de calidad.`; if (c.valuePoints) t += `\n\nEn <b>${c.name}</b> trabajamos con <b>${c.valuePoints}</b>.`; if (c.promo && c.promo !== '—') t += `\n\nPromoción vigente: <b>${c.promo}</b>.`; t += `\n\nY la primera visita ahora mismo sigue siendo totalmente gratuita dentro de la campaña activa.`; return t; } },
      { title: "Motivo de la visita", text: () => `Para ayudarte bien, ¿qué es exactamente lo que necesitas? ¿Es un tratamiento desde cero o una revisión de algo que ya llevas?`, note: "→ Resumir: «Perfecto, entonces vienes por ______.»" },
      { title: "Cualificación Documental", text: (c) => `Para poder abrir tu ficha, ¿qué documentación tienes disponible? Aceptamos: <b>${c.qualifDoc}</b>.`, rebate: (c) => `Te entiendo perfectamente, nos encantaría poder ayudarte. El tema es que para esta campaña específica trabajamos con una financiera que, por normativa, nos exige presentar <b>${c.qualifDoc}</b>. ¿Te parece que te avise si cambian estas condiciones? <b>(Finalizar)</b>` },
      { title: "Cualificación Económica", text: () => `¿Qué situación laboral o de ingresos tienes ahora mismo?`, note: (c) => `→ Aceptamos: <b>${c.qualifEcon}</b>.`, rebate: () => `Te comprendo totalmente. El tema es que las entidades financieras nos piden ingresos regulares. No te preocupes, lo dejamos anotado por si más adelante cambia tu situación. ¡Mucho ánimo! <b>(Finalizar)</b>`, condition: "econQualif" },
      { title: "Valor + Urgencia", text: (c) => `Perfecto.${(c.promo && c.promo !== '—') ? ` La promoción de <b>${c.promo}</b> es para las primeras 10 personas que reserven.` : ''}` },
      { title: "Verificación de datos", text: () => `¿Me confirmas tu nombre y apellido?`, note: "→ Pedir apellidos si solo da nombre." },
      { title: "Agendamiento", text: () => `¿Te viene mejor por la mañana o por la tarde?`, rebate: () => `No pasa nada. Tengo otra opción dentro de los próximos 3 días.` },
      { title: "Resumen Final", text: (c) => `${(c.promo && c.promo !== '—') ? `La oferta actual es <b>${c.promo}</b>. ` : ''}Tu cita queda para el [día] a las [hora] en <b>${c.name}</b> (${c.address}). Te envío info por WhatsApp. ¿Alguna duda?`, highlight: true }
    ]
  },

  carillas: {
    label: "Carillas",
    icon: "✨",
    steps: [
      { title: "Saludo + Encaje + Ubicación", text: (c) => `Hola <b>[Nombre]</b>, te llamo de <b>${c.name}</b> porque dejaste una solicitud para una cita de valoración gratuita de <b>carillas</b>, ¿correcto? Estamos en <b>${c.address}</b>${c.ref && c.ref !== '—' ? `, cerca de ${c.ref}` : ''}. ¿La zona te suena?`, note: "→ Si no conoce la zona: enviaremos ubicación por WhatsApp." },
      { title: "Autoridad + Oferta", text: (c) => { let t = `Esta llamada puede ser grabada por motivos de calidad.`; if (c.valuePoints) t += `\n\nEn <b>${c.name}</b> trabajamos con <b>${c.valuePoints}</b>.`; if (c.promo && c.promo !== '—') t += `\n\nPromoción: <b>${c.promo}</b>.`; t += `\n\nY la primera visita ahora mismo sigue siendo totalmente gratuita dentro de la campaña activa.`; return t; } },
      { title: "Motivo de la visita", text: () => `¿Qué es exactamente lo que te gustaría mejorar de tus dientes? ¿Color, forma, desgaste…?`, note: "→ Resumir: «Perfecto, entonces vienes por ______.»" },
      { title: "Cualificación Documental", text: (c) => `¿Qué documentación tienes disponible? Aceptamos: <b>${c.qualifDoc}</b>.`, rebate: (c) => `Te entiendo perfectamente, nos encantaría poder ayudarte. El tema es que para esta campaña específica trabajamos con una financiera que nos exige presentar <b>${c.qualifDoc}</b>. ¿Te aviso si cambian las condiciones? <b>(Finalizar)</b>` },
      { title: "Cualificación Económica", text: () => `¿Qué situación laboral o de ingresos tienes?`, note: (c) => `→ Aceptamos: <b>${c.qualifEcon}</b>.`, rebate: () => `Te comprendo totalmente. Las entidades nos piden ingresos regulares. Lo dejamos anotado por si más adelante cambia tu situación. <b>(Finalizar)</b>`, condition: "econQualif" },
      { title: "Valor + Urgencia", text: (c) => `Perfecto.${(c.promo && c.promo !== '—') ? ` La promoción de <b>${c.promo}</b> es para las primeras 10 reservas.` : ''}` },
      { title: "Verificación de datos", text: () => `¿Me confirmas tu nombre y apellido?` },
      { title: "Agendamiento", text: () => `¿Te viene mejor por la mañana o por la tarde?`, rebate: () => `Tengo otra opción en los próximos 3 días.` },
      { title: "Resumen Final", text: (c) => `${(c.promo && c.promo !== '—') ? `Oferta: <b>${c.promo}</b>. ` : ''}Cita para el [día] a las [hora] en <b>${c.name}</b>. Te envío info por WhatsApp.`, highlight: true }
    ]
  },

  blanqueamiento: {
    label: "Blanqueamiento",
    icon: "🪥",
    steps: [
      { title: "Saludo + Encaje + Ubicación", text: (c) => `Hola <b>[Nombre]</b>, te llamo de <b>${c.name}</b> porque dejaste una solicitud para una cita de valoración gratuita de <b>blanqueamiento dental</b>, ¿correcto? Estamos en <b>${c.address}</b>${c.ref && c.ref !== '—' ? `, cerca de ${c.ref}` : ''}. ¿La zona te suena?` },
      { title: "Autoridad + Oferta", text: (c) => { let t = `Esta llamada puede ser grabada por motivos de calidad.`; if (c.valuePoints) t += `\n\nEn <b>${c.name}</b> trabajamos con <b>${c.valuePoints}</b>.`; if (c.promo && c.promo !== '—') t += `\n\nPromoción: <b>${c.promo}</b>.`; t += `\n\nY la primera visita ahora mismo sigue siendo totalmente gratuita dentro de la campaña activa.`; return t; } },
      { title: "Motivo de la visita", text: () => `¿Qué te gustaría mejorar con el blanqueamiento? ¿Aclarar manchas o mejorar el aspecto general?`, note: "→ Resumir: «Perfecto, entonces vienes por ______.»" },
      { title: "Cualificación Documental", text: (c) => `¿Qué documentación tienes? Aceptamos: <b>${c.qualifDoc}</b>.`, rebate: (c) => `Te entiendo perfectamente. Solo tramitamos con <b>${c.qualifDoc}</b> por exigencia de la financiera. ¿Te aviso si cambia? <b>(Finalizar)</b>` },
      { title: "Valor + Urgencia", text: (c) => `${(c.promo && c.promo !== '—') ? `La promoción de <b>${c.promo}</b> es para las primeras 10 reservas.` : 'Perfecto, procedemos a agendar tu cita.'}` },
      { title: "Verificación de datos", text: () => `¿Me confirmas tu nombre y apellido?` },
      { title: "Agendamiento", text: () => `¿Te viene mejor por la mañana o por la tarde?` },
      { title: "Resumen Final", text: (c) => `${(c.promo && c.promo !== '—') ? `Oferta: <b>${c.promo}</b>. ` : ''}Cita el [día] a las [hora] en <b>${c.name}</b>. Te envío info por WhatsApp.`, highlight: true }
    ]
  },

  estetica_fhos: {
    label: "FHOS Bioluminiscente",
    icon: "💆",
    steps: [
      { title: "Saludo + Ubicación", text: (c) => `Hola <b>[Nombre]</b>, te llamo de <b>${c.name}</b> acá en Algeciras porque dejaste una solicitud para una cita de valoración gratuita de <b>FHOS Bioluminiscente</b>, ¿correcto? Estamos en <b>${c.address}</b>${c.ref && c.ref !== '—' ? `, cerca de ${c.ref}` : ''}. ¿La zona te suena?` },
      { title: "Pitch de Valor", text: () => `Esta llamada puede ser grabada por motivos de calidad.\n\nEl FHOS Bioluminiscente es un tratamiento innovador de bioestimulación facial que utiliza luz fría para activar el colágeno, mejorar la elasticidad de la piel y aportar un efecto rejuvenecedor visible desde la primera sesión.\n\nY la primera visita ahora mismo sigue siendo totalmente gratuita dentro de la campaña activa.` },
      { title: "Verificación de datos", text: () => `Antes de agendar, necesito confirmar tus datos. ¿Me confirmas tu nombre y apellido?` },
      { title: "Agendamiento", text: () => `¿Te viene mejor por la mañana o por la tarde?`, rebate: () => `No pasa nada. Tengo otra opción en los próximos 3 días.` },
      { title: "Resumen Final", text: (c) => `Tu cita queda para el [día] a las [hora] en <b>${c.name}</b> (${c.address}). Te envío info por WhatsApp. ¿Alguna duda?`, highlight: true }
    ]
  },

  estetica_soler: {
    label: "Estética Facial (Soler)",
    icon: "💎",
    steps: [
      { title: "Saludo + Ubicación", text: (c) => `Hola <b>[Nombre]</b>, te llamo de Clínica Dental & Estética Soler, aquí en L'Hospitalet de Llobregat porque dejaste una solicitud para una cita de valoración gratuita de <b>estética facial</b>, ¿correcto? Estamos en Plaza Española, 17. ¿La zona te suena?` },
      { title: "Pitch de Valor", text: () => `Esta llamada puede ser grabada por motivos de calidad.\n\nSomos una clínica familiar y cercana, especializada en tratamientos de estética facial personalizados. Contamos con parking gratuito.\n\nY la primera visita ahora mismo sigue siendo totalmente gratuita dentro de la campaña activa, e incluye:\n• Análisis facial completo\n• Plan estético adaptado a tu rostro\n• Simulación del resultado\n• Presupuesto detallado sin compromiso` },
      { title: "Verificación de datos", text: () => `¿Me confirmas tu nombre y apellido?` },
      { title: "Agendamiento", text: () => `¿Te viene mejor por la mañana o por la tarde?`, rebate: () => `Tengo otra opción en los próximos 3 días. ¿A qué hora te viene bien que te llame?` },
      { title: "Resumen Final", text: (c) => `Tu cita queda para el [día] a las [hora] en Clínica Dental & Estética Soler, Plaza Española 17, L'Hospitalet. Recuerda que incluye análisis facial completo y presupuesto. Te envío ubicación por WhatsApp. ¿Alguna duda?`, highlight: true }
    ]
  },

  implantes_fonseca: {
    label: "Implantes (Fonseca)",
    icon: "🦷",
    steps: [
      { title: "Saludo + Ubicación", text: () => `Hola <b>[Nombre]</b>, te llamo de <b>Clínica Dental Fonseca y Obando</b> porque dejaste una solicitud para una cita de valoración gratuita de <b>implantes dentales</b>, ¿correcto? Estamos en Calle del Gral. Ricardos, 138. ¿La zona te suena?`, note: "→ Si no conoce: enviaremos ubicación por WhatsApp." },
      { title: "Autoridad + Oferta", text: () => `Esta llamada puede ser grabada por motivos de calidad.\n\nAhora mismo tenemos una promoción vigente de <b>prótesis provisional gratuita</b> con tu tratamiento, válida para las primeras reservas. Y la primera visita ahora mismo sigue siendo totalmente gratuita dentro de la campaña activa.` },
      { title: "Motivo de la visita", text: () => `¿Qué es exactamente lo que necesitas? ¿Una rehabilitación completa o solo una pieza en concreto?`, note: "→ Resumir en 1 frase." },
      { title: "Cualificación Documental", text: () => `Para abrirte la ficha médica, ¿tienes DNI, NIE…?`, rebate: () => `Te entiendo perfectamente, nos encantaría poder ayudarte. El tema es que para esta campaña específica trabajamos con una financiera que nos exige presentar documentación válida en vigor. ¿Te aviso si cambian las condiciones? <b>(Finalizar)</b>` },
      { title: "Cualificación Económica (Camuflada)", text: () => `Para mirar qué hueco nos queda libre con el especialista... <b>¿eres de los que trabaja de mañana o lo haces por la tarde?</b>`, note: "→ Si confirma que trabaja: «¡Perfecto! En caso de que te agrade el presupuesto, contamos con financiación. ¿Recibes ingresos por nómina o eres autónomo?»\n→ Si no tiene ingresos: Preguntar si un familiar podría figurar como titular." },
      { title: "Valor + Urgencia", text: () => `Perfecto, entonces sí puedes optar tanto al diagnóstico como a la financiación. La promoción de prótesis provisional gratuita es para las primeras 10 reservas.` },
      { title: "Verificación de datos", text: () => `¿Me confirmas tu nombre y apellido?` },
      { title: "Agendamiento", text: () => `¿Te viene mejor por la mañana o por la tarde?`, rebate: () => `Tengo otra opción en los próximos 3 días.` },
      { title: "Resumen Final", text: () => `La oferta es prótesis provisional gratuita con tu tratamiento. Tu cita queda para el [día] a las [hora] en <b>Fonseca y Obando</b> (Gral. Ricardos 138). Te envío info por WhatsApp.`, highlight: true }
    ]
  },

  simplificado: {
    label: "Script Simplificado",
    icon: "⚡",
    steps: [
      { title: "Saludo", text: (c) => `Hola, buenos días. Soy [Tu Nombre], de <b>${c.name}</b>. ¿Hablo con <b>[Nombre Paciente]</b>?` },
      { title: "Oferta + Agendamiento", text: (c) => `Le llamo porque solicitó una valoración gratuita de [tratamiento]. La llamada se grabará por motivos de calidad. ¿Le viene mejor venir por la mañana o por la tarde?` },
      { title: "Confirmación", text: (c) => `Perfecto. Tengo libre el [Horario más cercano]. ¿Le va bien esa hora?\n\nExcelente. Le espero el [Horario acordado]. Estamos en <b>${c.address}</b>. En breve recibirá un mensaje con la dirección. ¡Que tenga un buen día!` }
    ]
  },

  reprogramacion: {
    label: "Reprogramación",
    icon: "📅",
    steps: [
      { title: "Introducción", text: (c) => `Hola <b>[Nombre]</b>, te hablo de <b>${c.name}</b>, ¿cómo estás?\n\nTenías una cita con nosotros el [Fecha] y veo que no lograste acudir, ¿correcto?` },
      { title: "Agendar nueva cita", text: (c) => `Por esta semana tenemos vigente la promoción <b>${c.promo}</b>. ¿Deseas agendar una nueva cita?\n\nNos quedan poquitas plazas. ¿Qué tal te viene si te doy una cita para [horario más cercano]?` },
      { title: "WhatsApp", text: (c) => `Nuestra dirección es <b>${c.address}</b>. Te compartiremos la información de la cita vía WhatsApp.` }
    ]
  },

  recontacto: {
    label: "Recontacto",
    icon: "📞",
    steps: [
      { title: "Saludo + Reenganche", text: (c) => `Hola <b>[Nombre]</b>, te llamo de <b>${c.name}</b>. Hace un tiempo nos dejaste tus datos para informarte sobre implantes dentales, pero al final se nos quedó la cita pendiente. Antes de cerrar el expediente, quería confirmar si todavía te interesa aprovechar la revisión gratuita y la promoción especial.`, note: "→ Si NO interesado: «Solo te lo decía porque tu ficha sigue abierta y puedes beneficiarte del descuento. ¿Qué días te suele venir mejor?»" },
      { title: "Autoridad + Oferta", text: (c) => `En <b>${c.name}</b> trabajamos con <b>${c.valuePoints}</b>. Tenemos: <b>${c.promo}</b>.\n\nY la primera visita ahora mismo sigue siendo totalmente gratuita dentro de la campaña activa.` },
      { title: "Motivo + Cualificación", text: (c) => `¿Qué es lo que necesitas? ¿Rehabilitación completa o pieza en concreto?\n\n¿Qué documentación tienes? Aceptamos: <b>${c.qualifDoc || 'DNI/NIE'}</b>.` },
      { title: "Verificación + Agendamiento", text: () => `¿Me confirmas nombre y apellido? ¿Te viene mejor mañana o tarde?` },
      { title: "Resumen Final", text: (c) => `Oferta: <b>${c.promo}</b>. Cita el [día] a las [hora] en <b>${c.name}</b>. Te envío info por WhatsApp.`, highlight: true }
    ]
  }
};
