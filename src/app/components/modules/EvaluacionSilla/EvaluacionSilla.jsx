'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const EvaluacionSilla = ({ onNext, onBack, formData }) => {
  const [sillaData, setSillaData] = useState({
    alturaAsiento: {
      puntuacion: null,
      incrementos: [],
      opcionSeleccionada: null
    },
    profundidadAsiento: {
      puntuacion: null,
      incrementos: [],
      opcionSeleccionada: null
    },
    reposabrazos: {
      puntuacion: null,
      incrementos: [],
      opcionSeleccionada: null
    },
    respaldo: {
      puntuacion: null,
      incrementos: [],
      opcionSeleccionada: null
    },
    tiempoUso: null
  });

  const [puntuaciones, setPuntuaciones] = useState({
    tablaA: 0,
    puntuacionSilla: 0
  });

  const [mostrarResultados, setMostrarResultados] = useState(false);
  

  const scrollPositionRef = useRef(0);
  const containerRef = useRef(null);


  const calcularPuntuaciones = useCallback(() => {
    const alturaTotal = sillaData.alturaAsiento.puntuacion !== null ? 
      sillaData.alturaAsiento.puntuacion + sillaData.alturaAsiento.incrementos.length : 0;
    const profundidadTotal = sillaData.profundidadAsiento.puntuacion !== null ? 
      sillaData.profundidadAsiento.puntuacion + sillaData.profundidadAsiento.incrementos.length : 0;
    const reposabrazosTotal = sillaData.reposabrazos.puntuacion !== null ? 
      sillaData.reposabrazos.puntuacion + sillaData.reposabrazos.incrementos.length : 0;
    const respaldoTotal = sillaData.respaldo.puntuacion !== null ? 
      sillaData.respaldo.puntuacion + sillaData.respaldo.incrementos.length : 0;

    if (sillaData.alturaAsiento.puntuacion === null || 
        sillaData.profundidadAsiento.puntuacion === null || 
        sillaData.reposabrazos.puntuacion === null || 
        sillaData.respaldo.puntuacion === null || 
        sillaData.tiempoUso === null) {
      setPuntuaciones({
        tablaA: 0,
        puntuacionSilla: 0,
        alturaTotal,
        profundidadTotal,
        reposabrazosTotal,
        respaldoTotal
      });
      return;
    }

    const sumaAlturaProf = alturaTotal + profundidadTotal;
    const sumaReposResp = reposabrazosTotal + respaldoTotal;
    const tablaA = obtenerTablaA(sumaAlturaProf, sumaReposResp);
    const puntuacionSilla = tablaA + sillaData.tiempoUso;

    setPuntuaciones({
      tablaA,
      puntuacionSilla: Math.max(1, puntuacionSilla),
      alturaTotal,
      profundidadTotal,
      reposabrazosTotal,
      respaldoTotal
    });
  }, [sillaData]);

 
  useEffect(() => {
    const timeoutId = setTimeout(calcularPuntuaciones, 50);
    return () => clearTimeout(timeoutId);
  }, [calcularPuntuaciones]);

  const obtenerTablaA = (alturaProf, reposResp) => {
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

 
  const handleSeleccionOpcion = useCallback((elemento, puntuacion, incrementos = [], indiceOpcion, event) => {
    // Prevenir comportamiento por defecto
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    

    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
    
    setSillaData(prev => ({
      ...prev,
      [elemento]: {
        puntuacion,
        incrementos,
        opcionSeleccionada: indiceOpcion
      }
    }));
    
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    });
  }, []);

  const handleTiempoUso = useCallback((tiempo, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
    
    setSillaData(prev => ({
      ...prev,
      tiempoUso: tiempo
    }));
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    });
  }, []);

  const handleContinuar = () => {
    if (sillaData.alturaAsiento.opcionSeleccionada === null || 
        sillaData.profundidadAsiento.opcionSeleccionada === null || 
        sillaData.reposabrazos.opcionSeleccionada === null || 
        sillaData.respaldo.opcionSeleccionada === null || 
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


  const OpcionEvaluacion = React.memo(({ titulo, elemento, opciones }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">{titulo}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opciones.map((opcion, index) => {
          const isSelected = sillaData[elemento].opcionSeleccionada === index;
          
          return (
            <div
              key={`${elemento}-${index}`}
              className={`group relative cursor-pointer border-2 rounded-lg transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={(e) => handleSeleccionOpcion(elemento, opcion.puntuacion, opcion.incrementos || [], index, e)}
            >
              {/* ✅ SOLUCIÓN 6: Contenedor de imagen con altura fija */}
              <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                {opcion.imagen ? (
                  <Image
                    src={opcion.imagen}
                    alt={opcion.descripcion}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 2}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback cuando no hay imagen */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-t-lg flex items-center justify-center text-white"
                  style={{ display: opcion.imagen ? 'none' : 'flex' }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">📋</div>
                    <div className="text-sm font-medium">Sin imagen</div>
                  </div>
                </div>
                
                {/* Badge de puntuación */}
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {opcion.puntuacion + (opcion.incrementos?.length || 0)}
                </div>
                
                {/* Indicador de selección */}
                {isSelected && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* ✅ SOLUCIÓN 7: Contenido con padding fijo */}
              <div className="p-3" style={{ minHeight: '80px' }}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 leading-tight">
                  {opcion.descripcion}
                </p>
                {opcion.incrementos && opcion.incrementos.length > 0 && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    + Incrementos: {opcion.incrementos.join(', ')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ));

  const opcionesAlturaAsiento = [
    { 
      puntuacion: 1, 
      descripcion: "Rodillas dobladas en torno a los 90 grados.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación de la altura del asiento/postura-neutra.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Asiento a una altura baja. Rodillas flexionadas en un ángulo menor a 90 grados.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación de la altura del asiento/postura-desviacion.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Asiento a una altura elevada. Rodillas en un ángulo mayor a 90 grados.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación de la altura del asiento/espacio-insuficiente.png",
    },
    { 
      puntuacion: 2,
      descripcion: "Sin contacto de los pies con el suelo.", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuación de la altura del asiento/altura-no-regulable.png",
    }
  ];

  const opcionesProfundidadAsiento = [
    { 
      puntuacion: 1,
      descripcion: "Profundidad adecuada",
      incrementos: [],
      imagen: "/imgs/img-posturas/puntuacion de la profundidad del asiento/postura2.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Profundidad inadecuada", 
      incrementos: [],
      imagen: "/imgs/img-posturas/puntuacion de la profundidad del asiento/postura1.png", 
    },
    { 
      puntuacion: 1, 
      descripcion: "Adecuada + no regulable", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/puntuacion de la profundidad del asiento/postura4.png",
    }
  ];

  const opcionesReposabrazos = [
    { 
      puntuacion: 1, 
      descripcion: "Altura y posición adecuadas", 
      incrementos: [], 
      imagen: "/imgs/img-posturas/Puntuacion de los reposabrazos/postura4.png",
    },
    { 
      puntuacion: 2, 
      descripcion: "Altura inadecuada", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion de los reposabrazos/postura1.png", 
    },
    { 
      puntuacion: 1, 
      descripcion: "Adecuados + no regulables", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuacion de los reposabrazos/postura2.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Muy altos o interfieren", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuacion de los reposabrazos/postura3.png", 
    }
  ];

  const opcionesRespaldo = [
    { 
      puntuacion: 1, 
      descripcion: "Respaldo adecuado con soporte lumbar", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion del respaldo/postura3.png",
    },
    { 
      puntuacion: 2, 
      descripcion: "Sin soporte lumbar adecuado", 
      incrementos: [], 
      imagen: "/imgs/img-posturas/Puntuacion del respaldo/postura2.png",
    },
    { 
      puntuacion: 1, 
      descripcion: "Adecuado + no regulable", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuacion del respaldo/postura1.png",
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
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

            {/* ✅ SOLUCIÓN 8: Puntuación con altura fija y mejor estructura */}
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-800 dark:text-green-200">Puntuación Actual de la Silla</h3>
                {(puntuaciones.alturaTotal > 0 || puntuaciones.profundidadTotal > 0 || 
                  puntuaciones.reposabrazosTotal > 0 || puntuaciones.respaldoTotal > 0) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMostrarResultados(!mostrarResultados);
                    }}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 text-sm font-medium"
                  >
                    {mostrarResultados ? 'Ocultar' : 'Ver'} Detalles
                  </button>
                )}
              </div>
              
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-4">
                Puntuación: {puntuaciones.puntuacionSilla || '-'}
              </div>
              
              {/* ✅ Contenedor con altura mínima fija */}
              <div style={{ minHeight: mostrarResultados ? 'auto' : '0px' }}>
                {mostrarResultados && (puntuaciones.alturaTotal > 0 || puntuaciones.profundidadTotal > 0 || 
                  puntuaciones.reposabrazosTotal > 0 || puntuaciones.respaldoTotal > 0) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="font-medium">Altura</p>
                      <p className="text-lg font-bold text-green-600">{puntuaciones.alturaTotal || '-'}</p>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="font-medium">Profundidad</p>
                      <p className="text-lg font-bold text-green-600">{puntuaciones.profundidadTotal || '-'}</p>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="font-medium">Reposabrazos</p>
                      <p className="text-lg font-bold text-green-600">{puntuaciones.reposabrazosTotal || '-'}</p>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="font-medium">Respaldo</p>
                      <p className="text-lg font-bold text-green-600">{puntuaciones.respaldoTotal || '-'}</p>
                    </div>
                  </div>
                )}
              </div>
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

            {/* ✅ SOLUCIÓN 9: Tiempo de uso con div en lugar de button */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300">Tiempo de Uso de la Silla</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { valor: -1, descripcion: "Menos de 1 hora total o menos de 30 min continuos", color: "green", icono: "🟢" },
                  { valor: 0, descripcion: "Entre 1 y 4 horas total o entre 30 min y 1 hora continua", color: "yellow", icono: "🟡" },
                  { valor: 1, descripcion: "Más de 4 horas o más de 1 hora continua", color: "red", icono: "🔴" }
                ].map((opcion) => (
                  <div
                    key={opcion.valor}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 text-left cursor-pointer ${
                      sillaData.tiempoUso === opcion.valor
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 shadow-md'
                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={(e) => handleTiempoUso(opcion.valor, e)}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{opcion.icono}</span>
                      <span className={`text-lg font-bold px-2 py-1 rounded ${
                        opcion.color === 'green' ? 'bg-green-100 text-green-800' :
                        opcion.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {opcion.valor > 0 ? '+1' : opcion.valor < 0 ? '-1' : '0'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{opcion.descripcion}</p>
                  </div>
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