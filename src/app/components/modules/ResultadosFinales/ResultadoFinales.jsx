'use client';

import React, { useState, useEffect } from 'react';
import { generarInformePDF, descargarInformeHTML } from '../../../utils/PDFGenerator';

const ResultadosFinales = ({ onVolverInicio, onVolver, datosEvaluacion }) => {
  const [puntuacionFinal, setPuntuacionFinal] = useState(0);
  const [nivelRiesgo, setNivelRiesgo] = useState('');
  const [recomendaciones, setRecomendaciones] = useState([]);

  useEffect(() => {
    calcularResultadoFinal();
  }, [datosEvaluacion]);

  const calcularResultadoFinal = () => {
    if (!datosEvaluacion?.evaluacionSilla || !datosEvaluacion?.evaluacionPantallaPerifericos) {
      return;
    }

    const puntuacionSilla = datosEvaluacion.evaluacionSilla.puntuaciones?.puntuacionSilla || 0;
    const puntuacionPantallaPerifericos = datosEvaluacion.evaluacionPantallaPerifericos.puntuaciones?.puntuacionPantallaPerifericos || 0;

    // Tabla E - Combinación final
    const tablaE = obtenerTablaE(puntuacionSilla, puntuacionPantallaPerifericos);
    
    setPuntuacionFinal(tablaE);
    setNivelRiesgo(getNivelRiesgo(tablaE));
    setRecomendaciones(getRecomendaciones(tablaE, datosEvaluacion));
  };

  const obtenerTablaE = (silla, pantallaPerifericos) => {
    const tabla = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [2, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [3, 3, 3, 4, 5, 6, 7, 8, 9, 10],
      [4, 4, 4, 4, 5, 6, 7, 8, 9, 10],
      [5, 5, 5, 5, 5, 6, 7, 8, 9, 10],
      [6, 6, 6, 6, 6, 6, 7, 8, 9, 10],
      [7, 7, 7, 7, 7, 7, 7, 8, 9, 10],
      [8, 8, 8, 8, 8, 8, 8, 8, 9, 10],
      [9, 9, 9, 9, 9, 9, 9, 9, 9, 10],
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
    ];

    const fila = Math.min(Math.max(0, silla - 1), tabla.length - 1);
    const columna = Math.min(Math.max(0, pantallaPerifericos - 1), tabla[0].length - 1);
    
    return tabla[fila][columna];
  };

  const getNivelRiesgo = (puntuacion) => {
    if (puntuacion <= 2) return 'BAJO';
    if (puntuacion <= 4) return 'MEDIO';
    if (puntuacion <= 7) return 'ALTO';
    return 'MUY ALTO';
  };

  const getColorRiesgo = (nivel) => {
    switch (nivel) {
      case 'BAJO': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'MEDIO': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'ALTO': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
      case 'MUY ALTO': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecomendaciones = (puntuacion, datos) => {
    const recomendacionesBase = [];

    // Recomendaciones según nivel de riesgo
    if (puntuacion <= 2) {
      recomendacionesBase.push({
        categoria: 'Mantenimiento',
        items: [
          'El puesto presenta un riesgo bajo. Mantener las condiciones actuales.',
          'Realizar revisiones periódicas cada 6 meses.',
          'Fomentar las pausas activas cada 2 horas.'
        ]
      });
    } else if (puntuacion <= 4) {
      recomendacionesBase.push({
        categoria: 'Mejoras Menores',
        items: [
          'Realizar ajustes menores en el puesto de trabajo.',
          'Capacitar al trabajador en ergonomía básica.',
          'Implementar pausas activas cada hora.',
          'Revisar el puesto en 3 meses.'
        ]
      });
    } else if (puntuacion <= 7) {
      recomendacionesBase.push({
        categoria: 'Intervención Necesaria',
        items: [
          'Se requieren cambios significativos en el puesto.',
          'Evaluar la adquisición de nuevo mobiliario ergonómico.',
          'Capacitación intensiva en ergonomía.',
          'Pausas activas cada 30-45 minutos.',
          'Seguimiento mensual del puesto.'
        ]
      });
    } else {
      recomendacionesBase.push({
        categoria: 'Intervención Urgente',
        items: [
          'ACCIÓN INMEDIATA: El puesto presenta riesgo muy alto.',
          'Rediseño completo del puesto de trabajo.',
          'Reemplazo inmediato de mobiliario inadecuado.',
          'Rotación de tareas si es posible.',
          'Seguimiento semanal hasta mejoras significativas.',
          'Considerar evaluación médica ocupacional.'
        ]
      });
    }

    // Recomendaciones específicas por componente
    const puntuacionSilla = datos.evaluacionSilla?.puntuaciones?.puntuacionSilla || 0;
    const puntuacionPantalla = datos.evaluacionPantallaPerifericos?.puntuaciones?.puntuacionPantallaPerifericos || 0;

    if (puntuacionSilla > 5) {
      recomendacionesBase.push({
        categoria: 'Silla de Trabajo',
        items: [
          'Ajustar la altura del asiento para lograr ángulo de 90° en rodillas.',
          'Verificar que los pies apoyen completamente en el suelo.',
          'Ajustar reposabrazos a la altura de los codos.',
          'Configurar el respaldo para soporte lumbar adecuado.',
          'Considerar adquisición de silla ergonómica certificada.'
        ]
      });
    }

    if (puntuacionPantalla > 5) {
      recomendacionesBase.push({
        categoria: 'Pantalla y Periféricos',
        items: [
          'Posicionar la pantalla a distancia de brazo extendido (50-70 cm).',
          'Ajustar la altura para que el borde superior esté a nivel de ojos.',
          'Utilizar soporte para documentos a la misma altura que la pantalla.',
          'Colocar mouse y teclado a la misma altura.',
          'Considerar uso de auriculares si usa teléfono frecuentemente.',
          'Verificar iluminación para evitar reflejos en pantalla.'
        ]
      });
    }

    // Recomendaciones generales
    recomendacionesBase.push({
      categoria: 'Recomendaciones Generales',
      items: [
        'Realizar ejercicios de estiramiento cervical y lumbar.',
        'Parpadear frecuentemente para mantener humedad ocular.',
        'Mantener una postura neutra de muñecas al escribir.',
        'Alternar entre estar sentado y de pie si es posible.',
        'Mantener los objetos de uso frecuente al alcance de las manos.'
      ]
    });

    return recomendacionesBase;
  };

  const generarPDF = () => {
    generarInformePDF(datosEvaluacion, puntuacionFinal, nivelRiesgo, recomendaciones);
  };

  const descargarHTML = () => {
    descargarInformeHTML(datosEvaluacion, puntuacionFinal, nivelRiesgo, recomendaciones);
  };

  if (!datosEvaluacion?.evaluacionSilla || !datosEvaluacion?.evaluacionPantallaPerifericos) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Error: Datos incompletos para generar resultados finales
          </h2>
          <button
            onClick={onVolver}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  const puntuacionSilla = datosEvaluacion.evaluacionSilla.puntuaciones?.puntuacionSilla || 0;
  const puntuacionPantallaPerifericos = datosEvaluacion.evaluacionPantallaPerifericos.puntuaciones?.puntuacionPantallaPerifericos || 0;

  // Tabla E para mostrar
  const tablaE = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [2, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [3, 3, 3, 4, 5, 6, 7, 8, 9, 10],
    [4, 4, 4, 4, 5, 6, 7, 8, 9, 10],
    [5, 5, 5, 5, 5, 6, 7, 8, 9, 10],
    [6, 6, 6, 6, 6, 6, 7, 8, 9, 10],
    [7, 7, 7, 7, 7, 7, 7, 8, 9, 10],
    [8, 8, 8, 8, 8, 8, 8, 8, 9, 10],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
  ];

  const filaSeleccionada = Math.min(Math.max(0, puntuacionSilla - 1), tablaE.length - 1);
  const columnaSeleccionada = Math.min(Math.max(0, puntuacionPantallaPerifericos - 1), tablaE[0].length - 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-orange-500 px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Resultados Finales ROSA</h1>
            <p className="text-green-100 mt-1 text-sm sm:text-base">Evaluación ergonómica completa del puesto de trabajo</p>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Información del puesto */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base">
                Puesto: {datosEvaluacion?.identificadorPuesto}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Trabajador: {datosEvaluacion?.nombreTrabajador}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Empresa: {datosEvaluacion?.empresa}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Evaluado por: {datosEvaluacion?.nombreEvaluador} | Fecha: {datosEvaluacion?.fechaEvaluacion}
              </p>
            </div>

            {/* Resultado Final Grande */}
            <div className={`p-6 sm:p-8 rounded-xl text-center ${getColorRiesgo(nivelRiesgo)}`}>
              <h2 className="text-xl sm:text-3xl font-bold mb-4">PUNTUACIÓN ROSA FINAL</h2>
              <div className="text-4xl sm:text-6xl font-bold mb-4">{puntuacionFinal}</div>
              <div className="text-lg sm:text-2xl font-semibold mb-2">NIVEL DE RIESGO: {nivelRiesgo}</div>
              <p className="text-sm sm:text-lg">
                {nivelRiesgo === 'BAJO' && 'Riesgo aceptable. Mantener condiciones actuales.'}
                {nivelRiesgo === 'MEDIO' && 'Riesgo moderado. Se recomiendan mejoras.'}
                {nivelRiesgo === 'ALTO' && 'Riesgo elevado. Se requieren cambios significativos.'}
                {nivelRiesgo === 'MUY ALTO' && 'Riesgo crítico. Acción inmediata necesaria.'}
              </p>
            </div>

            {/* Resumen de componentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-green-50 dark:bg-green-900 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-300 mb-4">🪑 Evaluación de la Silla</h3>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{puntuacionSilla}</div>
                  <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 mt-2">
                    Incluye: altura, profundidad, reposabrazos, respaldo y tiempo de uso
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">🖥️ Pantalla y Periféricos</h3>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{puntuacionPantallaPerifericos}</div>
                  <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 mt-2">
                    Incluye: monitor, teclado, mouse, teléfono y tiempos de uso
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla E - Siempre visible */}
            <div className="bg-blue-50 dark:bg-blue-900 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 text-center">
                📊 Tabla E - Combinación Final ROSA
              </h3>

              {/* Explicación del cálculo */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
                    <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-green-700 dark:text-green-300 font-medium">
                      🪑 Silla: {puntuacionSilla}
                    </span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-orange-100 dark:bg-orange-800 px-2 py-1 rounded text-orange-700 dark:text-orange-300 font-medium">
                      🖥️ Pantalla: {puntuacionPantallaPerifericos}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    = ROSA: {puntuacionFinal}
                  </div>
                </div>
              </div>

              {/* Tabla completa - Siempre visible */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <table className="w-full border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">Silla</th>
                        <th colSpan="10" className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold text-xs">
                          Puntuación Pantalla y Periféricos
                        </th>
                      </tr>
                      <tr>
                        <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs"></th>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(valor => (
                          <th
                            key={valor}
                            className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                              valor === puntuacionPantallaPerifericos ? 'bg-blue-200 dark:bg-blue-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                            }`}
                          >
                            {valor}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tablaE.map((fila, filaIndex) => (
                        <tr key={filaIndex}>
                          <th
                            className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                              (filaIndex + 1) === puntuacionSilla ? 'bg-green-200 dark:bg-green-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                            }`}
                          >
                            {filaIndex + 1}
                          </th>
                          {fila.map((valor, colIndex) => (
                            <td
                              key={colIndex}
                              className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs font-medium ${
                                filaIndex === filaSeleccionada && colIndex === columnaSeleccionada
                                  ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold animate-pulse'
                                  : filaIndex === filaSeleccionada
                                  ? 'bg-green-100 dark:bg-green-900'
                                  : colIndex === columnaSeleccionada
                                  ? 'bg-blue-100 dark:bg-blue-900'
                                  : 'bg-white dark:bg-gray-800'
                              }`}
                            >
                              {valor}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">💡 Recomendaciones</h3>
              {recomendaciones.map((categoria, index) => (
                <div key={index} className="bg-yellow-50 dark:bg-yellow-900 p-4 sm:p-6 rounded-lg">
                  <h4 className="text-base sm:text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
                    {categoria.categoria}
                  </h4>
                  <ul className="space-y-2">
                    {categoria.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-yellow-700 dark:text-yellow-200 flex items-start text-sm sm:text-base">
                        <span className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              {/* Fila 1: Botones de navegación */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onVolver}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  ← Volver a Modificar
                </button>
                
                <button
                  onClick={onVolverInicio}
                  className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:from-green-600 hover:to-orange-600 transition-all duration-300 text-sm sm:text-base"
                >
                  🔄 Nueva Evaluación
                </button>
              </div>

              {/* Fila 2: Botones de descarga */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={generarPDF}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm sm:text-base flex-1"
                >
                  📄 Imprimir Informe PDF
                </button>

                <button
                  onClick={descargarHTML}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm sm:text-base flex-1"
                >
                  💾 Descargar Informe HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosFinales;