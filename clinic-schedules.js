// Horarios e información operativa validados desde Google Sheet.
// No sustituye la base original: solo añade datos complementarios cuando existen.
// No incluye la sección de notas para evitar exponer información sensible en la web pública.
// Incluye puntos de valor por tratamiento para evitar que el guion use puntos de implantes en otros tratamientos.
const CLINIC_SCHEDULES = {
  "palomero": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00h - 17:30h",
          "martes": "10:00h - 13:30h / 16:00h 19:30h",
          "miercoles": "10:00h - 17:30h",
          "jueves": "10:00h - 13:30h / 16:00h 19:30h",
          "viernes": "10:00h - 13:30h / 16:00h 17:30h"
        },
        "duracionCita": "30 Min"
      }
    },
    "ayudas": "No reciben pacientes con ayudas",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "NO",
    "agendamientoLargoPlazo": "SI"
  },
  "carranza": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00h - 13:00h",
          "martes": "10:00h - 13:00h / 16:00h - 19:00h",
          "miercoles": "10:00h - 13:00h / 16:00h - 19:00h",
          "jueves": "10:00h - 13:00h / 16:00h - 19:00h"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "NO",
        "valuePoints": "carga inmediata, opción de sedación si el paciente es nervioso, hasta 60 meses de financiación sin intereses, 8 años de experiencia y más de 5000 pacientes"
      },
      "blanqueamiento": {
        "horarios": {
          "lunes": "10:00h - 13:00h",
          "martes": "10:00h - 13:00h / 16:00h - 19:00h",
          "miercoles": "10:00h - 13:00h / 16:00h - 19:00h",
          "jueves": "10:00h - 13:00h / 16:00h - 19:00h"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "NO",
        "valuePoints": ""
      },
      "ortodoncia": {
        "horarios": {
          "miercoles": "10:00h - 13:30h / 16:00h - 19:30h",
          "jueves": "10:00h - 13:30h / 16:00h - 19:30h"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "SI",
        "valuePoints": ""
      }
    },
    "ayudas": "Podemos citar ayudas si el paciente tiene DNI + Cuenta bancaria.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Carranza\" para implantes. Subcuenta \"WhatsApp\" para blanqueamiento y ortodoncia",
    "seguros": "Se aceptan pacientes con seguro Divina Pastora y Santalucía.",
    "agendamientoMismoDia": "SI"
  },
  "estudio32": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "09:30h - 13:30h / 15:00h - 16:30h",
          "martes": "09:30h - 13:30h / 15:00h - 17:30h",
          "miercoles": "09:30h - 13:30h / 15:00h - 17:30h",
          "jueves": "09:30h - 13:30h / 15:00h - 17:30h",
          "viernes": "09:30h - 13:00h"
        },
        "duracionCita": "30 Min"
      }
    },
    "ayudas": "Podemos agendar ayudas por encima de 800€.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Estudio32\"",
    "seguros": "solo seguro Santa Lucia",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "usera": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00h - 13:30h / 16:00h -19:15h",
          "martes": "10:00h - 13:30h / 16:00h -19:15h",
          "miercoles": "10:00h - 13:30h / 16:00h -19:15h",
          "jueves": "10:00h - 13:30h / 16:00h -19:15h",
          "viernes": "10:00h - 13:30h / 16:00h -19:15h"
        },
        "duracionCita": "15 Min"
      }
    },
    "ayudas": "Podemos citar pacientes con ayuda",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "seguros": "aceptan seguros que no sean Sanitas, Asisa, Mapfre, Adesla",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "mostoles": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 - 13:30h / 16:00 - 19:30h",
          "jueves": "10:00 - 13:30h / 16:00 - 19:30h"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "SI",
        "valuePoints": "abierta desde 2001, cirujana con 15 años de experiencia y tecnología avanzada de escaneo para implantes"
      },
      "ortodoncia": {
        "horarios": {
          "lunes": "16:00 - 19:30h"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "SI",
        "valuePoints": ""
      }
    },
    "ayudas": "No reciben pacientes con ayuda.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI"
  },
  "dentalis": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00h - 13:30h / 16:00h - 19:30h",
          "martes": "10:00h - 13:30h / 16:00h - 19:30h",
          "jueves": "10:00h - 13:30h / 16:00h - 19:30h"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "NO"
      }
    },
    "ayudas": "No reciben pacientes con ayudas",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI"
  },
  "jerez": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00h - 12:30h / 17:00 a 18:00",
          "miercoles": "10:00h - 12:30h / 17:00 a 19:00",
          "jueves": "10:00h - 12:30h / 17:00 a 19:00"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "SI"
      },
      "ortodoncia": {
        "agendamientoLargoPlazo": "SI",
        "valuePoints": ""
      }
    },
    "ayudas": "Se puede citar Pensiones no contrinutivas (ayudas) de al menos 650euros",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Whatsapp\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "NO"
  },
  "oliver": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00h -13:00h / 16:00h - 18:00h",
          "martes": "10:00h -13:00h / 16:00h - 18:00h",
          "miercoles": "10:00h -13:00h / 16:00h - 19:00h",
          "jueves": "10:00h -13:00h / 16:00h - 19:00h",
          "viernes": "10:00h - 13:00"
        },
        "duracionCita": "60 Min",
        "agendamientoLargoPlazo": "NO"
      }
    },
    "ayudas": "Descartar pacientes con ayuda",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Oliver\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI"
  },
  "cespedes": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00h - 13:00h  / 16:00 - 18:00",
          "martes": "10:00h - 13:00h  / 16:00 - 18:00",
          "miercoles": "16:00 - 18:00",
          "jueves": "10:00h - 13:00h",
          "viernes": "10:00h - 13:00h"
        },
        "duracionCita": "60min",
        "agendamientoLargoPlazo": "NO"
      }
    },
    "ayudas": "Podemos agendar ayudas por encima de 1000€",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI"
  },
  "wright": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "09:00h - 13:20h / 16:00h - 19:20h",
          "martes": "09:00h - 13:20h / 15:30h - 19:20h",
          "miercoles": "10:00h - 13:20h / 16:00h - 19:20h",
          "jueves": "10:00h - 13:20h / 16:00h - 19:20h",
          "viernes": "10:00h - 13:20h"
        },
        "duracionCita": "40 Min",
        "agendamientoLargoPlazo": "SI"
      }
    },
    "ayudas": "Ayudas de al menos 700€ + DNI, el paciente puede financiar si posee tarjeta de crédito o débito.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "podemos citar pacientes, trabajan con la mayoria de seguros",
    "agendamientoMismoDia": "SI"
  },
  "dentalestetic": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "09:30 - 12:45/ 16:30 - 19:45",
          "martes": "09:30 - 12:45/ 16:30 - 19:45",
          "miercoles": "09:30 - 12:45/ 16:30 - 19:45",
          "jueves": "09:30 - 12:45/ 16:30 - 19:45",
          "viernes": "10:00 a 17:15"
        },
        "duracionCita": "30min",
        "agendamientoLargoPlazo": "SI"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI"
  },
  "rodriguezpons": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "9:30h - 19:00h",
          "martes": "9:30h - 19:00h",
          "miercoles": "9:30h - 19:00h",
          "jueves": "9:30h - 19:00h",
          "viernes": "9:30h - 19:00h"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "NO",
        "valuePoints": "cirujano maestro de doctores que forma especialistas en todo el mundo, cirugía para pacientes sin hueso y carga inmediata"
      },
      "ortodoncia": {
        "horarios": {
          "lunes": "9:30h - 19:00h",
          "martes": "9:30h - 19:00h",
          "miercoles": "9:30h - 19:00h",
          "jueves": "9:30h - 19:00h",
          "viernes": "9:30h - 19:00h"
        },
        "duracionCita": "30 Min",
        "valuePoints": "ortodoncia con las mejores marcas y algunos de los mejores precios de la isla"
      }
    },
    "ayudas": "Podemos agendar ayudas por encima de 1000€",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Rodriguez & Pons\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI"
  },
  "adeje": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "11:00h -18:00h",
          "miercoles": "11:00h -18:00h",
          "jueves": "11:00h -18:00h"
        },
        "duracionCita": "30 Min",
        "agendamientoLargoPlazo": "NO",
        "valuePoints": "profesionales con más de 30 años de experiencia, cirugía guiada, laboratorio propio, carga inmediata y TAC gratuito en la valoración"
      },
      "ortodoncia": {
        "horarios": {
          "lunes": "12:00 a 17:00",
          "miercoles": "12:00 a 17:00",
          "jueves": "12:00 a 17:00"
        },
        "duracionCita": "60min",
        "valuePoints": ""
      }
    },
    "ayudas": "Pueden recibir pacientes con ayuda por encima de 600€",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Adeje\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI"
  },
  "saludnavarra": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "08:00h - 19:00h",
          "martes": "08:00h - 19:00h",
          "miercoles": "08:00h - 19:00h",
          "jueves": "08:00h - 19:00h",
          "viernes": "08:00h - 16:00h"
        },
        "duracionCita": "15 Min",
        "agendamientoLargoPlazo": "SI"
      },
      "otros": {
        "sedes": [
          {
            "nombre": "Horario principal",
            "horarios": {
              "lunes": "09:00 a 12:30 / 16:00 a 17:30",
              "martes": "09:00 a 12:30 / 16:00 a 17:30",
              "miercoles": "09:00 a 15:30",
              "jueves": "09:00 a 12:30 / 16:00 a 17:30",
              "viernes": "08:00 a 14:30"
            },
            "duracionCita": "60 min"
          },
          {
            "nombre": "Prueba SIBO",
            "horarios": {
              "martes": "09:00 a 10:30",
              "miercoles": "09:00 a 10:30",
              "jueves": "09:00 a 10:30",
              "viernes": "08:00 a 09:30"
            },
            "duracionCita": "30 min"
          }
        ]
      }
    },
    "ayudas": "No podemos citar pacientes con ayuda",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "trabajan con seguros DKV, Santa Lucia, MGS, Mapfre, Asisa",
    "agendamientoMismoDia": "NO"
  },
  "zarate": {
    "byTreatment": {
      "implantes": {
        "sedes": [
          {
            "nombre": "Los Alisios",
            "horarios": {
              "lunes": "10:00h - 13:00h / 15:00h - 17:30h",
              "miercoles": "10:00h - 12:30h / 15:00h - 17:30h"
            },
            "duracionCita": "30Min"
          },
          {
            "nombre": "La Laguna",
            "horarios": {
              "martes": "10:00h - 12:30h / 15:00h - 17:30h",
              "jueves": "10:00h - 13:00h / 15:00h - 17:30h"
            },
            "duracionCita": "30Min"
          },
          {
            "nombre": "La Victoria de Acentejo",
            "horarios": {
              "martes": "10:00h - 13:00h / 15:00h - 17:30h",
              "miercoles": "09:00h- 12:00h",
              "jueves": "10:00h - 13:00h / 15:00h - 17:30h"
            },
            "duracionCita": "30Min"
          },
          {
            "nombre": "San Isidro",
            "horarios": {
              "martes": "09:00h -13:00h / 15:00h - 17:30h",
              "miercoles": "09:00h -13:00h / 15:00h - 17:30h",
              "viernes": "10:00h -12:30h"
            },
            "duracionCita": "40Min"
          },
          {
            "nombre": "Puerto Santiago",
            "horarios": {
              "martes": "10:00h -13:00h / 15:00h - 17:30h",
              "jueves": "10:00h - 12:30h / 15:00h - 17:30h"
            },
            "duracionCita": "30 Min"
          },
          {
            "nombre": "Santa Cruz",
            "horarios": {
              "lunes": "10:00h - 12:30h / 15:00h - 17:30h",
              "miercoles": "10:00h - 12:30h / 15:00h - 17:30h"
            },
            "duracionCita": "30 Min"
          },
          {
            "nombre": "Los Realejos (El toscal)",
            "horarios": {
              "lunes": "10:00h - 13:00h / 15:00h - 17:30h",
              "martes": "10:00h - 13:00h / 15:00h - 17:30h",
              "jueves": "15:00h - 17:30h",
              "viernes": "09:00h - 12:30h"
            },
            "duracionCita": "30 Min"
          },
          {
            "nombre": "Buzanada",
            "horarios": {
              "lunes": "09:00h - 13:30h / 15:00h - 17:30h",
              "miercoles": "09:00h - 13:30h / 15:00h - 17:30h",
              "jueves": "09:00h - 13:30h / 15:00h - 17:30h"
            },
            "duracionCita": "30 Min"
          },
          {
            "nombre": "Tegueste",
            "horarios": {
              "martes": "10:00 - 12:30 / 15:00 - 17:30",
              "jueves": "10:00 - 12:30 / 15:00 - 17:30"
            },
            "duracionCita": "30 Min"
          },
          {
            "nombre": "Las Palmas",
            "horarios": {
              "miercoles": "10:00h -13:00h / 15:00h - 17:30h"
            },
            "duracionCita": "30 Min"
          },
          {
            "nombre": "Adeje",
            "horarios": {
              "lunes": "10:00h - 12:30h / 15:00h - 17:30h",
              "jueves": "10:00h - 12:30h / 15:00h - 17:30h"
            },
            "duracionCita": "30 Min"
          }
        ],
        "agendamientoLargoPlazo": "SI"
      }
    },
    "ayudas": "Podemos citar pacientes con ayudas.",
    "recordatorio": "SI. Revisar plataforma antes",
    "whatsapp": "Subcuenta Zarate",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI"
  },
  "massana": {
    "byTreatment": {
      "implantes": {
        "sedes": [
          {
            "nombre": "Valladolid",
            "horarios": {
              "jueves": "10:00 a 13:30 / 16:00 a 19:00",
              "otros": "2026-05-25: 16:00 a 17:30"
            },
            "duracionCita": "30min"
          },
          {
            "nombre": "León",
            "horarios": {
              "lunes": "09:30 a 18:45",
              "martes": "09:30 a 18:45",
              "jueves": "09:30 a 18:45",
              "viernes": "09:30 a 18:45"
            },
            "duracionCita": "45min"
          }
        ],
        "valuePoints": "implantólogo con más de 15 años de experiencia, acompañamiento completo, carga inmediata, sedación consciente, radiografía dental 3D sin coste y escáner intraoral"
      },
      "carillas": {
        "sedes": [
          {
            "nombre": "Valladolid",
            "horarios": {
              "jueves": "10:00 a 13:30 / 16:00 a 19:00",
              "otros": "2026-05-25: 16:00 a 17:30"
            },
            "duracionCita": "30min"
          },
          {
            "nombre": "León",
            "horarios": {
              "lunes": "09:30 a 18:45",
              "martes": "09:30 a 18:45",
              "jueves": "09:30 a 18:45",
              "viernes": "09:30 a 18:45"
            },
            "duracionCita": "45min"
          }
        ],
        "valuePoints": ""
      },
      "ortodoncia": {
        "sedes": [
          {
            "nombre": "Valladolid",
            "horarios": {
              "miercoles": "10:00 a 13:30 y 16:00 a 19:00",
              "otros": "2026-05-14: 10:00 a 11:30"
            },
            "duracionCita": "30min"
          },
          {
            "nombre": "León",
            "horarios": {
              "lunes": "09:30 a 18:45",
              "martes": "09:30 a 18:45",
              "miercoles": "09:30 a 18:45",
              "viernes": "09:30 a 18:45"
            },
            "duracionCita": "30 min"
          }
        ],
        "valuePoints": ""
      }
    },
    "ayudas": "Valladolid: No podemos citar pacientes con ayuda",
    "recordatorio": "Valladolid: SI",
    "whatsapp": "Valladolid: Subcuenta \"WhatsApp\"",
    "seguros": "Valladolid: no aceptan seguros / Valladolid: podemos citar pacientes",
    "agendamientoMismoDia": "Valladolid: NO",
    "agendamientoLargoPlazo": "Valladolid: SI"
  },
  "vistalegre": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "martes": "16:00h - 19:30h",
          "miercoles": "10:00h - 13:30h / 16:00h - 19:30h",
          "viernes": "10:00h - 13:30h"
        },
        "duracionCita": "30 Min"
      }
    },
    "ayudas": "No podemos citar pacientes con ayuda",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Vistalegre\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "ivoria": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:30h a 18:45h.",
          "miercoles": "10:30h a 18:45h.",
          "jueves": "Según disponibilidad en plataforma (última hora de cita 19:15h)",
          "viernes": "Según disponibilidad en plataforma (última hora de cita 19:15h)"
        },
        "duracionCita": "15min"
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "podemos citar pacientes con seguros",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "belestar": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "09:30h a 13:30 / 16:00h a 18:30h",
          "miercoles": "09:30h a 13:00 / 16:00h a 18:30h",
          "jueves": "09:30h a 13:00 / 16:00h a 18:30h",
          "viernes": "09:30h a 13:00 / 16:00h a 17:30h"
        },
        "duracionCita": "30 min"
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "NO",
    "whatsapp": "WhatsApp2 (para wp1) . Ellos envian confirmación de citas",
    "seguros": "aceptan solamente Servial",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "excelentia": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 13:30",
          "martes": "10:00 a 13:30 / 16:00 a 19:30",
          "jueves": "10:00 a 13:30 / 16:00 a 19:30"
        },
        "duracionCita": "30 min"
      }
    },
    "ayudas": "Podemos citar pacientes con ayuda",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Excelentia\"",
    "seguros": "podemos citar paciente que no tengan seguros ASISA, ADESLA, SANITAS, MAPFRE",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "firstdental": {
    "byTreatment": {
      "implantes": {
        "sedes": [
          {
            "nombre": "Majadahonda",
            "horarios": {
              "lunes": "16:30 hasta las 19:30",
              "martes": "10:00 hasta la 13:00",
              "miercoles": "10:00 hasta la 13:00",
              "jueves": "16:30 hasta las 19:30"
            },
            "duracionCita": "60 min"
          },
          {
            "nombre": "El Escorial",
            "horarios": {
              "lunes": "10:00 hasta la 13:00",
              "martes": "16:30 hasta las 19:30",
              "miercoles": "16:30 hasta las 19:30",
              "jueves": "10:00 hasta la 13:00"
            },
            "duracionCita": "60 min"
          }
        ]
      }
    },
    "ayudas": "Podemos citar pacientes con ayudas.",
    "recordatorio": "NO",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "barrientos": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:15 a 13:15 / 16:15 a 19:15",
          "martes": "10:15 a 13:15 / 16:15 a 19:15",
          "miercoles": "10:15 a 13:15 / 16:15 a 19:15",
          "jueves": "10:15 a 13:15 / 16:15 a 19:15",
          "viernes": "10:15 a 13:15 / 16:15 a 19:15"
        },
        "duracionCita": "30 min",
        "valuePoints": "instalaciones modernas, implantología con carga inmediata y 4,9 estrellas en más de 50 reseñas"
      },
      "ortodoncia": {
        "horarios": {
          "lunes": "10:15 a 13:15 / 16:15 a 19:15",
          "martes": "10:15 a 13:15 / 16:15 a 19:15",
          "miercoles": "10:15 a 13:15 / 16:15 a 19:15",
          "jueves": "10:15 a 13:15 / 16:15 a 19:15",
          "viernes": "10:15 a 13:15 / 16:15 a 19:15"
        },
        "duracionCita": "30 min",
        "valuePoints": "instalaciones modernas, ortodoncia invisible y 4,9 estrellas en más de 50 reseñas"
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "chroma": {
    "byTreatment": {
      "implantes": {
        "sedes": [
          {
            "nombre": "Pacientes con DNI",
            "horarios": {
              "lunes": "09:30 a 12:30",
              "martes": "09:30 a 12:30 / 16:30 a 19:30",
              "miercoles": "09:30 a 12:30 / 16:30 a 19:30",
              "jueves": "09:30 a 12:30 / 16:30 a 19:30",
              "viernes": "09:30 a 12:30"
            },
            "duracionCita": "30min"
          },
          {
            "nombre": "Pacientes portugueses",
            "horarios": {
              "lunes": "09:30 a 12:30",
              "jueves": "16:30 a 19:30",
              "viernes": "09:30 a 12:30"
            },
            "duracionCita": "30min"
          }
        ]
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "NO",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "flordent": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "09:30h - 13:00h / 15:30h - 18:30h",
          "martes": "09:30h - 12:30h / 15:30h - 18:30h",
          "miercoles": "09:30h - 13:00h / 15:30h - 18:30h",
          "jueves": "09:30h - 12:30h / 15:30h - 18:30h"
        },
        "duracionCita": "30min | 60 min",
        "agendamientoLargoPlazo": "SI"
      },
      "estetica": {
        "horarios": {
          "lunes": "09:30 a 12:00",
          "jueves": "15:30 a 19:00"
        },
        "duracionCita": "30min"
      },
      "estetica_fhos": {
        "agendamientoLargoPlazo": "SI"
      }
    },
    "ayudas": "Aceptan pacientes con ayuda por encima de 1000€.",
    "recordatorio": "NO",
    "seguros": "Trabaja con seguros DKV",
    "agendamientoMismoDia": "SI"
  },
  "santrafael": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "09:00 a 18:30",
          "martes": "09:00 a 18:30",
          "miercoles": "09:00 a 18:30",
          "jueves": "09:00 a 18:30"
        },
        "duracionCita": "30min",
        "valuePoints": "38 años abierta, una de las clínicas más prestigiosas de Sabadell, 99% de valoraciones de cinco estrellas, carga inmediata y escáner"
      },
      "ortodoncia": {
        "horarios": {
          "lunes": "09:00 a 18:30",
          "martes": "09:00 a 18:30",
          "miercoles": "09:00 a 18:30",
          "jueves": "09:00 a 18:30"
        },
        "duracionCita": "30min",
        "valuePoints": "38 años abierta, una de las clínicas más prestigiosas de Sabadell y 99% de valoraciones de cinco estrellas"
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "smiling": {
    "byTreatment": {
      "carillas": {
        "horarios": {
          "lunes": "10:00 a  13:00 / 15:00 a 18:00",
          "martes": "10:00 a  13:00 / 15:00 a 18:00",
          "miercoles": "10:00 a  13:00 / 15:00 a 18:00",
          "jueves": "10:00 a  13:00 / 15:00 a 18:00"
        },
        "duracionCita": "60min",
        "promo": "Descuento: 30%"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subuenta Smiling",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "caobadent": {
    "byTreatment": {
      "ortodoncia": {
        "horarios": {
          "lunes": "10:00 a 13:15 / 16:00 a 19:15",
          "martes": "10:00 a 13:15 / 16:00 a 19:15",
          "miercoles": "10:00 a 13:15 / 16:00 a 19:15",
          "jueves": "10:00 a 13:15 / 16:00 a 19:15",
          "viernes": "10:00 a 13:15 / 15:00 a 18:30"
        },
        "duracionCita": "45min",
        "valuePoints": "doctores con más de 20 años de experiencia, formación continua, muy buenas reseñas, escáner y TAC para diagnóstico preciso"
      },
      "carillas": {
        "horarios": {
          "lunes": "10:00 a 13:15 / 16:00 a 19:15",
          "martes": "10:00 a 13:15 / 16:00 a 19:15",
          "miercoles": "10:00 a 13:15 / 16:00 a 19:15",
          "jueves": "10:00 a 13:15 / 16:00 a 19:15",
          "viernes": "10:00 a 13:15 / 15:00 a 18:30"
        },
        "duracionCita": "45min",
        "valuePoints": "doctores con más de 20 años de experiencia, formación continua, muy buenas reseñas, escáner y TAC para diagnóstico preciso"
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "seguros": "no aceptan seguros",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "colvi": {
    "byTreatment": {
      "estetica_fhos": {
        "horarios": {
          "lunes": "09:30 a 13:00 / 16:00 a 19:30",
          "martes": "09:30 a 13:00 / 16:00 a 19:30",
          "jueves": "09:30 a 13:00 / 16:00 a 19:30",
          "viernes": "09:30 a 13:00"
        },
        "duracionCita": "30 min",
        "valuePoints": "única clínica en el Campo de Gibraltar con certificación FHOS Bioluminiscente y muy buenas reseñas en Google"
      },
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 13:00 / 16:00 a 18:30",
          "martes": "10:00 a 13:00 / 16:00 a 18:30",
          "miercoles": "10:00 a 13:00",
          "jueves": "10:00 a 13:00 / 16:00 a 18:30"
        },
        "duracionCita": "30min",
        "valuePoints": "implantólogo con más de 15 años de experiencia, especialista en implantología y cirugía oral, clínica especializada, laboratorio local y muy buenas reseñas en Google"
      }
    },
    "recordatorio": "SI / NO",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO / SI",
    "ayudas": "No podemos citar pacientes con ayudas.",
    "seguros": "solo pacientes con seguros Dkv y Meridiano"
  },
  "smiledent-leon": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "16:00 a 19:00",
          "martes": "10:00 a 13:00",
          "miercoles": "16:00 a 19:00",
          "jueves": "10:00 a 13:30 / 16:00 a 19:00"
        },
        "duracionCita": "30min"
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "smiledent-gijon": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 13:00 / 16:00 a 19:00",
          "martes": "10:00 a 13:00 / 16:00 a 19:00",
          "miercoles": "10:00 a 13:00 / 16:00 a 19:00",
          "jueves": "10:00 a 13:00 / 16:00 a 19:00",
          "viernes": "09:00 a 14:00"
        },
        "duracionCita": "60min"
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "seguros": "no aceptan seguros",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Smiledent Gijón\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "nunez": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 19:00",
          "miercoles": "10:00 a 19:00",
          "viernes": "10:00 a 19:00"
        },
        "valuePoints": "5 años abierta, cirujana con más de 12 años de experiencia en implantes, reconocimientos de excelencia profesional y TAC incluido si la valoración lo requiere"
      },
      "blanqueamiento": {
        "horarios": {
          "miercoles": "10:00 a 19:00",
          "jueves": "10:00 a 19:00",
          "viernes": "10:00 a 19:00"
        },
        "duracionCita": "30min",
        "valuePoints": ""
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "soler": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 13:00 / 15:00 a 19:00",
          "miercoles": "10:00 a 13:00 / 15:00 a 19:00",
          "jueves": "10:00 a 13:00 / 15:00 a 19:00",
          "viernes": "10:00 a 13:00"
        },
        "duracionCita": "60min",
        "valuePoints": "10 años abierta, implantólogo con más de 8 años de experiencia, especialista en prótesis con más de 15 años, clínica familiar y cercana"
      },
      "ortodoncia": {
        "horarios": {
          "lunes": "10:00 a 13:00 / 15:00 a 19:00",
          "miercoles": "10:00 a 13:00 / 15:00 a 19:00",
          "jueves": "10:00 a 13:00 / 15:00 a 19:00",
          "viernes": "10:00 a 13:00"
        },
        "duracionCita": "60min",
        "agendamientoLargoPlazo": "SI",
        "valuePoints": ""
      },
      "estetica": {
        "horarios": {
          "lunes": "16:00 a 19:30",
          "martes": "16:00 a 19:30",
          "miercoles": "16:00 a 19:30",
          "jueves": "16:00 a 19:30"
        },
        "duracionCita": "30min"
      },
      "estetica_fhos": {
        "agendamientoLargoPlazo": "SI"
      },
      "estetica_soler": {
        "valuePoints": ""
      }
    },
    "ayudas": "Podemos citar pacientes con ayuda.",
    "seguros": "no aceptan seguros",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI"
  },
  "paretsdent": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 12:30 / 15:30 a 19:30",
          "martes": "10:00 a 12:30 / 15:30 a 19:30",
          "miercoles": "10:00 a 12:30 / 15:30 a 19:30",
          "jueves": "10:00 a 12:30 / 15:30 a 19:30",
          "viernes": "10:00 a 12:30"
        },
        "duracionCita": "30 min",
        "valuePoints": "más de 10 años abierta, muy buenas reseñas en Google e implantóloga con más de 15 años de experiencia colocando implantes"
      },
      "ortodoncia": {
        "horarios": {
          "otros": "2026-06-02: 10:00 a 12:30 / 15:30 a 19:30 (30 min) | 2026-06-16: 10:00 a 12:30 / 15:30 a 19:30"
        },
        "duracionCita": "30 min",
        "valuePoints": ""
      }
    },
    "ayudas": "No podemos citar pacientes con ayudas.",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "espai": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 13:00 / 15:00 a 18:30",
          "martes": "12:00 a 13:30 / 15:50 a 18:30",
          "miercoles": "10:00 a 13:00 / 15:00 a 18:30"
        },
        "duracionCita": "30min"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Espai Zen\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "fonseca": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 13:00 / 16:00 a 19:00",
          "martes": "10:00 a 13:00 / 16:00 a 19:00",
          "miercoles": "11:00 a 13:00",
          "jueves": "10:00 a 13:00 / 16:00 a 19:00",
          "viernes": "10:00 a 13:00 / 16:00 a 19:00"
        },
        "duracionCita": "60min",
        "agendamientoLargoPlazo": "NO"
      },
      "ortodoncia": {
        "horarios": {
          "otros": "2026-05-21: 10:00 a 13:00"
        },
        "duracionCita": "60min",
        "agendamientoLargoPlazo": "SI"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "agendamientoMismoDia": "SI",
    "ayudas": "no podemos citar pacientes con ayudas",
    "seguros": "no citar pacientes con seguros"
  },
  "marinabaixa": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "martes": "10:00 a 18:00",
          "miercoles": "10:00 a 18:00",
          "jueves": "10:00 a 18:00"
        },
        "duracionCita": "40min"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI",
    "ayudas": "podemos citar pacientes con ayudas apartir de 1000€",
    "seguros": "no trabajan con seguros"
  },
  "stardental": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "11:00 a 13:30 / 16:00 a 19:30",
          "martes": "11:30 a 13:30 / 16:00 a 19:30",
          "miercoles": "11:30 a 13:30 / 16:00 y 16:30 / 19:00 y 19:30",
          "jueves": "11:30 a 13:30",
          "viernes": "11:30 a 13:30 / 16:00 y 16:30"
        },
        "duracionCita": "30min",
        "promo": "Prótesis sobre implantes: desde 5,4€ al día. Implante Unitario + corona: desde 29€ al mes"
      },
      "blanqueamiento": {
        "horarios": {
          "lunes": "11:00 a 13:30 / 16:00 a 19:30",
          "martes": "11:00 a 13:30 / 16:00 a 19:30",
          "miercoles": "11:00 a 13:30 / 16:00 a 19:30",
          "jueves": "11:00 a 13:30",
          "viernes": "11:00 a 13:30"
        },
        "duracionCita": "30min"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "mpelite": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "15:00 a 18:00",
          "martes": "10:00 a 13:00 / 15:00 a 18:00",
          "miercoles": "15:00 a 19:00",
          "jueves": "12:00 a 13:00 / 15:00 a 18:00",
          "viernes": "10:00 a 13:00"
        },
        "duracionCita": "60min"
      }
    },
    "seguros": "aceptan seguros",
    "ayudas": "Podemos agendar ayudas",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "smailo": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 13:00 / 16:00 a 19:00",
          "martes": "10:00 a 13:00 / 16:00 a 19:00",
          "miercoles": "10:00 a 13:00 / 16:00 a 19:00",
          "jueves": "10:00 a 13:00 / 16:00 a 19:00",
          "viernes": "10:00 a 13:00"
        },
        "duracionCita": "60min"
      }
    },
    "ayudas": "No podemos agendar ayudas",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "SI"
  },
  "carey": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00 a 13:00 / 16:00 a 19:30",
          "martes": "10:00 a 13:00 / 16:00 a 19:30",
          "miercoles": "10:00 a 13:00 / 16:00 a 19:30",
          "jueves": "10:00 a 13:00 / 16:00 a 19:30",
          "viernes": "10:00 a 13:00"
        },
        "duracionCita": "15min"
      }
    },
    "ayudas": "podemos citar pacientes con ayudas apartir de 1000€ (a excepción de pacientes que necesiten boca completa o media arcada)",
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "identalitas": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "16:00 a 19:00",
          "martes": "16:00 a 19:00",
          "jueves": "12:00 a 14:00 / 16:00 a 19:00",
          "viernes": "10:00 a 13:00 / 16:00 a 19:00"
        },
        "duracionCita": "30min"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "rcclinica": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "09:30 a 12:30 / 16:30 a 19:30",
          "martes": "09:30 a 12:30 / 16:30 a 19:30",
          "miercoles": "09:30 a 12:30 / 16:30 a 19:30",
          "jueves": "09:30 a 12:30 / 16:30 a 19:30",
          "viernes": "09:30 a 12:30 / 16:30 a 19:30"
        },
        "duracionCita": "60min"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  }
,
  "nuno_perez": {
    "byTreatment": {
      "implantes": {
        "horarios": {
          "lunes": "10:00h - 13:00h / 15:30h - 19:30h",
          "martes": "10:00h - 13:00h / 15:30h - 19:30h",
          "miercoles": "10:00h - 13:00h / 15:30h - 19:30h",
          "jueves": "10:00h - 13:00h / 15:30h - 19:30h",
          "viernes": "10:00h - 13:00h"
        },
        "duracionCita": "60 min"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"Nuño + Pérez Odontólogos\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  },
  "ardenne": {
    "byTreatment": {
      "implantes": {
        "duracionCita": "Recepción confirma fecha y hora"
      }
    },
    "recordatorio": "SI",
    "whatsapp": "Subcuenta \"WhatsApp 2\"",
    "agendamientoMismoDia": "SI",
    "agendamientoLargoPlazo": "NO"
  }

};
