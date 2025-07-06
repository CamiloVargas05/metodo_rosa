'use client';

import React from 'react';

const ResultadoTablaB = ({ onContinuar, onVolver, datosEvaluacion }) => {
  // Debug y validación
  console.log('ResultadoTablaB - datos recibidos:', datosEvaluacion);

  if (!datosEvaluacion?.evaluacionPantallaPerifericos) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Error: No hay datos de evaluación de pantalla y periféricos
          </h2>
          <button
            onClick={onVolver}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            ← Volver a Evaluación
          </button>
        </div>
      </div>
    );
  }

  const { evaluacionPantallaPerifericos, ...formData } = datosEvaluacion;
  const puntuaciones = evaluacionPantallaPerifericos.puntuaciones || {};

  // Tablas para mostrar
  const tablaB = [
    [1, 1, 1, 2, 3, 4, 5, 6],
    [1, 1, 2, 2, 3, 4, 5, 6],
    [1, 2, 2, 3, 3, 4, 6, 7],
    [2, 2, 3, 3, 4, 5, 6, 8],
    [3, 3, 4, 4, 5, 6, 7, 8],
    [4, 4, 5, 5, 6, 7, 8, 9],
    [5, 5, 6, 7, 8, 8, 9, 9]
  ];

  const tablaC = [
    [1, 1, 1, 2, 3, 4, 5, 6],
    [1, 1, 2, 3, 4, 5, 6, 7],
    [1, 2, 2, 3, 4, 5, 6, 7],
    [2, 3, 3, 3, 5, 6, 7, 8],
    [3, 4, 4, 5, 5, 6, 7, 8],
    [4, 5, 5, 6, 6, 7, 8, 9],
    [5, 6, 6, 7, 7, 8, 8, 9],
    [6, 7, 7, 8, 8, 9, 9, 9]
  ];

  const tablaD = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [2, 2, 3, 4, 5, 6, 7, 8, 9],
    [3, 3, 3, 4, 5, 6, 7, 8, 9],
    [4, 4, 4, 4, 5, 6, 7, 8, 9],
    [5, 5, 5, 5, 5, 6, 7, 8, 9],
    [6, 6, 6, 6, 6, 6, 7, 8, 9],
    [7, 7, 7, 7, 7, 7, 7, 8, 9],
    [8, 8, 8, 8, 8, 8, 8, 8, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9]
  ];

  // Posiciones seleccionadas en las tablas
  const filaTablaB = Math.min(puntuaciones.puntuacionTelefono || 0, tablaB.length - 1);
  const columnaTablaB = Math.min(puntuaciones.puntuacionPantalla || 0, tablaB[0].length - 1);

  const filaTablaC = Math.min(puntuaciones.puntuacionMouse || 0, tablaC.length - 1);
  const columnaTablaC = Math.min(puntuaciones.puntuacionTeclado || 0, tablaC[0].length - 1);

  const filaTablaD = Math.min(Math.max(0, (puntuaciones.tablaB || 0) - 1), tablaD.length - 1);
  const columnaTablaD = Math.min(Math.max(0, (puntuaciones.tablaC || 0) - 1), tablaD[0].length - 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-green-500 px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Resultado Pantalla y Periféricos - Tablas B, C y D</h1>
            <p className="text-orange-100 mt-1 text-sm sm:text-base">Cálculo de las puntuaciones según el método ROSA</p>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Información del puesto */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base">Puesto: {formData?.identificadorPuesto}</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Trabajador: {formData?.nombreTrabajador}</p>
            </div>

            {/* Resumen de puntuaciones individuales */}
            <div className="bg-orange-50 dark:bg-orange-900 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">Resumen de Evaluación</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{puntuaciones.puntuacionPantalla || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pantalla</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{puntuaciones.puntuacionTelefono || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Teléfono</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{puntuaciones.puntuacionMouse || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Mouse</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{puntuaciones.puntuacionTeclado || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Teclado</div>
                </div>
              </div>
            </div>

            {/* Tabla B - Pantalla + Teléfono */}
            <div className="bg-blue-50 dark:bg-blue-900 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 text-center">Tabla B - Pantalla + Teléfono</h3>

              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg mb-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
                    <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-medium">
                      Pantalla: {puntuaciones.puntuacionPantalla || 0}
                    </span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-medium">
                      Teléfono: {puntuaciones.puntuacionTelefono || 0}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                    = Tabla B: {puntuaciones.tablaB || 0}
                  </div>
                </div>
              </div>

              <div className="min-w-full">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">B</th>
                      <th colSpan="8" className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold text-xs">
                        Puntuación Pantalla
                      </th>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">Puntuación Teléfono</th>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map(valor => (
                        <th
                          key={valor}
                          className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                            valor === (puntuaciones.puntuacionPantalla || 0) ? 'bg-blue-200 dark:bg-blue-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {valor}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tablaB.map((fila, filaIndex) => (
                      <tr key={filaIndex}>
                        <th
                          className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                            filaIndex === filaTablaB ? 'bg-blue-200 dark:bg-blue-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {filaIndex}
                        </th>
                        {fila.map((valor, colIndex) => (
                          <td
                            key={colIndex}
                            className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs font-medium ${
                              filaIndex === filaTablaB && colIndex === columnaTablaB
                                ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold'
                                : filaIndex === filaTablaB
                                ? 'bg-blue-100 dark:bg-blue-900'
                                : colIndex === columnaTablaB
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

            {/* Tabla C - Mouse + Teclado */}
            <div className="bg-purple-50 dark:bg-purple-900 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 text-center">Tabla C - Mouse + Teclado</h3>

              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg mb-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
                    <span className="bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded text-purple-700 dark:text-purple-300 font-medium">
                      Mouse: {puntuaciones.puntuacionMouse || 0}
                    </span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded text-purple-700 dark:text-purple-300 font-medium">
                      Teclado: {puntuaciones.puntuacionTeclado || 0}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                    = Tabla C: {puntuaciones.tablaC || 0}
                  </div>
                </div>
              </div>

              <div className="min-w-full">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">C</th>
                      <th colSpan="8" className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-semibold text-xs">
                        Puntuación Teclado
                      </th>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">Puntuación Mouse</th>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map(valor => (
                        <th
                          key={valor}
                          className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                            valor === (puntuaciones.puntuacionTeclado || 0) ? 'bg-purple-200 dark:bg-purple-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {valor}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tablaC.map((fila, filaIndex) => (
                      <tr key={filaIndex}>
                        <th
                          className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                            filaIndex === filaTablaC ? 'bg-purple-200 dark:bg-purple-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {filaIndex}
                        </th>
                        {fila.map((valor, colIndex) => (
                          <td
                            key={colIndex}
                            className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs font-medium ${
                              filaIndex === filaTablaC && colIndex === columnaTablaC
                                ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold'
                                : filaIndex === filaTablaC
                                ? 'bg-purple-100 dark:bg-purple-900'
                                : colIndex === columnaTablaC
                                ? 'bg-purple-100 dark:bg-purple-900'
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

            {/* Tabla D - Resultado Final */}
            <div className="bg-green-50 dark:bg-green-900 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-300 mb-4 text-center">Tabla D - Pantalla y Periféricos Final</h3>

              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg mb-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
                    <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-green-700 dark:text-green-300 font-medium">
                      Tabla B: {puntuaciones.tablaB || 0}
                    </span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-green-700 dark:text-green-300 font-medium">
                      Tabla C: {puntuaciones.tablaC || 0}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                    = Tabla D: {puntuaciones.puntuacionPantallaPerifericos || 0}
                  </div>
                </div>
              </div>

              <div className="min-w-full">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">D</th>
                      <th colSpan="9" className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold text-xs">
                        Tabla C
                      </th>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">Tabla B</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(valor => (
                        <th
                          key={valor}
                          className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                            valor === (puntuaciones.tablaC || 0) ? 'bg-green-200 dark:bg-green-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {valor}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tablaD.map((fila, filaIndex) => (
                      <tr key={filaIndex}>
                        <th
                          className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                            (filaIndex + 1) === (puntuaciones.tablaB || 0) ? 'bg-green-200 dark:bg-green-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {filaIndex + 1}
                        </th>
                        {fila.map((valor, colIndex) => (
                          <td
                            key={colIndex}
                            className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs font-medium ${
                              filaIndex === filaTablaD && colIndex === columnaTablaD
                                ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold animate-pulse'
                                : filaIndex === filaTablaD
                                ? 'bg-green-100 dark:bg-green-900'
                                : colIndex === columnaTablaD
                                ? 'bg-green-100 dark:bg-green-900'
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

            {/* Puntuación final de pantalla y periféricos */}
            <div className="bg-gradient-to-r from-orange-500 to-green-500 p-4 sm:p-6 rounded-lg text-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Puntuación Final de Pantalla y Periféricos</h3>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-white text-orange-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
                  {puntuaciones.puntuacionPantallaPerifericos || 0}
                </div>
                <p className="mt-2 text-orange-100 text-sm sm:text-base">Esta puntuación se combinará con la puntuación de la silla para obtener el resultado final ROSA</p>
              </div>
            </div>

            {/* Navegación */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onVolver}
                className="px-4 sm:px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base"
              >
                ← Volver a Modificar Evaluación
              </button>

              <button
                onClick={() => onContinuar(datosEvaluacion)}
                className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 sm:px-8 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-green-600 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg text-sm sm:text-base"
              >
                Ver Resultados Finales ROSA →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoTablaB;