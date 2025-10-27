// PDFGenerator.js - Utilidad para generar informes PDF de evaluación ROSA
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Función auxiliar para generar nombre de archivo
const generarNombreArchivo = (datosEvaluacion) => {
  const fecha = new Date();
  const fechaFormateada = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
  const horaFormateada = fecha.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  
  const trabajador = (datosEvaluacion?.nombreTrabajador || 'SinNombre').replace(/\s+/g, '_');
  const empresa = (datosEvaluacion?.empresa || 'SinEmpresa').replace(/\s+/g, '_');
  
  return `Informe_ROSA_${trabajador}_${empresa}_${fechaFormateada}_${horaFormateada}`;
};

// Función para obtener nivel de actuación
const getNivelActuacion = (puntuacion) => {
  if (puntuacion === 1) return '0';
  if (puntuacion >= 2 && puntuacion <= 4) return '1';
  if (puntuacion === 5) return '2';
  if (puntuacion >= 6 && puntuacion <= 8) return '3';
  if (puntuacion >= 9) return '4';
  return '0';
};

// Función para obtener descripción de actuación
const getDescripcionActuacion = (puntuacion) => {
  if (puntuacion === 1) return 'No es necesaria actuación.';
  if (puntuacion >= 2 && puntuacion <= 4) return 'Pueden mejorarse algunos elementos del puesto.';
  if (puntuacion === 5) return 'Es necesaria la actuación.';
  if (puntuacion >= 6 && puntuacion <= 8) return 'Es necesaria la actuación cuanto antes.';
  if (puntuacion >= 9) return 'Es necesaria la actuación urgentemente.';
  return 'No es necesaria actuación.';
};

export const generarInformePDF = (datosEvaluacion, puntuacionFinal, nivelRiesgo, recomendaciones) => {
  // Crear contenido HTML optimizado para PDF
  const contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Informe ROSA - ${datosEvaluacion?.identificadorPuesto || 'Sin ID'}</title>
      <style>
        /* Reset y base */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.5; 
          color: #2c3e50; 
          background: white;
          font-size: 11px;
        }
        
        /* Layout */
        .container { 
          max-width: 100%; 
          margin: 0; 
          padding: 0; 
          background: white;
        }
        .page-break { 
          margin-top: 20px;
          padding-top: 10px;
        }
        
        /* Header profesional */
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header h1 { 
          font-size: 24px; 
          margin-bottom: 8px; 
          font-weight: 700;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .header .subtitle { 
          font-size: 14px; 
          margin-bottom: 6px;
          opacity: 0.95;
        }
        .header .date { 
          font-size: 11px;
          opacity: 0.9;
          font-weight: 300;
        }
        
        /* Logo/Marca de agua */
        .marca-agua {
          position: fixed;
          bottom: 20px;
          right: 20px;
          opacity: 0.1;
          font-size: 120px;
          color: #667eea;
          font-weight: bold;
          z-index: -1;
        }
        
        /* Secciones */
        .section { 
          margin-bottom: 25px; 
          break-inside: avoid;
          background: white;
        }
        .section h2 { 
          color: #667eea; 
          border-left: 4px solid #667eea;
          padding-left: 12px;
          padding-bottom: 8px; 
          margin-bottom: 15px; 
          font-size: 18px;
          font-weight: 600;
        }
        .section h3 { 
          color: #764ba2; 
          margin: 18px 0 12px 0; 
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 6px;
        }
        
        /* Caja destacada */
        .caja-destacada {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 18px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          margin: 15px 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        
        /* Grid de información */
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 12px; 
          margin-bottom: 15px; 
        }
        .info-item { 
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          padding: 12px; 
          border-radius: 8px; 
          border-left: 4px solid #667eea;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }
        .info-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .info-item strong { 
          color: #2c3e50;
          display: block;
          margin-bottom: 5px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Resultado principal */
        .resultado-principal { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px; 
          text-align: center; 
          border-radius: 15px; 
          margin: 35px 0; 
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }
        .puntuacion-grande { 
          font-size: 48px; 
          font-weight: 900; 
          color: white;
          margin: 15px 0; 
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .nivel-riesgo { 
          font-size: 20px; 
          font-weight: 700; 
          margin: 12px 0; 
          padding: 10px 24px;
          border-radius: 24px;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .nivel-inapreciable { background: #10b981; color: white; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4); }
        .nivel-mejorable { background: #3b82f6; color: white; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4); }
        .nivel-alto { background: #f59e0b; color: white; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4); }
        .nivel-muy-alto { background: #f97316; color: white; box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4); }
        .nivel-extremo { background: #ef4444; color: white; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4); }
        
        .descripcion-riesgo {
          font-size: 14px;
          margin-top: 15px;
          line-height: 1.6;
          background: rgba(255,255,255,0.1);
          padding: 12px;
          border-radius: 8px;
        }
        
        /* Tablas mejoradas */
        .tabla-container { 
          margin: 20px 0; 
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .tabla { 
          width: 100%; 
          border-collapse: collapse; 
          background: white;
        }
        .tabla th, .tabla td { 
          border: 1px solid #e5e7eb; 
          padding: 8px 6px; 
          text-align: center; 
          font-size: 10px;
        }
        .tabla th { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          font-weight: 600;
          text-transform: uppercase;
          font-size: 9px;
          letter-spacing: 0.3px;
        }
        .tabla tr:nth-child(even) { background: #f9fafb; }
        .tabla tr:hover { background: #f3f4f6; }
        .tabla tr.destacada {
          background: #ede9fe !important;
          font-weight: 600;
        }
        
        /* Tabla de niveles de actuación */
        .tabla-niveles {
          margin: 20px 0;
        }
        .tabla-niveles th {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }
        .fila-nivel-0 { background: #d1fae5 !important; }
        .fila-nivel-1 { background: #dbeafe !important; }
        .fila-nivel-2 { background: #fef3c7 !important; }
        .fila-nivel-3 { background: #fed7aa !important; }
        .fila-nivel-4 { background: #fecaca !important; }
        .fila-seleccionada {
          background: #c7d2fe !important;
          font-weight: 700;
          border: 2px solid #667eea !important;
        }
        .badge-nivel {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 11px;
        }
        .badge-0 { background: #10b981; color: white; }
        .badge-1 { background: #3b82f6; color: white; }
        .badge-2 { background: #f59e0b; color: white; }
        .badge-3 { background: #f97316; color: white; }
        .badge-4 { background: #ef4444; color: white; }
        
        /* Resumen de puntuaciones mejorado */
        .resumen-puntuaciones {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 18px;
          border-radius: 8px;
          margin: 18px 0;
          border: 2px solid #10b981;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.1);
        }
        .puntuacion-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: white;
          margin: 6px 0;
          border-radius: 6px;
          border-left: 3px solid #667eea;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .puntuacion-item.final {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-left: none;
          font-size: 16px;
          padding: 12px;
          margin-top: 12px;
        }
        .puntuacion-valor {
          font-weight: 700;
          font-size: 16px;
          color: #667eea;
          min-width: 40px;
          text-align: center;
          background: #ede9fe;
          padding: 8px 15px;
          border-radius: 25px;
        }
        .puntuacion-item.final .puntuacion-valor {
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 28px;
        }
        
        /* Recomendaciones mejoradas */
        .recomendacion-categoria { 
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          padding: 25px; 
          border-radius: 12px; 
          margin: 20px 0; 
          border-left: 6px solid #f59e0b;
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.1);
          break-inside: avoid;
        }
        .recomendacion-categoria h4 { 
          color: #92400e; 
          margin-bottom: 12px; 
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
        }
        .recomendacion-categoria h4::before {
          content: "💡";
          margin-right: 8px;
          font-size: 18px;
        }
        .recomendacion-lista { 
          list-style: none; 
          padding: 0; 
        }
        .recomendacion-lista li { 
          padding: 6px 0 6px 24px;
          position: relative;
          line-height: 1.5;
          color: #78350f;
          font-size: 11px;
        }
        .recomendacion-lista li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #f59e0b;
          font-size: 14px;
          font-weight: bold;
        }
        
        /* Footer mejorado */
        .footer { 
          margin-top: 40px; 
          padding: 18px 15px;
          border-top: 2px solid #667eea;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 8px;
          text-align: center; 
          font-size: 10px; 
          color: #6b7280; 
        }
        .footer p { 
          margin: 8px 0;
          line-height: 1.6;
        }
        .footer strong {
          color: #667eea;
        }
        
        /* Divider decorativo */
        .divider {
          height: 3px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          margin: 30px 0;
          border-radius: 2px;
        }
        
        /* Iconos y emojis */
        .icono {
          display: inline-block;
          margin-right: 8px;
          font-size: 20px;
        }
        
        /* Utilidades */
        .text-center { text-align: center; }
        .text-bold { font-weight: bold; }
        .mb-20 { margin-bottom: 20px; }
        .mt-20 { margin-top: 20px; }
        
        /* Media queries para impresión */
        @media print {
          body { font-size: 12px; }
          .container { margin: 0; padding: 15mm; }
          .no-print { display: none; }
          .page-break { page-break-before: always; }
        }
        
        /* Estilos para descarga HTML */
        @media screen {
          body { 
            background: #f3f4f6;
            padding: 20px;
          }
          .container {
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
        }
      </style>
    </head>
    <body>
      <div class="marca-agua">ROSA</div>
      <div class="container">
        
        <!-- PÁGINA 1: PORTADA Y RESUMEN -->
        <div class="header">
          <h1>📊 INFORME DE EVALUACIÓN ERGONÓMICA</h1>
          <div class="subtitle">Método ROSA - Rapid Office Strain Assessment</div>
          <div class="date">📅 Generado el: ${new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</div>
        </div>

        <div class="section">
          <h2>📋 Información General del Puesto</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Identificador del Puesto:</strong><br>
              ${datosEvaluacion?.identificadorPuesto || 'No especificado'}
            </div>
            <div class="info-item">
              <strong>Trabajador Evaluado:</strong><br>
              ${datosEvaluacion?.nombreTrabajador || 'No especificado'}
            </div>
            <div class="info-item">
              <strong>Empresa:</strong><br>
              ${datosEvaluacion?.empresa || 'No especificada'}
            </div>
            <div class="info-item">
              <strong>Departamento:</strong><br>
              ${datosEvaluacion?.departamento || 'No especificado'}
            </div>
            <div class="info-item">
              <strong>Evaluador:</strong><br>
              ${datosEvaluacion?.nombreEvaluador || 'No especificado'}
            </div>
            <div class="info-item">
              <strong>Fecha de Evaluación:</strong><br>
              ${datosEvaluacion?.fechaEvaluacion || 'No especificada'}
            </div>
          </div>
          
          ${datosEvaluacion?.descripcion ? `
            <div class="info-item" style="grid-column: 1 / -1;">
              <strong>Descripción del Puesto:</strong><br>
              ${datosEvaluacion.descripcion}
            </div>
          ` : ''}
        </div>

        <div class="resultado-principal">
          <h2 style="margin-bottom: 20px; font-size: 32px;">🎯 RESULTADO FINAL DE EVALUACIÓN</h2>
          <div class="puntuacion-grande">${puntuacionFinal}</div>
          <div class="nivel-riesgo nivel-${nivelRiesgo.toLowerCase().replace(' ', '-')}">
            RIESGO: ${nivelRiesgo}
          </div>
          <div style="margin: 20px 0; font-size: 24px; font-weight: 600;">
            📊 NIVEL DE ACTUACIÓN: ${getNivelActuacion(puntuacionFinal)}
          </div>
          <div class="descripcion-riesgo">
            ${getDescripcionActuacion(puntuacionFinal)}
          </div>
        </div>

        <div class="divider"></div>

        <!-- TABLA DE NIVELES DE ACTUACIÓN -->
        <div class="section">
          <h2>📋 Tabla de Niveles de Actuación</h2>
          <div class="caja-destacada">
            <p style="margin-bottom: 15px; font-weight: 600; color: #764ba2;">
              Interpretación de la puntuación ROSA según el nivel de actuación requerido:
            </p>
            <div class="tabla-container tabla-niveles">
              <table class="tabla">
                <thead>
                  <tr>
                    <th>Puntuación</th>
                    <th>Riesgo</th>
                    <th>Nivel</th>
                    <th>Actuación Requerida</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="fila-nivel-0 ${puntuacionFinal === 1 ? 'fila-seleccionada' : ''}">
                    <td><strong>1</strong></td>
                    <td>Inapreciable</td>
                    <td><span class="badge-nivel badge-0">0</span></td>
                    <td style="text-align: left;">No es necesaria actuación.</td>
                  </tr>
                  <tr class="fila-nivel-1 ${puntuacionFinal >= 2 && puntuacionFinal <= 4 ? 'fila-seleccionada' : ''}">
                    <td><strong>2 - 3 - 4</strong></td>
                    <td>Mejorable</td>
                    <td><span class="badge-nivel badge-1">1</span></td>
                    <td style="text-align: left;">Pueden mejorarse algunos elementos del puesto.</td>
                  </tr>
                  <tr class="fila-nivel-2 ${puntuacionFinal === 5 ? 'fila-seleccionada' : ''}">
                    <td><strong>5</strong></td>
                    <td>Alto</td>
                    <td><span class="badge-nivel badge-2">2</span></td>
                    <td style="text-align: left;">Es necesaria la actuación.</td>
                  </tr>
                  <tr class="fila-nivel-3 ${puntuacionFinal >= 6 && puntuacionFinal <= 8 ? 'fila-seleccionada' : ''}">
                    <td><strong>6 - 7 - 8</strong></td>
                    <td>Muy Alto</td>
                    <td><span class="badge-nivel badge-3">3</span></td>
                    <td style="text-align: left;">Es necesaria la actuación cuanto antes.</td>
                  </tr>
                  <tr class="fila-nivel-4 ${puntuacionFinal >= 9 ? 'fila-seleccionada' : ''}">
                    <td><strong>9 - 10</strong></td>
                    <td>Extremo</td>
                    <td><span class="badge-nivel badge-4">4</span></td>
                    <td style="text-align: left;">Es necesaria la actuación urgentemente.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <h2>📊 Resumen de Puntuaciones</h2>
          <div class="resumen-puntuaciones">
            <div class="puntuacion-item">
              <span><strong>🪑 Evaluación de la Silla</strong></span>
              <span class="puntuacion-valor">${datosEvaluacion?.evaluacionSilla?.puntuaciones?.puntuacionSilla || 0}</span>
            </div>
            <div class="puntuacion-item">
              <span><strong>🖥️ Pantalla y Periféricos</strong></span>
              <span class="puntuacion-valor">${datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionPantallaPerifericos || 0}</span>
            </div>
            <div class="puntuacion-item final">
              <span><strong>🏆 PUNTUACIÓN ROSA FINAL</strong></span>
              <span class="puntuacion-valor">${puntuacionFinal}</span>
            </div>
          </div>
        </div>

        <!-- DETALLES DE LA EVALUACIÓN -->
        
        <div class="section">
          <h2>🔍 Detalles de la Evaluación</h2>
          
          <h3>Información del Trabajador</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Edad:</strong> ${datosEvaluacion?.edad || 'No especificada'} años
            </div>
            <div class="info-item">
              <strong>Sexo:</strong> ${datosEvaluacion?.sexo || 'No especificado'}
            </div>
            <div class="info-item">
              <strong>Antigüedad en el puesto:</strong> ${datosEvaluacion?.antiguedadPuesto || 'No especificada'}
            </div>
            <div class="info-item">
              <strong>Tiempo en el puesto por jornada:</strong> ${datosEvaluacion?.tiempoPuestoJornada || 'No especificado'}
            </div>
          </div>

          <h3>Componentes Evaluados</h3>
          <div class="tabla-container">
            <table class="tabla">
              <thead>
                <tr>
                  <th>Componente</th>
                  <th>Puntuación Individual</th>
                  <th>Nivel de Riesgo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Altura del Asiento</strong></td>
                  <td>${(datosEvaluacion?.evaluacionSilla?.alturaAsiento?.puntuacion || 0) + (datosEvaluacion?.evaluacionSilla?.alturaAsiento?.incrementos?.length || 0)}</td>
                  <td>${getNivelComponente((datosEvaluacion?.evaluacionSilla?.alturaAsiento?.puntuacion || 0) + (datosEvaluacion?.evaluacionSilla?.alturaAsiento?.incrementos?.length || 0))}</td>
                </tr>
                <tr>
                  <td><strong>Profundidad del Asiento</strong></td>
                  <td>${(datosEvaluacion?.evaluacionSilla?.profundidadAsiento?.puntuacion || 0) + (datosEvaluacion?.evaluacionSilla?.profundidadAsiento?.incrementos?.length || 0)}</td>
                  <td>${getNivelComponente((datosEvaluacion?.evaluacionSilla?.profundidadAsiento?.puntuacion || 0) + (datosEvaluacion?.evaluacionSilla?.profundidadAsiento?.incrementos?.length || 0))}</td>
                </tr>
                <tr>
                  <td><strong>Reposabrazos</strong></td>
                  <td>${(datosEvaluacion?.evaluacionSilla?.reposabrazos?.puntuacion || 0) + (datosEvaluacion?.evaluacionSilla?.reposabrazos?.incrementos?.length || 0)}</td>
                  <td>${getNivelComponente((datosEvaluacion?.evaluacionSilla?.reposabrazos?.puntuacion || 0) + (datosEvaluacion?.evaluacionSilla?.reposabrazos?.incrementos?.length || 0))}</td>
                </tr>
                <tr>
                  <td><strong>Respaldo</strong></td>
                  <td>${(datosEvaluacion?.evaluacionSilla?.respaldo?.puntuacion || 0) + (datosEvaluacion?.evaluacionSilla?.respaldo?.incrementos?.length || 0)}</td>
                  <td>${getNivelComponente((datosEvaluacion?.evaluacionSilla?.respaldo?.puntuacion || 0) + (datosEvaluacion?.evaluacionSilla?.respaldo?.incrementos?.length || 0))}</td>
                </tr>
                <tr class="destacada">
                  <td><strong>🪑 TOTAL SILLA</strong></td>
                  <td><strong>${datosEvaluacion?.evaluacionSilla?.puntuaciones?.puntuacionSilla || 0}</strong></td>
                  <td><strong>${getNivelRiesgo(datosEvaluacion?.evaluacionSilla?.puntuaciones?.puntuacionSilla || 0)}</strong></td>
                </tr>
                <tr>
                  <td><strong>Pantalla/Monitor</strong></td>
                  <td>${datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionPantalla || 0}</td>
                  <td>${getNivelComponente(datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionPantalla || 0)}</td>
                </tr>
                <tr>
                  <td><strong>Teléfono</strong></td>
                  <td>${datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionTelefono || 0}</td>
                  <td>${getNivelComponente(datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionTelefono || 0)}</td>
                </tr>
                <tr>
                  <td><strong>Mouse</strong></td>
                  <td>${datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionMouse || 0}</td>
                  <td>${getNivelComponente(datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionMouse || 0)}</td>
                </tr>
                <tr>
                  <td><strong>Teclado</strong></td>
                  <td>${datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionTeclado || 0}</td>
                  <td>${getNivelComponente(datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionTeclado || 0)}</td>
                </tr>
                <tr class="destacada">
                  <td><strong>🖥️ TOTAL PANTALLA Y PERIFÉRICOS</strong></td>
                  <td><strong>${datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionPantallaPerifericos || 0}</strong></td>
                  <td><strong>${getNivelRiesgo(datosEvaluacion?.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionPantallaPerifericos || 0)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- RECOMENDACIONES -->
        
        <div class="section">
          <h2>💡 Recomendaciones</h2>
          <p style="margin-bottom: 20px; font-style: italic;">
            Las siguientes recomendaciones están basadas en la puntuación obtenida y los hallazgos específicos de la evaluación:
          </p>
          
          ${recomendaciones.map(categoria => `
            <div class="recomendacion-categoria">
              <h4>${categoria.categoria}</h4>
              <ul class="recomendacion-lista">
                ${categoria.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        ${datosEvaluacion?.observaciones ? `
          <div class="section">
            <h2>📝 Observaciones Adicionales</h2>
            <div class="info-item">
              ${datosEvaluacion.observaciones}
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p><strong>📄 Informe generado automáticamente por el Sistema de Evaluación ROSA</strong></p>
          <p>Este informe debe ser interpretado por personal capacitado en ergonomía ocupacional</p>
          <p><strong>📅 Fecha y hora de generación:</strong> ${new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })} a las ${new Date().toLocaleTimeString('es-ES')}</p>
          <div class="divider" style="margin: 15px 0;"></div>
          <p style="font-size: 11px; color: #9ca3af;">
            <strong>Método ROSA:</strong> Desarrollado por Sonne, Villalta y Andrews (2012) para la evaluación rápida de riesgos ergonómicos en puestos de oficina.<br>
            Este método evalúa la postura de trabajo y el uso de equipos en entornos de oficina para identificar factores de riesgo musculoesqueléticos.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Generar nombre de archivo
  const nombreArchivo = generarNombreArchivo(datosEvaluacion);
  
  // Crear un contenedor temporal para el contenido HTML
  const contenedorTemporal = document.createElement('div');
  contenedorTemporal.style.position = 'absolute';
  contenedorTemporal.style.left = '-9999px';
  contenedorTemporal.style.width = '210mm'; // Ancho A4
  contenedorTemporal.style.background = 'white';
  contenedorTemporal.style.padding = '20px';
  contenedorTemporal.innerHTML = contenidoHTML;
  document.body.appendChild(contenedorTemporal);

  // Usar html2canvas para convertir el HTML a imagen
  html2canvas(contenedorTemporal, {
    scale: 2, // Mayor calidad
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    windowWidth: 794, // Ancho A4 en píxeles (210mm)
    windowHeight: contenedorTemporal.scrollHeight
  }).then(canvas => {
    // Remover el contenedor temporal
    document.body.removeChild(contenedorTemporal);
    
    // Crear PDF con jsPDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // Ancho A4 en mm
    const pageHeight = 297; // Alto A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Agregar primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Si el contenido es más largo que una página, agregar más páginas
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Descargar el PDF
    pdf.save(`${nombreArchivo}.pdf`);
  }).catch(error => {
    console.error('Error al generar PDF:', error);
    document.body.removeChild(contenedorTemporal);
    alert('Error al generar el PDF. Por favor, inténtelo de nuevo.');
  });
};

// Funciones auxiliares
const getDescripcionRiesgo = (nivel) => {
  switch (nivel) {
    case 'INAPRECIABLE':
      return 'El puesto presenta un riesgo ergonómico inapreciable. Las condiciones actuales son óptimas. Se recomienda mantener estas condiciones y realizar seguimientos periódicos.';
    case 'MEJORABLE':
      return 'El puesto presenta un riesgo ergonómico mejorable. Se pueden realizar ajustes menores para optimizar las condiciones de trabajo.';
    case 'ALTO':
      return 'El puesto presenta un riesgo ergonómico alto. Se requieren cambios significativos en el puesto de trabajo de forma prioritaria.';
    case 'MUY ALTO':
      return 'El puesto presenta un riesgo ergonómico muy alto. Se requiere acción cuanto antes para prevenir lesiones musculoesqueléticas.';
    case 'EXTREMO':
      return 'El puesto presenta un riesgo ergonómico extremo. Se requiere acción inmediata y urgente para prevenir lesiones graves.';
    default:
      return 'Nivel de riesgo no determinado.';
  }
};

const getNivelRiesgo = (puntuacion) => {
  if (puntuacion === 1) return 'INAPRECIABLE';
  if (puntuacion >= 2 && puntuacion <= 4) return 'MEJORABLE';
  if (puntuacion === 5) return 'ALTO';
  if (puntuacion >= 6 && puntuacion <= 8) return 'MUY ALTO';
  if (puntuacion >= 9) return 'EXTREMO';
  return 'INAPRECIABLE';
};

const getNivelComponente = (puntuacion) => {
  if (puntuacion <= 1) return 'Óptimo';
  if (puntuacion <= 2) return 'Aceptable';
  if (puntuacion <= 3) return 'Mejorable';
  return 'Problemático';
};

// Función alternativa para descargar como archivo HTML
export const descargarInformeHTML = (datosEvaluacion, puntuacionFinal, nivelRiesgo, recomendaciones) => {
  // Reutilizar la misma función generarInformePDF pero modificar el comportamiento final
  const contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Informe ROSA - ${datosEvaluacion?.nombreTrabajador || 'Sin Trabajador'} - ${datosEvaluacion?.empresa || 'Sin Empresa'}</title>
      ${obtenerEstilosHTML()}
    </head>
    <body>
      ${obtenerContenidoHTML(datosEvaluacion, puntuacionFinal, nivelRiesgo, recomendaciones)}
    </body>
    </html>
  `;
  
  const blob = new Blob([contenidoHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const nombreArchivo = generarNombreArchivo(datosEvaluacion);
  const enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = url;
  enlaceDescarga.download = `${nombreArchivo}.html`;
  
  document.body.appendChild(enlaceDescarga);
  enlaceDescarga.click();
  document.body.removeChild(enlaceDescarga);
  
  URL.revokeObjectURL(url);
};

// Funciones auxiliares para reutilizar código
const obtenerEstilosHTML = () => {
  return `<style>/* Los estilos CSS aquí */</style>`;
};

const obtenerContenidoHTML = (datosEvaluacion, puntuacionFinal, nivelRiesgo, recomendaciones) => {
  return `<!-- Contenido HTML aquí -->`;
};