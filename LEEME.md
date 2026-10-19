# Omni Dental Scripts — citas y notas

Copia de trabajo actualizada el 19 de octubre de 2026. Versión con respuestas integradas en el guion, selectores rápidos de cita y distribución para pantalla dividida. La carpeta original de Downloads permanece intacta.

Consulta [la revisión por clínica del 17/10/2026](REVISION_17_OCTUBRE.md) para los cambios de guiones, horarios y excepciones. El informe ACTUALIZACION_CLINICAS.md conserva el historial anterior.

## Abrir la aplicación

1. Si recibiste el ZIP, extrae la carpeta completa en una carpeta nueva para evitar mezclar versiones. No abras el HTML dentro del ZIP.
2. Abre `index.html` desde la carpeta extraída en Chrome o Edge.
3. Utiliza la misma clave de acceso de la aplicación original.

Mantén juntos todos los archivos de la carpeta. No necesitas instalar dependencias para utilizar la web estática.

## Preparar una nota

Selecciona clínica y tratamiento. Registra las respuestas directamente dentro del guion: necesidad en el motivo de la visita, documentación junto a su pregunta y situación económica junto a la cualificación económica. La documentación se elige con un clic y admite una sola respuesta.

La **necesidad del paciente es obligatoria en los guiones con cualificación documental o económica**. La nota no se puede copiar hasta escribirla. En reprogramación no se solicita; en Meta y guiones sin cualificación sigue siendo opcional, excepto ParaTi, donde se registra el tratamiento y la necesidad.

En **Agendamiento**, elige el día y mes de la cita y su hora. El panel lateral muestra el resumen que se va formando; al terminar pulsa **Copiar nota** para pegarlo en HighLevel.

Se retiró **Copiar guion** para centrar la interfaz en **Copiar nota**, que prepara el registro para HighLevel. La nota no añade estados, tipo de gestión ni próximas acciones.

## Trabajo en pantalla dividida

En ventanas de hasta 1.100 píxeles de ancho, el guion ocupa una sola columna y la información de la clínica comienza plegada. Pulsa **Información y horarios de la clínica** para consultar la ficha sin perder las respuestas. Los horarios reales siguen en esa ficha; el rango del selector de hora no se presenta como disponibilidad de la clínica.

El botón **Ver nota** permanece accesible en la esquina inferior y lleva a la vista previa. **Volver al guion** recupera la posición de lectura. En pantallas amplias se mantienen las columnas con la nota lateral. En ventanas muy estrechas los selectores de clínica y tratamiento se apilan.

## Fecha y hora rápidas

- Día y mes, sin año visible ni año en la nota. El mes comienza en el mes actual.
- Accesos **Hoy** y **Mañana** para rellenar la fecha con un clic.
- Hora entre **08:00 y 20:00**, en formato 24 horas, sin AM/PM. Minutos en intervalos de cinco: 00, 05, 10… 55. Excepción confirmada: Caredent Jerez los martes admite hasta 20:30. En los demás casos, al elegir las 20 solo se permite 20:00; los demás minutos se desactivan. Este rango limita el selector, no define los horarios de cada clínica, y no se muestra como encabezado ni aviso de disponibilidad.
- Los minutos comienzan en 00 para agilizar las citas a la hora en punto. La hora permanece vacía hasta que el operador la seleccione.
- Se comprueba que el día exista en el mes seleccionado; las horas que no sean múltiplos de cinco no se aceptan.

Ejemplo:

```text
Cita 15/10 11:00
Implantes dentales, rehabilitación completa
DNI
Jubilación
```

Los ingresos del paciente y del tercero se registran por separado. Los importes y detalles son opcionales, salvo en Flordent estética: allí se exige registrar el ingreso mensual del paciente y el mínimo obligatorio es 1.200 €. No se aplica ese mínimo a otras clínicas. No se generan conclusiones de financiación aprobada.

## Respuestas no permitidas y pendientes

