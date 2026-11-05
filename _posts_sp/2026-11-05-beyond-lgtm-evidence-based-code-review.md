---
title: 'Más allá del "LGTM": revisión de código basada en evidencia en la era de la IA'
date: 2026-11-05
slug: beyond-lgtm-evidence-based-code-review
topic: infosec
lang: es
description: "Una aprobación dice que alguien aceptó un cambio, no qué revisó. Cómo convertir la revisión de código en un paquete de evidencia que las pruebas realmente respalden, y quién debería aceptar el riesgo que queda."
translation: "/blog/2026/11/beyond-lgtm-evidence-based-code-review/"
image: /img/blog-hero/pixabay-1853330.jpg
---

## 1. La brecha entre aprobar y asegurar

Imagina un pull request grande para una automatización de gestión de accesos. Quien lo escribió es una persona respetada, la descripción es clara y la fecha de entrega se acerca. Alguien revisa la lógica central, lee algunos comentarios, ve la suite de pruebas en verde y aprueba: "LGTM". La revisión es sincera. También es más limitada de lo que la aprobación sugiere.

¿Qué nos dice realmente una aprobación sobre la seguridad de un cambio?

Nos dice que alguien aceptó el cambio bajo ciertas condiciones. Si esas condiciones no son visibles, no podemos saber qué requisitos examinó quien revisó, qué fallas consideró ni cuánta confianza merecen las pruebas. Una persona revisora competente y bien intencionada sigue limitada por la atención, la familiaridad y la presión de entrega. El respeto por un colega con experiencia puede influir en qué tanto cuestionamos un diseño. Un lanzamiento inminente puede influir en qué preguntas dejamos sin responder.

Estas debilidades pertenecen al proceso de revisión, no a la persona que escribió el código, sin importar su nivel de experiencia ni las herramientas que use. La revisión entre pares siempre ha funcionado con tiempo limitado y dentro de relaciones sociales. El desarrollo asistido por IA hace más difícil ignorar la debilidad de una aprobación sin evidencia: producir más código no aumenta nuestra capacidad de entender sus consecuencias.

La respuesta es darle a la revisión una base que otras personas puedan inspeccionar. Partiendo de las prácticas existentes de desarrollo seguro, podemos reunir evidencia reproducible, verificar si las pruebas representan condiciones reales de operación y hacer explícita la incertidumbre que queda para las personas autorizadas a decidir qué sigue.

## 2. Ya existe una base

El Secure Software Development Framework (SSDF) del NIST, SP 800-218, ofrece una base útil. En la versión 1.1 del SSDF, la práctica PW.7 cubre la revisión y el análisis del código legible por humanos para identificar vulnerabilidades y verificar el cumplimiento de los requisitos de seguridad. PW.8 cubre las pruebas del código ejecutable con los mismos fines. Ambas incluyen registrar y clasificar lo que se encuentra. Las dos prácticas se complementan: leer el código fuente puede revelar problemas que ninguna ejecución de pruebas provoca, y ejecutar el código puede mostrar comportamientos que la lectura pasa por alto.[^1]

Lo que falta es una manera de hacer esa recolección de evidencia sistemática e inspeccionable mientras el desarrollo se acelera. Para la automatización de gestión de accesos, eso significa reunir suficiente información para evaluar una afirmación concreta: ¿esta versión aplica las reglas de acceso acordadas en las condiciones en las que va a operar?

## 3. De una aprobación a un paquete de evidencia

La automatización de nuestro ejemplo recibe eventos del ciclo de vida de RR. HH. y actualiza los accesos de las cuentas de los empleados. Cuando una actualización laboral llega limpia y a tiempo, la automatización deja la cuenta en el estado esperado. El cambio parece sencillo hasta que examinamos el orden de los eventos, los reintentos y quién tiene autoridad para restaurar el acceso.

Un flujo de revisión podría asignar responsabilidades distintas a agentes de IA especializados:

