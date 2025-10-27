'use client';


const ResultadoTablaA = ({ onContinuar, onVolver, datosEvaluacion }) => {
  // Debug: ver qué datos están llegando
  console.log('datosEvaluacion recibidos:', datosEvaluacion);
  console.log('evaluacionSilla completo:', datosEvaluacion?.evaluacionSilla);
  
  // Validar que los datos existan
  if (!datosEvaluacion?.evaluacionSilla) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Error: No hay datos de evaluación de silla
          </h2>
          <button 
            onClick={onVolver}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            ← Volver a Evaluación
          </button>
        </div>
      </div>
    );
  }

  const { evaluacionSilla, ...formData } = datosEvaluacion;
  
  // Acceder directamente a los datos de la silla desde evaluacionSilla
  const sillaData = evaluacionSilla;
  const puntuaciones = evaluacionSilla.puntuaciones || {};

  // Reconstruir los cálculos para mostrar con validaciones
  // Los opcionales ahora son objetos {id, valor}, hay que sumar sus valores
  const incrementosAltura = (sillaData?.alturaAsiento?.opcionalesSeleccionadas || []).reduce((sum, opt) => sum + opt.valor, 0);
  const incrementosProf = (sillaData?.profundidadAsiento?.opcionalesSeleccionadas || []).reduce((sum, opt) => sum + opt.valor, 0);
  const incrementosRepos = (sillaData?.reposabrazos?.opcionalesSeleccionadas || []).reduce((sum, opt) => sum + opt.valor, 0);
  const incrementosResp = (sillaData?.respaldo?.opcionalesSeleccionadas || []).reduce((sum, opt) => sum + opt.valor, 0);

  const alturaTotal = (sillaData?.alturaAsiento?.puntuacion || 0) + incrementosAltura;
  const profundidadTotal = (sillaData?.profundidadAsiento?.puntuacion || 0) + incrementosProf;
  const reposabrazosTotal = (sillaData?.reposabrazos?.puntuacion || 0) + incrementosRepos;
  const respaldoTotal = (sillaData?.respaldo?.puntuacion || 0) + incrementosResp;

  // Debug: verificar cálculos
  console.log('Cálculos:', {
    altura: { puntuacion: sillaData?.alturaAsiento?.puntuacion, opcionales: incrementosAltura, total: alturaTotal },
    profundidad: { puntuacion: sillaData?.profundidadAsiento?.puntuacion, opcionales: incrementosProf, total: profundidadTotal },
    reposabrazos: { puntuacion: sillaData?.reposabrazos?.puntuacion, opcionales: incrementosRepos, total: reposabrazosTotal },
    respaldo: { puntuacion: sillaData?.respaldo?.puntuacion, opcionales: incrementosResp, total: respaldoTotal }
  });

  const sumaAlturaProf = alturaTotal + profundidadTotal;
  const sumaReposResp = reposabrazosTotal + respaldoTotal;

  // Tabla A completa para mostrar
  const tablaA = [
    [2, 2, 3, 4, 5, 6, 7, 8],
    [2, 2, 3, 4, 5, 6, 7, 8],
    [3, 3, 3, 4, 5, 6, 7, 8],
    [4, 4, 4, 4, 5, 6, 7, 8],
    [5, 5, 5, 5, 6, 7, 8, 9],
    [6, 6, 6, 7, 7, 8, 8, 9],
    [7, 7, 7, 8, 8, 9, 9, 9]
  ];

  const filaSeleccionada = Math.min(Math.max(0, sumaAlturaProf - 2), tablaA.length - 1);
  const columnaSeleccionada = Math.min(Math.max(0, sumaReposResp - 2), tablaA[0].length - 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-orange-500 px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Resultado Evaluación de la Silla - Tabla A</h1>
            <p className="text-green-100 mt-1 text-sm sm:text-base">Cálculo de la puntuación según el método ROSA</p>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Información del puesto */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base">Puesto: {formData?.identificadorPuesto}</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Trabajador: {formData?.nombreTrabajador}</p>
            </div>

            {/* Resumen de puntuaciones individuales */}
            <div className="bg-green-50 dark:bg-green-900 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-300 mb-4">Resumen de Evaluación</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{alturaTotal}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Altura Asiento</div>
                  {incrementosAltura > 0 && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      ({sillaData?.alturaAsiento?.puntuacion} + {incrementosAltura})
                    </div>
                  )}
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{profundidadTotal}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Profundidad</div>
                  {incrementosProf > 0 && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      ({sillaData?.profundidadAsiento?.puntuacion} + {incrementosProf})
                    </div>
                  )}
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{reposabrazosTotal}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Reposabrazos</div>
                  {incrementosRepos > 0 && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      ({sillaData?.reposabrazos?.puntuacion} + {incrementosRepos})
                    </div>
                  )}
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{respaldoTotal}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Respaldo</div>
                  {incrementosResp > 0 && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      ({sillaData?.respaldo?.puntuacion} + {incrementosResp})
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cálculo para Tabla A */}
            <div className="bg-orange-50 dark:bg-orange-900 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">Cálculo para Tabla A</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-300">
                  <div className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Altura + Profundidad</div>
                  <div className="text-xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{alturaTotal} + {profundidadTotal} = {sumaAlturaProf}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-300">
                  <div className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Reposabrazos + Respaldo</div>
                  <div className="text-xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{reposabrazosTotal} + {respaldoTotal} = {sumaReposResp}</div>
                </div>
              </div>
            </div>

            {/* Tabla A Visual */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">📊 Tabla A - Combinación Silla</h3>
              
              {/* Explicación del cálculo */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg mb-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
                    <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-green-700 dark:text-green-300 font-medium">
                      🪑 Alt+Prof: {sumaAlturaProf}
                    </span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-orange-100 dark:bg-orange-800 px-2 py-1 rounded text-orange-700 dark:text-orange-300 font-medium">
                      🛠️ Rep+Resp: {sumaReposResp}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-400">
                    = Tabla A: {puntuaciones?.tablaA || 0}
                  </div>
                </div>
              </div>
              
              <div className="min-w-full">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">A</th>
                      <th colSpan="8" className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 font-semibold text-xs">
                        Reposabrazos + Respaldo
                      </th>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-xs">Altura + Profundidad</th>
                      {[2, 3, 4, 5, 6, 7, 8, 9].map(valor => (
                        <th 
                          key={valor} 
                          className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                            valor === sumaReposResp ? 'bg-orange-200 dark:bg-orange-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {valor}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tablaA.map((fila, filaIndex) => (
                      <tr key={filaIndex}>
                        <th 
                          className={`border border-gray-300 dark:border-gray-600 p-1 text-center text-xs ${
                            filaIndex === filaSeleccionada ? 'bg-green-200 dark:bg-green-800 font-bold' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          {filaIndex + 2}
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
                                ? 'bg-orange-100 dark:bg-orange-900'
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

              {/* Explicación del resultado */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                <div className="text-center">
                  <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 mb-2">
                    Con <strong>Altura+Profundidad = {sumaAlturaProf}</strong> y <strong>Reposabrazos+Respaldo = {sumaReposResp}</strong>
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-red-700 dark:text-red-300">
                    Tabla A = {puntuaciones?.tablaA || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Puntuación final de la silla */}
            <div className="bg-gradient-to-r from-green-500 to-orange-500 p-4 sm:p-6 rounded-lg text-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Puntuación Final de la Silla</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm sm:text-lg">
                <span>Tabla A: <strong>{puntuaciones?.tablaA || 0}</strong></span>
                <span className="hidden sm:inline">+</span>
                <span>Tiempo uso: <strong>{(sillaData?.tiempoUso || 0) > 0 ? '+1' : (sillaData?.tiempoUso || 0) < 0 ? '-1' : '0'}</strong></span>
                <span className="hidden sm:inline">=</span>
                <span className="text-xl sm:text-2xl font-bold bg-white text-green-600 px-3 sm:px-4 py-1 sm:py-2 rounded-lg">
                  {puntuaciones?.puntuacionSilla || 0}
                </span>
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
                className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-4 sm:px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-orange-600 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg text-sm sm:text-base"
              >
                Continuar con Pantalla y Periféricos →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoTablaA;