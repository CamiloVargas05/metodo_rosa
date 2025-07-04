'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const EvaluacionSilla = ({ onNext, onBack, formData }) => {
  const [sillaData, setSillaData] = useState({
    alturaAsiento: {
      puntuacion: null,
      incrementos: []
    },
    profundidadAsiento: {
      puntuacion: null,
      incrementos: []
    },
    reposabrazos: {
      puntuacion: null,
      incrementos: []
    },
    respaldo: {
      puntuacion: null,
      incrementos: []
    },
    tiempoUso: null // null = no seleccionado
  });

  const [puntuaciones, setPuntuaciones] = useState({
    tablaA: 0,
    puntuacionSilla: 0
  });

  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Calcular puntuaciones automáticamente (con optimización)
  useEffect(() => {
    const timer = setTimeout(() => {
      calcularPuntuaciones();
    }, 10); // Pequeño delay para evitar múltiples cálculos
    
    return () => clearTimeout(timer);
  }, [sillaData]);

  const calcularPuntuaciones = () => {
    // Calcular puntuaciones individuales (incluso si no están todos completos)
    const alturaTotal = sillaData.alturaAsiento.puntuacion !== null ? 
      sillaData.alturaAsiento.puntuacion + sillaData.alturaAsiento.incrementos.length : 0;
    const profundidadTotal = sillaData.profundidadAsiento.puntuacion !== null ? 
      sillaData.profundidadAsiento.puntuacion + sillaData.profundidadAsiento.incrementos.length : 0;
    const reposabrazosTotal = sillaData.reposabrazos.puntuacion !== null ? 
      sillaData.reposabrazos.puntuacion + sillaData.reposabrazos.incrementos.length : 0;
    const respaldoTotal = sillaData.respaldo.puntuacion !== null ? 
      sillaData.respaldo.puntuacion + sillaData.respaldo.incrementos.length : 0;

    // Solo calcular tabla A y puntuación final si todos los campos están seleccionados
    if (sillaData.alturaAsiento.puntuacion === null || 
        sillaData.profundidadAsiento.puntuacion === null || 
        sillaData.reposabrazos.puntuacion === null || 
        sillaData.respaldo.puntuacion === null || 
        sillaData.tiempoUso === null) {
      setPuntuaciones({
        tablaA: 0,
        puntuacionSilla: 0,
        // Mostrar puntuaciones individuales
        alturaTotal,
        profundidadTotal,
        reposabrazosTotal,
        respaldoTotal
      });
      return;
    }

    // Suma para Tabla A
    const sumaAlturaProf = alturaTotal + profundidadTotal;
    const sumaReposResp = reposabrazosTotal + respaldoTotal;

    // Tabla A
    const tablaA = obtenerTablaA(sumaAlturaProf, sumaReposResp);
    
    // Puntuación final de la silla (Tabla A + tiempo de uso)
    const puntuacionSilla = tablaA + sillaData.tiempoUso;

    setPuntuaciones({
      tablaA,
      puntuacionSilla: Math.max(1, puntuacionSilla),
      alturaTotal,
      profundidadTotal,
      reposabrazosTotal,
      respaldoTotal
    });
  };

  const obtenerTablaA = (alturaProf, reposResp) => {
    // Implementación simplificada de la Tabla A del método ROSA
    const tabla = [
      [2, 2, 3, 4, 5, 6, 7, 8],
      [2, 2, 3, 4, 5, 6, 7, 8],
      [3, 3, 3, 4, 5, 6, 7, 8],
      [4, 4, 4, 4, 5, 6, 7, 8],
      [5, 5, 5, 5, 6, 7, 8, 9],
      [6, 6, 6, 7, 7, 8, 8, 9],
      [7, 7, 7, 8, 8, 9, 9, 9]
    ];

    const fila = Math.min(alturaProf - 2, tabla.length - 1);
    const columna = Math.min(reposResp - 2, tabla[0].length - 1);
    
    return tabla[Math.max(0, fila)][Math.max(0, columna)];
  };

  const handleSeleccionOpcion = (elemento, puntuacion, incrementos = []) => {
    // Guardar posición actual del scroll
    const scrollPosition = window.scrollY;
    
    setSillaData(prev => ({
      ...prev,
      [elemento]: {
        puntuacion,
        incrementos
      }
    }));
    
    // Restaurar posición del scroll después del re-render
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  const handleTiempoUso = (tiempo) => {
    // Guardar posición actual del scroll
    const scrollPosition = window.scrollY;
    
    setSillaData(prev => ({
      ...prev,
      tiempoUso: tiempo
    }));
    
    // Restaurar posición del scroll después del re-render
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  const handleContinuar = () => {
    // Validar que todos los campos estén seleccionados
    if (sillaData.alturaAsiento.puntuacion === null || 
        sillaData.profundidadAsiento.puntuacion === null || 
        sillaData.reposabrazos.puntuacion === null || 
        sillaData.respaldo.puntuacion === null || 
        sillaData.tiempoUso === null) {
      alert('Por favor, complete todas las evaluaciones antes de continuar.');
      return;
    }

    const datosCompletos = {
      ...formData,
      evaluacionSilla: {
        ...sillaData,
        puntuaciones
      }
    };

    if (onNext) {
      onNext(datosCompletos);
    }
  };

  const toggleResultados = () => {
    setMostrarResultados(!mostrarResultados);
  };

  // Componente para mostrar opciones con imágenes
  const OpcionEvaluacion = ({ titulo, elemento, opciones }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">{titulo}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opciones.map((opcion, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSeleccionOpcion(elemento, opcion.puntuacion, opcion.incrementos || []);
            }}
            className={`p-4 border-2 rounded-lg transition-all duration-200 ${
              sillaData[elemento].puntuacion === opcion.puntuacion &&
              JSON.stringify(sillaData[elemento].incrementos) === JSON.stringify(opcion.incrementos || [])
                ? 'border-green-500 bg-green-50 dark:bg-green-900'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
            }`}
          >
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden">
              {/* Aquí irán las imágenes */}
                  {opcion.imagen ? (
                <Image
                  src={opcion.imagen}
                  alt={opcion.descripcion}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    // Fallback si la imagen no se encuentra
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ display: opcion.imagen ? 'none' : 'flex' }}
              >
                {opcion.icono || 'IMG'}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{opcion.descripcion}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Puntuación: {opcion.puntuacion + (opcion.incrementos?.length || 0)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  const opcionesAlturaAsiento = [
    { puntuacion: 1, 
      descripcion: "Rodillas dobladas en torno a los 90 grados.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación de la altura del asiento/postura-neutra.png", 
    },
    { puntuacion: 2, 
      descripcion: "Asiento a una altura baja. Rodillas flexionadas en un ángulo menor a 90 grados.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación de la altura del asiento/postura-desviacion.png", 
    },
    { puntuacion: 2, 
      descripcion: "Asiento a una altura elevada. Rodillas en un ángulo mayor a 90 grados.", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuación de la altura del asiento/espacio-insuficiente.png",
    },
    { puntuacion: 1, 
      descripcion: "Los pies no tienen apoyo sobre el suelo.", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuación de la altura del asiento/altura-no-regulable.png",

    }
  ];

  const opcionesProfundidadAsiento = [
    { puntuacion: 1,
      descripcion: "Profundidad adecuada",
      incrementos: [] },
    { puntuacion: 2, 
      descripcion: "Profundidad inadecuada", 
      incrementos: [] 
    },
    { puntuacion: 1, 
      descripcion: "Adecuada + no regulable", 
      incrementos: ["+1"] 
    }
  ];

  const opcionesReposabrazos = [
    { puntuacion: 1, 
      descripcion: "Altura y posición adecuadas", 
      incrementos: [] 
    },
    { puntuacion: 2, 
      descripcion: "Altura inadecuada", 
      incrementos: [] 
    },
    { puntuacion: 1, 
      descripcion: "Adecuados + no regulables", 
      incrementos: ["+1"] 
    },
    { puntuacion: 2, 
      descripcion: "Muy altos o interfieren", incrementos: ["+1"] 
    }
  ];

  const opcionesRespaldo = [
    { puntuacion: 1, descripcion: "Respaldo adecuado con soporte lumbar", incrementos: [] },
    { puntuacion: 2, descripcion: "Sin soporte lumbar adecuado", incrementos: [] },
    { puntuacion: 1, descripcion: "Adecuado + no regulable", incrementos: ["+1"] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-orange-500 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Evaluación de la Silla</h1>
            <p className="text-green-100 mt-1">Evaluación ergonómica de los elementos de la silla de trabajo</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Información del puesto */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Puesto: {formData?.identificadorPuesto}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trabajador: {formData?.nombreTrabajador}</p>
            </div>

            {/* Puntuación actual - área fija para evitar saltos */}
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg min-h-[120px]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-800 dark:text-green-200">Puntuación Actual de la Silla</h3>
                {(puntuaciones.alturaTotal > 0 || puntuaciones.profundidadTotal > 0 || 
                  puntuaciones.reposabrazosTotal > 0 || puntuaciones.respaldoTotal > 0) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMostrarResultados(!mostrarResultados);
                    }}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    {mostrarResultados ? 'Ocultar' : 'Ver'} Detalles
                  </button>
                )}
              </div>
              
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">
                Puntuación: {puntuaciones.puntuacionSilla || '-'}
              </div>
              
              {/* Mostrar puntajes individuales solo si mostrarResultados está activo */}
              {mostrarResultados && (puntuaciones.alturaTotal > 0 || puntuaciones.profundidadTotal > 0 || 
                puntuaciones.reposabrazosTotal > 0 || puntuaciones.respaldoTotal > 0) && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Altura: {puntuaciones.alturaTotal || '-'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Profundidad: {puntuaciones.profundidadTotal || '-'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Reposabrazos: {puntuaciones.reposabrazosTotal || '-'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Respaldo: {puntuaciones.respaldoTotal || '-'}</p>
                  </div>
                  {puntuaciones.tablaA > 0 && (
                    <>
                      <div className="col-span-2">
                        <p className="font-medium">Tabla A: {puntuaciones.tablaA}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium">Tiempo uso: {sillaData.tiempoUso !== null ? (sillaData.tiempoUso > 0 ? '+1' : sillaData.tiempoUso < 0 ? '-1' : '0') : '-'}</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Evaluaciones */}
            <OpcionEvaluacion 
              titulo="Altura del Asiento"
              elemento="alturaAsiento"
              opciones={opcionesAlturaAsiento}
            />

            <OpcionEvaluacion 
              titulo="Profundidad del Asiento"
              elemento="profundidadAsiento"
              opciones={opcionesProfundidadAsiento}
            />

            <OpcionEvaluacion 
              titulo="Reposabrazos"
              elemento="reposabrazos"
              opciones={opcionesReposabrazos}
            />

            <OpcionEvaluacion 
              titulo="Respaldo"
              elemento="respaldo"
              opciones={opcionesRespaldo}
            />

            {/* Tiempo de uso */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300">Tiempo de Uso de la Silla</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { valor: -1, descripcion: "Menos de 1 hora total o menos de 30 min continuos", color: "green" },
                  { valor: 0, descripcion: "Entre 1 y 4 horas total o entre 30 min y 1 hora continua", color: "yellow" },
                  { valor: 1, descripcion: "Más de 4 horas o más de 1 hora continua", color: "red" }
                ].map((opcion) => (
                  <button
                    key={opcion.valor}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTiempoUso(opcion.valor);
                    }}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      sillaData.tiempoUso === opcion.valor
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'
                    }`}
                  >
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-white ${
                      opcion.color === 'green' ? 'bg-green-500' :
                      opcion.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {opcion.valor > 0 ? '+1' : opcion.valor < 0 ? '-1' : '0'}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{opcion.descripcion}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Navegación */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                ← Volver al Formulario
              </button>
              
              <button
                onClick={handleContinuar}
                className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-orange-600 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg"
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

export default EvaluacionSilla;