- **Requisitos:** vincular cada comportamiento relevante con un requisito explícito e identificar las expectativas ambiguas o ausentes.
- **Autorización y uso indebido:** examinar quién puede enviar cambios del ciclo de vida, qué autoridad tiene la automatización y si entradas obsoletas, reenviadas o no autorizadas pueden restaurar el acceso.
- **Casos límite y recuperación:** probar eventos tardíos, duplicados, actualizaciones concurrentes, fallas de dependencias, ejecuciones parciales y reintentos.
- **Calidad del código y arquitectura:** inspeccionar el manejo de estado, la separación de responsabilidades y si se podrá razonar con seguridad sobre los cambios futuros.

Un orquestador reúne los hallazgos de los agentes junto con los resultados reales de ejecución. Una prueba propuesta no es una ejecución completada, y un relato que afirma éxito necesita un resultado que lo respalde. El orquestador también debe exponer las contradicciones, como una revisión de autorización que concluye que las actualizaciones obsoletas se rechazan mientras una traza de ejecución muestra una cuenta reactivada.

Cada hallazgo debe quedar vinculado a la versión exacta del código, la versión de las pruebas, los datos de entrada, la configuración y el entorno. Registrar las versiones del runtime y de las dependencias, el comportamiento simulado de los servicios, los comandos y los logs relevantes permite que otra persona reproduzca el resultado dentro de límites declarados. Si la versión candidata cambia, el paquete debe separar la evidencia que sigue vigente de la que necesita otra ejecución.

El entregable es un paquete de revisión que explica qué se verificó, qué pasó, qué falló y qué sigue sin saberse. Conecta cada afirmación con su evidencia y deja constancia de los desacuerdos sin resolver.

El NIST no prescribe este diseño multiagente. Es una forma de implementar las prácticas anteriores, y su valor tiene que demostrarse por la calidad de la evidencia que produce y de las decisiones que esa evidencia respalda.

Que los agentes coincidan no prueba que tengan razón. Varios agentes pueden compartir el mismo requisito equivocado o suponer el mismo comportamiento poco realista de un servicio, y darles descripciones de rol distintas no vuelve independientes sus juicios. El flujo se gana la confianza cuando sus afirmaciones pueden contrastarse con reglas explícitas y con resultados que cualquiera puede inspeccionar.

## 4. ¿Las pruebas justifican la conclusión?

La pregunta más importante de la revisión es si las pruebas justifican las conclusiones que se sacan de ellas. Para responderla, primero necesitamos una regla contra la cual probar.

Supongamos que la persona responsable de la política de este sistema, quien rinde cuentas por sus reglas de acceso, estableció la siguiente regla: una vez procesada una baja válida, la cuenta debe permanecer deshabilitada, y un evento de estado activo más antiguo no puede restaurar el acceso. La reactivación requiere una transición de recontratación autorizada por separado. La regla se definió de forma independiente de la implementación.

Con la regla definida, tres distinciones ayudan:

| Pregunta | Qué plantea | Aplicada al ejemplo |
| --- | --- | --- |
| Validez | ¿Estamos probando la propiedad deseada contra expectativas justificadas? | ¿La aserción demuestra que un evento de estado activo más antiguo no puede deshacer una baja ya procesada? |
| Fidelidad | ¿Las condiciones de prueba se parecen a la operación real? | ¿Pueden llegar eventos tarde, fuera de orden o más de una vez, y puede un reintento reanudarse después de que el estado cambió? |
| Cobertura | ¿Qué situaciones importantes quedan fuera de las pruebas? | ¿Examinamos actualizaciones simultáneas, fallas prolongadas y la recuperación después de una ejecución parcial? |

Las pruebas iniciales entregan una actualización de estado activo y luego una baja, en orden, con respuestas inmediatas del servicio de cuentas. La cuenta termina deshabilitada. Las pruebas pasan.

Ahora cambiemos el orden de entrega:

| Hora del evento | Hora de entrega | Evento de RR. HH. |
| --- | --- | --- |
| 08:58 | 09:04 | Versión 41: empleado activo |
| 09:00 | 09:01 | Versión 42: empleado dado de baja |

