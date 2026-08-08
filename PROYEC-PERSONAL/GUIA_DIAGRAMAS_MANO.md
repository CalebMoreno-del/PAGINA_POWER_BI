# Guía Práctica de Aprendizaje: Diseñando el ERP de Pulpas a Mano (Diagramas de Flujo)

¡Excelente decisión! Diseñar a mano y entender los flujos de procesos en papel antes de escribir una sola línea de código es la mejor práctica de ingeniería de software. Te ayudará a visualizar cómo fluyen los datos y evitará que cometas errores costosos de lógica más adelante.

Esta guía está diseñada para que tomes una **hoja de papel, un lápiz, un borrador y algunos colores o marcadores**, y dibujes conmigo paso a paso los procesos del sistema.

---

## 🛠️ Tu Caja de Herramientas de Dibujo (Simbología Estándar)

Para que tus diagramas sean fáciles de entender para cualquiera, usaremos la simbología estándar de diagramas de flujo:

| Símbolo | Cómo dibujarlo en papel | Qué representa | Ejemplo en nuestro sistema |
| :---: | :--- | :--- | :--- |
| **Óvalo / Elipse** | Un círculo alargado horizontalmente | **Inicio / Fin** | "Inicio del proceso de compra" o "Fin de la venta" |
| **Rectángulo** | Una caja estándar | **Acción o Proceso** (Cosas que el sistema o tú hacen) | "Registrar cantidad de fruta recibida en Kg" |
| **Rombo** | Un cuadrado inclinado a 45 grados | **Decisión** (Preguntas con respuestas Sí/No) | "¿La fruta supera la inspección de calidad?" |
| **Trapezoide o Caja inclinada** | Rectángulo con los lados inclinados | **Entrada/Salida de Datos manual** | "Usuario ingresa Nit de proveedor y Precio de compra" |
| **Cilindro** | Rectángulo con tapa y base curvas | **Base de Datos** (Guardar información) | "Guardar datos del lote en la tabla `LoteProduccion`" |
| **Rectángulo con base ondulada**| Caja con una curva tipo ola abajo | **Documento / Reporte impreso o PDF** | "Generar factura de venta en PDF" |

---

## 🛑 EJERCICIO 1: Diagrama de Flujo - Compra de Fruta y Control de Calidad

Este primer diagrama define el "nacimiento" de nuestra materia prima. Aquí registramos la compra y decidimos qué fruta entra al inventario utilizable y cuál se reporta como dañada (merma de entrada).

### Pasos para dibujarlo en tu papel:
1. **Dibuja un Óvalo** en la parte superior central de tu hoja y escribe adentro: **`Inicio: Compra de Fruta`**.
2. **Dibuja una flecha hacia abajo** y haz un **Trapezoide (Entrada manual)** que diga: **`Ingresar: Proveedor, Fruta, Kg Comprados y Precio unitario`**.
3. **Dibuja una flecha hacia abajo** y haz un **Rectángulo (Proceso)**: **`Generar ID de Compra y Lote de Origen`**.
4. **Dibuja otra flecha hacia abajo** y haz un **Rombo (Decisión)** con la pregunta: **`¿Fruta en estado Óptimo?`**.
   - **Camino NO (saca la flecha por el lado derecho del rombo)**:
     - Dibuja un **Rectángulo (Proceso)**: **`Registrar en Calidad como "Fruta Dañada" (Merma en Recepción)`**.
     - Saca una flecha de esta caja y llévala al **Fin**.
   - **Camino SÍ (saca la flecha por la parte inferior del rombo)**:
     - Sigue con una flecha hacia abajo.
5. **Dibuja un Rectángulo (Proceso)**: **`Sumar Kg al inventario de Materia Prima`**.
6. **Dibuja una flecha hacia abajo** y conecta con un **Cilindro (Base de datos)** que diga: **`Guardar registro en Tabla Compra y DetalleCompra`**.
7. **Dibuja un Óvalo final**: **`Fin del Proceso de Compra`**.

*💡 **Consejo de Aprendizaje**: Usa un lápiz de color verde para el camino del "SÍ" y un lápiz de color rojo para el camino del "NO". Esto entrenará tu mente a identificar flujos de error (Edge Cases).*

---

## 🍏 EJERCICIO 2: Diagrama de Flujo - Producción y Costeo de Lotes de Pulpa

Este es el corazón del negocio. Aquí transformamos la fruta fresca en pulpas congeladas embolsadas, midiendo la merma de proceso, los tiempos de los empleados y la temperatura.

### Pasos para dibujarlo en tu papel:
1. **Dibuja un Óvalo**: **`Inicio: Producción de Lote`**.
2. **Dibuja un Trapezoide (Entrada manual)**: **`Seleccionar sabor, tamaño de bolsa, cantidad de fruta a usar (Kg) y empleado asignado`**.
3. **Dibuja un Rectángulo (Proceso)**: **`Crear Código de Lote Único (Ej: LP-FR-AAAAMMDD-01)`** y **`Restar Fruta y Bolsas del Inventario de Materia Prima`**.
4. **Dibuja un Rectángulo (Proceso)**: **`Registrar Hora de Inicio de Despulpe`**.
5. *-- El proceso ocurre --* **Dibuja un Trapezoide (Entrada manual)**: **`Registrar Hora de Fin y Kg de pulpa limpia obtenidos`**.
6. **Dibuja un Rectángulo (Proceso)** para los cálculos automáticos clave:
   - **`Calcular Merma (Kg fruta - Kg pulpa)`**
   - **`Calcular % de Merma`**
   - **`Calcular Tiempo Trabajado (Hora Fin - Hora Inicio)`**
7. **Dibuja otro Rectángulo (Proceso)** para el **Cálculo de Costo Unitario**:
   - **`Costo Unitario = (Costo Fruta Usada + Costo de Bolsas + Mano de Obra Prorrateada) / Unidades Embolsadas`**.
8. **Dibuja un Trapezoide (Entrada manual)**: **`Registrar Temperatura de Congelador (°C)`**.
9. **Dibuja una flecha hacia abajo** y haz un **Rombo (Decisión)**: **`¿Temperatura menor a -15 °C?`**
   - **Camino NO**: Saca una flecha a un **Rectángulo de Proceso**: **`Generar Alerta Crítica de Cadena de Frío`**. Conéctalo al almacenamiento del lote para que quede registrado.
   - **Camino SÍ**: Saca una flecha abajo hacia el almacenamiento.
10. **Dibuja un Cilindro (Base de Datos)**: **`Registrar en Tabla LoteProduccion e incrementar Stock de Producto Terminado`**.
11. **Dibuja un Óvalo**: **`Fin de Producción`**.

---

## 🛒 EJERCICIO 3: Diagrama de Flujo - Venta y Trazabilidad Inversa

Aquí verás cómo el sistema permite asegurar la calidad. Si un cliente reclama que una pulpa de fresa le supo mal, ¿cómo sabemos de qué lote de producción vino, a qué temperatura se congeló, quién la procesó y a qué proveedor le compramos la fresa original?

### Pasos para dibujarlo en tu papel:
1. **Dibuja un Óvalo**: **`Inicio: Registrar Venta`**.
2. **Dibuja un Trapezoide**: **`Seleccionar Cliente, Producto (Sabor y Presentación), Cantidad y Lote de Producción de donde se toma`**.
3. **Dibuja un Rombo**: **`¿Hay stock disponible en ese lote?`**
   - **Camino NO**: Flecha a un mensaje en pantalla **`"Stock insuficiente"`** y vuelve a la selección.
   - **Camino SÍ**: Sigue adelante.
4. **Dibuja un Rectángulo (Proceso)**: **`Restar unidades del stock del LoteProduccion`** y **`Calcular Subtotal, Impuesto y Total`**.
5. **Dibuja un Cilindro (Base de Datos)**: **`Guardar Venta y DetalleVenta (asociando el ID del LoteProduccion)`**.
6. **Dibuja un Rectángulo con base ondulada (Documento)**: **`Generar Factura de Venta PDF`**.
7. **Dibuja un Rectángulo (Proceso) adicional para el aprendizaje (Trazabilidad Inversa)**:
   - Rotúlalo como: **`Rastreador de Origen (Trazabilidad)`**:
     - *Ingresa Factura* ➔ *Saca Lote de Pulpa* ➔ *Saca Lote de Fruta* ➔ *Saca Proveedor de Fruta* ➔ *Saca Auditoría de Temperatura y Empleado*.
8. **Dibuja un Óvalo**: **`Fin de Venta`**.

---

## 🙋‍♂️ ¡Tu Turno! Hagamos esto interactivo

Quiero que elijas uno de estos diagramas para empezar a dibujarlo ahora mismo:

1. **¿Cuál te gustaría dibujar primero en tu hoja de papel?**
   - **Opción A**: Compra de Fruta y Calidad (El más sencillo para calentar motores).
   - **Opción B**: Producción, Costeo y Temperatura de Lotes (El corazón del negocio).
   - **Opción C**: Ventas y Trazabilidad (El que conecta todo).

Cuéntame cuál eliges. Prepárate una hoja, dibújalo siguiendo mis pasos detallados de arriba, y dime si tienes dudas con algún símbolo, relación o cálculo lógico. ¡Estoy listo para guiarte en cada trazo! 🚀✍️