Las opciones que contradicen criterios explícitos de la ficha aparecen **en rojo y con «No permitido»**. Al seleccionarlas, se muestra una explicación. Se mantienen seleccionables para registrar la respuesta real del paciente; el aviso no autoriza a agendar ni aprueba financiación.

**«Revisar», en ámbar**, indica información no especificada, criterios incompletos o una excepción que debe comprobarse. Una opción sin aviso no confirma que el paciente cumpla todos los requisitos: importes, antigüedad y otras condiciones siguen visibles en el guion y en la ficha. Las reglas económicas complejas sin configuración cerrada se remiten a revisión, sin inventar límites ni decisiones.

Los avisos utilizan los criterios del tratamiento seleccionado. DNI/NIE excluye pasaporte si la lista es cerrada; NIE comunitario y la excepción portuguesa de Chroma requieren revisión. En Martínez Silva se distinguen la solvencia propia y la del tercero; en Carranza implantes los datos ya disponibles de Meta respetan la ruta del documento. Cirium sigue sin filtros.

La nota copia la respuesta, sin añadir etiquetas «No permitido» o «Revisar». Cambiar de clínica, documento o tratamiento actualiza los avisos y evita arrastrar restricciones anteriores.

## Reprogramar

Pulsa **Reprogramar** o selecciona el guion de reprogramación. Introduce la nueva fecha y hora y el número de esta cita consultando el historial de HighLevel. No se vuelve a cualificar.

La nota copiada contiene únicamente:

```text
Reprograma 18/10 16:30
```

El contador queda visible en la app y no se añade a la nota. Primera cita = cero reprogramaciones; segunda = una; tercera = dos.

Carranza, Cirium y Martínez Silva tienen un máximo confirmado de **dos reprogramaciones**. La cuarta cita muestra un aviso para consultar con el manager. Palomero, Ivoria, Barrientos, Smiledent Gijón, Smailo Alcalá, Smailo Coslada y Dental Star As Cancelas tienen **una reprogramación** según notas explícitas de la Master; en Palomero se indica la condición relativa al historial del último año. Las restantes tienen dos reprogramaciones, confirmadas por el manager. Copiar no aumenta el contador ni registra una cita.

Ardenne es una excepción: tanto la disponibilidad inicial como una solicitud de reprogramación quedan pendientes de confirmación por la clínica. Se registra disponibilidad libre (por ejemplo, martes por la tarde), sin exigir fecha ni hora exactas. También se registran inversión, forma de pago prevista y valoración/presupuesto previo en la solicitud nueva. Flordent estética genera una cita confirmada por el operador; las demás rutas conservan la preagenda provisional indicada en la Master.

## Nuevo paciente y limpieza de datos

**Nuevo paciente** vacía las respuestas, conserva la clínica y el tratamiento seleccionado y vuelve al inicio del guion. Cambiar de clínica, tratamiento o entre cita nueva y reprogramación también limpia el borrador. Desmarcar datos de Meta o tercero elimina las respuestas de esa sección.

Las notas no se guardan en el navegador ni se envían a ningún servicio. La app prepara texto para copiar; las citas se gestionan en HighLevel.

## Clínicas piloto

- **Clínica Dental Carranza:** implantes cualificados en Meta; el operador puede incorporar los datos disponibles, sin repetir el cuestionario. Las rutas que usan el guion simplificado también se cualifican en Meta; las demás conservan su regla específica. Se actualizó el blanqueamiento a 99 €, las promociones y condiciones publicadas en la Master, y la entrada del martes a las 10:30 para implantes y blanqueamiento.
- **Cirium Clínica Dental:** añadida con guion simplificado, sin filtros documentales ni económicos, y con sus horarios de la Master.
- **Clínica Dental Martínez Silva:** añadida con guion selectivo de implantes, respuestas documentales y económicas y sus horarios de la Master. No se aplica un umbral de ingresos inventado.

El guion simplificado conserva la excepción aprobada de no comunicar la oferta. ASNEF se registra solamente en las rutas que tienen asignación explícita en la configuración.

Fuentes: [Master, pestaña Horarios](https://docs.google.com/spreadsheets/d/1kw7L_l3qOVfEhvO456ECnpupnC3CY8eq9RD1ZI0C2o0/edit?gid=157592735#gid=157592735), leída el 12/10/2026, y decisiones del manager en esta conversación. Esta entrega incorpora **las 54 fichas dentales**: 38 ya presentes y 16 nuevas. Colvi e Implant Clinic están inactivas por confirmación del manager y se conservan sus datos. Los Molinos queda sin cualificación por decisión del manager.

Consulta **ACTUALIZACION_CLINICAS.md** para los rangos de origen por clínica, cambios, excepciones y pendientes. Algunas fichas carecen de horarios y ciertos guiones especiales siguen pendientes de integración o comparación; la app muestra avisos. La estética médica de Flordent tiene ficha propia y no se sustituye por FHOS.

## Conservación y comprobaciones

Se conservaron los 38 nombres e identificadores originales, todos los guiones y los archivos auxiliares. La app conserva 56 registros y ofrece 52 clínicas activas. Los archivos originales de guiones, clínicas y horarios permanecen sin cambios; las actualizaciones se aplican por capas desde `clinic-updates.js` y `master-updates.js`.

También se corrigieron la búsqueda que podía desajustar la clínica activa, las objeciones que permanecían visibles en pantallas pequeñas y la herencia de horarios de otro tratamiento. Si falta un horario, la app pide consultar la Master.

Han pasado 90 pruebas automáticas de notas, reglas, copiado, eventos y migración de la Master. Se verifican todas las combinaciones activas de clínica y guion, más los registros inactivos conservados. Se comprueban también rangos por tratamiento, fechas excepcionales, sedes, criterios documentales, ausencia de credenciales y las nuevas excepciones aprobadas. Los eventos se comprobaron en un entorno simulado. La revisión visual de esta nueva versión en un navegador real sigue pendiente.

Para mantenimiento, con Node instalado:

```text
node --test tests/*.cjs
```

Esta copia no se ha publicado en Vercel ni se ha subido a GitHub.

Actualización de presentación: referencias de Madrid en el selector y nombre Nuño y Pérez Odontólogos confirmados por el manager. Ofertas en bloques verticales por tratamiento, con precios y condiciones conservados. Las referencias de zona no implican una estación o número de línea de metro verificados.


## Últimas confirmaciones operativas

Dental Star no cualifica: citas de 30 minutos según disponibilidad de odontólogos generales ger/gnral en Klinikare; financiación explicada en clínica. Adeje usa su guion especial sin cualificación, con oferta y compromiso de asistencia. Caredent ya no ofrece ortodoncia en el selector. Las fechas especiales pasadas se ocultan al cargar; las futuras llevan fecha explícita y los horarios semanales se conservan. Consulta ACTUALIZACION_CLINICAS.md para el estado y los pendientes reales.


## Actualización del 17/10/2026

En Zen selecciona el número aproximado de piezas y la documentación para mostrar las respuestas de su ruta. En Nuño y Pérez y Salud Navarra registra los ingresos mensuales y comprueba el mínimo de 1.221 € y las condiciones documentales del guion. La nota registra lo declarado: no concede financiación.

Esta versión incluye 53 clínicas activas y 99 pruebas automáticas superadas. La comprobación visual en navegador real sigue pendiente.


## Pantalla inicial y referencias · 19/10/2026

La pantalla inicial permite desplegar 18 plantillas de consulta. Para gestionar la llamada y preparar una nota, selecciona la clínica y el tratamiento; se aplican sus datos y excepciones. Las plantillas no incorporan respuestas de pacientes.

El texto entre paréntesis de las direcciones aparece en Referencia. Se conserva la dirección original como respaldo. También se separan las referencias de las sedes.

101 pruebas automáticas superadas. La revisión visual en navegador real sigue pendiente.