La automatización procesa la versión 42 y deshabilita la cuenta. Tres minutos después llega la versión 41. Una implementación que simplemente aplica el último estado recibido vuelve a habilitar la cuenta. Pasó las pruebas originales porque nunca cuestionaron su suposición de que el orden de llegada define el orden real de los eventos.

Una prueba que pasa puede ser evidencia débil de dos maneras. Puede afirmar la regla correcta en condiciones demasiado estrechas para respaldar lo que se dice del despliegue, y eso es un problema de fidelidad. O puede modelar con precisión la entrega retrasada pero esperar el resultado equivocado, por ejemplo al tratar "gana la última llegada" como correcto porque eso es lo que el código ya hace. Eso es un problema de validez, y hacer el entorno más realista no lo arregla.

Las aserciones también deben observar la propiedad que se afirma. Confirmar que el flujo devolvió éxito, o que envió una solicitud de deshabilitación, no demuestra que la cuenta siguiera deshabilitada después de que llegó el evento obsoleto. La prueba tiene que observar el estado de acceso resultante, incluido cualquier estado intermedio que importe. Una reactivación no autorizada, aunque sea temporal, sigue siendo una falla, incluso si una conciliación posterior vuelve a deshabilitar la cuenta.

Una prueba unitaria aislada sigue siendo valiosa para una afirmación acotada, como la forma en que se comparan dos versiones de un evento. Las afirmaciones más amplias necesitan evidencia que también cubra la persistencia, las respuestas de los servicios y la recuperación. Una prueba fiel no necesita recrear todo el entorno de producción, pero sus simplificaciones deben ser visibles.

## 5. El historial operativo se convierte en un activo de prueba

Conocer cómo funciona realmente el proceso actual mejora nuestra capacidad de verificar la automatización que lo reemplaza. En ese sentido, la observabilidad es un insumo de la verificación. Los tiempos de los eventos, las excepciones, las intervenciones manuales, los intentos fallidos, los incidentes y los resultados de recuperación pueden revelar condiciones que un documento de requisitos limpio deja implícitas.

Supongamos que los registros autorizados del proceso actual muestran que a veces llegan actualizaciones de estado activo después de las bajas. También muestran reintentos tras timeouts del servicio de cuentas, y ocasiones en que un operador corrigió una cuenta a mano. Estos registros nos dan razones para probar el orden de entrega, la ejecución duplicada y la interacción entre la automatización y la acción manual.

Lo que los registros no pueden hacer es decidir si algún estado de acceso resultante era aceptable. El historial muestra lo que pasó, no lo que debió pasar. Los patrones históricos deben dar forma a los escenarios, y las reglas de acceso definidas de forma independiente deben determinar los resultados esperados. Si el proceso anterior restauraba accesos incorrectamente de forma rutinaria, reproducir ese comportamiento preservaría un defecto. Si un operador hizo una excepción legítima, la prueba necesita las condiciones que la autorizaron, no la suposición de que toda intervención manual era válida.

Lo mismo aplica a los tiempos. Los registros pueden mostrar cuánto tardaban los eventos de baja en llegar al flujo, pero la demora aceptable tiene que venir de un requisito acordado. Una prueba también debe separar la latencia de entrega previa del tiempo de respuesta propio de la automatización una vez recibido el evento. De lo contrario, un handler rápido puede parecer que cumple un plazo de punta a punta que el proceso completo en realidad no cumple.

El historial también tiene sus límites. Los logs pueden omitir eventos perdidos, capturar solo operaciones exitosas o dejar fuera el trabajo hecho fuera del sistema. Un periodo tranquilo puede contener pocas excepciones significativas. Los cambios en integraciones o en la forma de operar pueden hacer que los patrones antiguos sean menos representativos. Y que no haya una falla registrada no significa que la falla sea improbable.

Para reducir el sobreajuste, mantén separados los registros que usas para construir escenarios de los casos de evaluación reservados. La separación tiene que tener en cuenta los eventos relacionados: poner copias del mismo incidente en ambos lados ofrece poco desafío independiente. Una vez que un caso de evaluación ha influido en el desarrollo, consérvalo como prueba de regresión y busca evidencia de evaluación nueva. Luego agrega escenarios adversariales que el historial nunca ha registrado, como un evento de ciclo de vida falsificado o una transición de recontratación enviada sin la autorización requerida.

Usa datos autorizados, minimizados, sanitizados o sintéticos. Para este ejemplo, identidades y secuencias de eventos sintéticas pueden preservar las relaciones de tiempo, orden y falla sin cargar datos reales de empleados. Documenta qué propiedades se preservaron o cambiaron en la transformación, porque la sanitización también puede eliminar las condiciones de las que depende una prueba. Los registros se vuelven activos de prueba útiles solo cuando su procedencia y sus límites siguen visibles.

## 6. La confianza debe describir la evidencia y sus límites

La confianza debe estar ligada a afirmaciones, versiones y condiciones específicas. Una evaluación útil para una versión candidata podría decir:

> Las transiciones normales están bien probadas. Los eventos retrasados tienen cobertura limitada. Las actualizaciones concurrentes siguen sin probarse.

Esa declaración es desigual a propósito. La evidencia puede respaldar con fuerza un comportamiento y dejar sin resolver otro que también importa. El paquete debe sustentar cada parte: qué transiciones normales se ejecutaron, qué patrones de retraso se probaron y por qué la concurrencia queda fuera de la evidencia disponible.

Un puntaje numérico podría resumir algún día partes de esta evaluación, pero su significado y su calibración deben ser explícitos. El porcentaje de escenarios cubiertos de una lista describe un conjunto elegido de escenarios. No es una probabilidad de que el sistema sea seguro. El conjunto puede omitir la falla más dañina, y sus casos pueden solaparse mucho.

Si un puntaje pretende predecir un resultado, hay que definir el resultado, la población de evaluación y el método de calibración. De lo contrario, un número de apariencia precisa esconde la incertidumbre. Un camino sin resolver que reactiva una cuenta dada de baja debe seguir visible aunque pasen cientos de pruebas menores.

La historia de la evidencia importa tanto como el último resumen. En nuestro ejemplo, la prueba de eventos fuera de orden expuso un defecto. Una corrección agrega verificaciones basadas en la versión oficial de cada evento, y la nueva ejecución pasa. El paquete debe conservar el caso fallido original, la versión afectada, la corrección y el nuevo resultado. También debe conservar la brecha que queda: que la nueva ejecución pase no demuestra que dos workers concurrentes no puedan entrar en una condición de carrera al actualizar el estado almacenado.

Las suposiciones también necesitan historia. La corrección depende de que las versiones de RR. HH. sean confiables y siempre crecientes. Si esa garantía cambia, la evidencia anterior puede dejar de respaldar la misma conclusión. El paquete debe registrar cuándo una suposición queda obsoleta y qué afirmaciones necesitan reevaluarse.

## 7. Juicio humano y decisiones de riesgo con responsables claros

Las personas siguen cuestionando requisitos, inspeccionando decisiones de diseño importantes y juzgando si las pruebas merecen confianza. En el ejemplo, alguien tiene que cuestionar la autoridad de los eventos del ciclo de vida, examinar cómo sobrevive el estado de baja a los reintentos y decidir si el entorno de pruebas representa de forma significativa al servicio de cuentas.

Luego viene un segundo juicio: ¿la evidencia alcanza para el despliegue propuesto? La probabilidad y el impacto son un punto de partida, pero la decisión también depende de la exposición, la reversibilidad, las salvaguardas, el monitoreo y el rollback. La misma incertidumbre significa una cosa en una evaluación aislada y otra en un despliegue que controla accesos reales.

Las salvaguardas necesitan su propia evidencia. Una alerta sobre reactivaciones solo sirve si detecta la condición y llega a alguien capaz de responder. Revertir el código del flujo puede detener cambios futuros y dejar activa una cuenta que ya se reactivó, así que la recuperación tiene que atender el estado de los accesos además del estado del software. La reversibilidad también tiene límites: deshabilitar la cuenta después no deshace lo que se hizo mientras el acceso estuvo abierto.

