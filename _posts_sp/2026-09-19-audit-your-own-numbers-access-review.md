---
title: "Antes de confiar en el número"
date: 2026-09-19
slug: audit-your-own-numbers-access-review
topic: iam
lang: es
description: "Un dashboard me decía que un control de seguridad estaba fallando. El error estaba en mi medición. Lo que eso me enseñó sobre revisar los números que la gente usa para tomar decisiones."
translation: "/blog/2026/09/audit-your-own-numbers-access-review/"
image: /img/blog-hero/pixabay-1051697.jpg
---

Alguna vez construí un dashboard que mostraba un control de seguridad fallando en cerca del diez por ciento de los eventos. Había gente mirando ese número. Se estaba armando un plan para arreglar el problema, y yo me estaba preparando para investigar por qué el control dejaba pasar cosas.

El control funcionaba el cien por ciento de las veces.

El error estaba en la forma en que le había enseñado al dashboard a clasificar ciertos eventos. En el borde de las reglas, mi lógica se contradecía a sí misma. Había construido una medición que hacía ver roto un control que funcionaba, y el resultado era lo bastante convincente como para que la gente empezara a actuar sobre él.

Pienso en eso cada vez que estoy por mandarle un hallazgo de seguridad a alguien.

Buena parte de mi trabajo consiste en revisar quién puede entrar a los sistemas de una empresa y si todavía necesita ese acceso. En la industria lo llamamos access review. Las preguntas son bastante comunes: ¿alguien que ya se fue de la empresa sigue teniendo cuenta? ¿Puede un contractor abrir una aplicación con la que ya no trabaja? ¿Quién es responsable de una cuenta compartida?

Responderlas implica juntar información de sistemas distintos. Uno te dice qué cuentas existen. Otro te dice qué aplicaciones pueden abrir esas cuentas. Un tercero te dice cuándo alguien inició sesión. Juntas los registros, cuentas las excepciones, y ya tienes un reporte.

El problema es que esos sistemas no necesariamente cuentan la misma historia. Pueden cubrir personas distintas, usar nombres distintos, o describir momentos distintos en el tiempo. El código que combina sus registros también puede equivocarse. Para cuando el resultado llega a una junta, toda esa incertidumbre puede haber desaparecido detrás de un número muy concreto.

He cometido suficientes de estos errores como para saber lo fácil que pasa.

Un resultado de cero, por ejemplo, tranquiliza. Ninguna cuenta inesperada. Ninguna actividad sospechosa. Nada que investigar. Es también un resultado que la gente tiene pocas razones para cuestionar.

Pero un reporte vacío puede significar que la búsqueda falló. Algunos sistemas responden a una búsqueda que no logran entender devolviendo cero registros, sin avisar que algo salió mal. También puedes estar buscando en la parte equivocada del registro. Un log puede distinguir entre una persona que hizo algo y una persona a cuya cuenta alguien más le hizo algo. Busca solo en la segunda categoría y quizá encuentres cambios a la cuenta mientras se te escapan todos los inicios de sesión.

Antes de confiar en un resultado vacío, ahora pruebo el mismo tipo de búsqueda sobre una cuenta que sé que ha estado activa. Si esa también regresa vacía, tengo motivo para investigar la búsqueda antes de sacar conclusiones sobre la cuenta.

Aprendí algo parecido revisando varios miles de cuentas en busca de accesos a aplicaciones que se hubieran pasado por alto. No encontré ninguno. Durante como una hora, eso pareció buena noticia.

Después noté una aplicación con miles de inicios de sesión registrados. Según la otra fuente que estaba usando, nadie tenía acceso a ella.

Claramente había gente entrando. La fuente simplemente no estaba devolviendo la información que yo necesitaba. Mi reporte se veía completo porque nada en la respuesta me decía qué faltaba.

Esa experiencia también me volvió más cuidadoso con la palabra "sin uso". Las empresas suelen tener un servicio central de inicio de sesión, esa página familiar por la que pasan los empleados para abrir sus aplicaciones de trabajo. Sus registros sirven, pero solo muestran la actividad que pasa por ahí. Alguien que usa una cuenta creada directamente en la aplicación, una contraseña compartida, o una conexión aparte para software puede no aparecer nunca.

Si solo revisé el servicio central, puedo decir que no vi inicios de sesión ahí. Llamarle "sin uso" a la aplicación va más lejos de lo que permite la evidencia. Antes de recomendar que se quite un acceso, necesito revisar también los registros propios de la aplicación.

Hay otra pregunta escondida dentro de una cuenta callada: ¿podía siquiera iniciar sesión su dueño? Una cuenta suspendida, desactivada o que nunca se activó hay que entenderla distinto de una cuenta funcional que alguien dejó de usar. Combinarlas produce un número más grande, pero le da menos idea de qué hacer a quien recibe el reporte.

Hasta un campo llamado "último inicio de sesión" merece una revisión. Me he topado con timestamps que cambiaron cuando se suspendió o se reactivó una cuenta, sin que nadie iniciara sesión. Una etiqueta familiar puede hacer que un dato parezca más directo de lo que es.

Algunas de las falsas alarmas más convincentes salen de comparar dos listas que nunca fueron del todo comparables.

Supongamos que una lista tiene a todos los que hoy tienen acceso a una aplicación, y otra tiene a todos los que la usaron durante un periodo anterior. Alguien a quien le quitaron el acceso después de ese periodo va a aparecer en la lista de uso pero no en la de acceso actual. Eso puede verse como una persona entrando a un sistema sin permiso. Puede que el tiempo lo explique por completo.

El mismo problema ocurre cuando las listas incluyen tipos distintos de cuentas. Si una cubre solo cuentas activas y la otra incluye una población más amplia, el desajuste puede verse como una brecha de seguridad. Antes de investigar la diferencia, necesito establecer a quién incluye cada lista y cuándo se recolectó.

Eso no significa que deba limitar cada revisión a las cuentas activas. Hacerlo puede esconder algo que vale la pena encontrar.

Cuando una vez amplié una revisión más allá de las cuentas activas, para incluir todo lo que no estuviera borrado, aparecieron decenas de aplicaciones adicionales. Sus permisos de acceso estaban enteramente en manos de cuentas que ya no podían iniciar sesión. Esos permisos habían desaparecido de mi reporte anterior porque yo había excluido a las cuentas que los tenían.

Un contractor suspendido con cuarenta permisos de aplicaciones sigue siendo algo que quiero entender. Que hoy no pueda iniciar sesión no responde si esos permisos deberían seguir pegados a la cuenta.

Los nombres traen su propia confusión. Alguien cambia de correo, y los registros viejos conservan el anterior. Cuenta por correo y la misma persona puede aparecer dos veces. La dirección vieja se ve abandonada, quizá como una cuenta que habría que cerrar, mientras la persona sigue trabajando bajo la nueva. Por eso importa el identificador permanente de la cuenta, aunque el correo sea lo que hace legible el reporte.

Luego están las etiquetas que se usan para decidir, de entrada, quién entra en la revisión.

Una empresa puede querer que cierta regla cubra a su personal tercerizado. Suena simple hasta que preguntas cómo reconoce el sistema a esas personas. Puede apoyarse en un campo que manda el sistema de HR, en un job title, o en la membresía de un grupo cuya propia membresía viene de otros varios grupos. La descripción del grupo puede explicar para qué se creó. Las reglas reales explican a quién incluye.

En una comparación, encontré un campo codificado, mantenido por un feed de HR, que estaba lleno para casi todo el mundo y usaba un conjunto controlado de valores. El campo de job title, para esas mismas personas, tenía decenas de valores, incluyendo seis formas de escribir un mismo puesto. Ya había reglas basadas en job title corriendo, y en silencio se estaban saltando gente.

El campo más legible era el menos confiable.

La información que falta también puede engañar. Si el personal tercerizado no entra por el sistema de HR, buscar cuentas activas sin employee ID quizá encuentre a la mayoría. También puede encontrar cuentas temporales, cuentas de prueba, y otras personas que el sistema de HR no conoce. Una pista útil se vuelve una mala regla cuando se trata como definición completa.

Y arreglar un valor faltante en el directorio puede no arreglar el problema. Si ese valor viene de otro sistema, la siguiente actualización automática puede sobrescribir la corrección. El reporte se ve mejor un rato, y después la cuenta se vuelve a caer. La reparación tiene que hacerse donde nace la información.

Estos detalles pueden sonar lejanos para quien lee un reporte, pero afectan decisiones muy cotidianas. Un conteo de membresía de grupo puede incluir cuentas viejas y desactivadas, así que usarlo como headcount o como estimado de licencias puede inflar lo que hace falta. Una regla de nombres pensada para excluir cuentas de máquina puede terminar excluyendo personas reales. He visto una de esas reglas dejar fuera a dos personas porque un prefijo que originalmente se usaba para cuentas no interactivas después se reutilizó para una categoría de cuentas humanas.

El total seguía viéndose plausible. Leer los nombres que habían quedado excluidos fue lo que expuso el error.

Por eso también le pongo atención al grupito que suele aparecer etiquetado como "desconocido" al final de un reporte. Da tentación dejarlo ahí, sobre todo cuando ya se explicó a la mayor parte de la población. Pero esas cuentas también necesitan decisiones.

Revisando uno de esos grupos, encontré una cuenta funcional compartida sin manager y una cuenta de prueba que llevaba meses suspendida. Las dos estaban dentro de una población productiva y conservaban sus permisos de acceso. En el resumen, se habían reducido a una sola línea etiquetada "desconocido".

Una vez que las miré una por una, había trabajo que alguien podía tomar. Algunas cuentas había que clasificarlas. Otras necesitaban una decisión de acceso. El conteo por sí solo no le decía a nadie cuál era cuál.

Ahora trato de guardar los registros que hay detrás de un número junto con el número mismo. Si alguien pregunta qué cuentas componen un hallazgo, quiero responder desde el mismo conjunto de datos que lo produjo.

Reconstruir esa lista después es menos confiable de lo que suena. Una vez, un export de cinco días atrás me dio cuarenta y cinco candidatos para un bucket que había tenido cuarenta cuentas. No pude saber cuáles cinco se habían ido. Seguía teniendo un total, pero ya no podía explicar exactamente quién estaba detrás.

La aritmética también hay que revisarla. Si una persona pertenece a dos grupos, sumar los totales de los grupos la cuenta dos veces. Un total que se ve sensato puede sobrevivir varias rondas de reportes antes de que alguien lo note. Lo comparo contra un conteo aparte de las personas mismas, y reviso el inventario de fondo elemento por elemento. Las diferencias son más fáciles de encontrar ahí que en un párrafo sobre toda una categoría de aplicaciones.

Todo esto toma tiempo. También lo toma pedirle a la gente que investigue un problema que solo existe en tu reporte.

Una falsa alarma gasta la confianza de quienes tienen que actuar sobre ella. Descartar una brecha real como si fuera un error de reporte puede hacer más daño. Tengo que dejar lugar para las dos posibilidades y juntar evidencia suficiente para distinguirlas.

Antes de que un hallazgo salga de mis manos, ahora me pregunto qué más podría explicarlo. ¿Se recolectaron las listas en momentos distintos? ¿Conté dos veces a la misma persona? ¿La fuente dejó algo fuera? ¿La regla está seleccionando a la gente que creo?

Después reporto lo que puedo sostener, incluyendo lo que no pude verificar. Todavía me acuerdo de lo seguro que se veía ese diez por ciento en mi dashboard, y de lo cerca que estuvimos de armar un plan de remediación alrededor de mi error.