Ese segundo juicio no le corresponde por defecto a quien revisa el código. Aceptar el riesgo residual es tarea de la persona responsable del riesgo que designe la gobernanza de la organización. Puede ser la misma persona responsable de la política que definió la regla de bajas o la responsable de un sistema distinto, pero aprobar código no convierte a quien revisa en ninguna de las dos: el permiso para hacer merge no es autoridad para aceptar las consecuencias operativas o de seguridad de desplegar.

Aceptar el riesgo también es distinto de publicar el cambio. El equipo de ingeniería sigue ejecutando el despliegue; la persona responsable del riesgo decide si puede avanzar y bajo qué condiciones.

Para los cambios rutinarios, la persona responsable del riesgo puede delegar esa aceptación de antemano bajo criterios acordados, para que los merges ordinarios no esperen una firma. La decisión vuelve a esa persona cuando el riesgo residual supera un umbral acordado. Un camino que puede restaurar el acceso de alguien dado de baja lo supera.

Entre las decisiones posibles están pedir más evidencia, limitar el despliegue, aceptar un riesgo residual documentado o rechazar el lanzamiento. Un despliegue limitado podría empezar comparando los cambios de cuenta previstos con el estado actual sin aplicarlos, y luego avanzar dentro de un alcance acotado después de más verificaciones. Un despliegue así produce evidencia sobre comportamientos específicos; no demuestra todas las propiedades de un despliegue completamente activo.

Sea cual sea la decisión, el paquete debe registrarla con su alcance, la persona responsable del riesgo que la tomó, las salvaguardas en las que se apoya y un momento para reevaluarla. Los requisitos obligatorios siguen siendo restricciones. Un resumen favorable o alguien dispuesto a aprobar no pueden, por sí solos, autorizar que se omitan.

## 8. El despliegue produce la siguiente generación de evidencia

Volvamos a la aprobación del inicio. Su valor debería venir del razonamiento y la evidencia que la respaldan: los requisitos cuestionados, las ejecuciones observadas, las fallas corregidas y la incertidumbre entregada a quien tiene la responsabilidad de decidir. El nombre de quien revisó dice quién responde por la revisión; el paquete hace inspeccionable la base de esa revisión.

El despliegue inicia otra ronda de aprendizaje. Observar la automatización en producción puede revelar nuevos patrones de retraso, reintentos, intervenciones manuales y fallas de recuperación. Esas observaciones pueden convertirse en pruebas de regresión, poner a prueba las simulaciones de los servicios y exponer suposiciones que ya no se cumplen. La ausencia de alertas significa algo solo dentro de los límites de lo que el monitoreo podía detectar.

Por eso el paquete de evidencia debe seguir vinculado a las versiones desplegadas y a los hallazgos posteriores. Cuando la producción contradice una expectativa probada, investiga tanto la implementación como el modelo de operación de la prueba. Actualiza los escenarios afectados, reevalúa las afirmaciones que dependían de ellos y revisa las decisiones de riesgo cuando haga falta.

La revisión basada en evidencia no termina con el merge. La IA puede reunir y examinar evidencia a una escala que ninguna persona revisora puede igualar. Las personas todavía tienen que juzgar qué significa esa evidencia y decidir si la incertidumbre que queda es aceptable para un despliegue en particular. El paquete existe para que esa incertidumbre sea lo bastante visible como para decidir con responsabilidad.

---

[^1]: National Institute of Standards and Technology, [NIST SP 800-218: Secure Software Development Framework (SSDF), version 1.1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf), febrero de 2022, prácticas PW.7 y PW.8. El flujo multiagente, el método basado en el historial operativo y el enfoque de confianza de este ensayo son propuestas, no prescripciones atribuidas al NIST. Todos los eventos, reglas, registros y resultados descritos aquí son ilustraciones sintéticas, no reportes sobre un empleador ni sobre un sistema desplegado.
