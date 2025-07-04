'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const EvaluacionPantallaPerifericos = ({ onNext, onBack, formData }) => {
  const [evaluacionData, setEvaluacionData] = useState({
    pantalla: {
      puntuacion: null,
      incrementos: [],
      tiempoUso: null,
      opcionSeleccionada: null
    },
    telefono: {
      puntuacion: null,
      incrementos: [],
      tiempoUso: null,
      opcionSeleccionada: null
    },
    mouse: {
      puntuacion: null,
      incrementos: [],
      tiempoUso: null,
      opcionSeleccionada: null
    },
    teclado: {
      puntuacion: null,
      incrementos: [],
      tiempoUso: null,
      opcionSeleccionada: null
    }
  });

  const [puntuaciones, setPuntuaciones] = useState({
    puntuacionPantalla: 0,
    puntuacionTelefono: 0,
    puntuacionMouse: 0,
    puntuacionTeclado: 0,
    tablaB: 0,
    tablaC: 0,
    puntuacionPantallaPerifericos: 0
  });

  const [mostrarResultados, setMostrarResultados] = useState(false);
  
  // ✅ SOLUCIÓN 1: Ref para mantener la posición del scroll
  const scrollPositionRef = useRef(0);
  const containerRef = useRef(null);

  // ✅ SOLUCIÓN 2: Debounce para los cálculos
  const calcularPuntuaciones = useCallback(() => {
    // Calcular puntuaciones individuales (incluso si no están todos completos)
    const puntuacionPantalla = evaluacionData.pantalla.puntuacion !== null && evaluacionData.pantalla.tiempoUso !== null ?
      Math.max(0, evaluacionData.pantalla.puntuacion + 
        evaluacionData.pantalla.incrementos.length + evaluacionData.pantalla.tiempoUso) : 0;
    
    const puntuacionTelefono = evaluacionData.telefono.puntuacion !== null && evaluacionData.telefono.tiempoUso !== null ?
      Math.max(0, evaluacionData.telefono.puntuacion + 
        evaluacionData.telefono.incrementos.length + evaluacionData.telefono.tiempoUso) : 0;
    
    const puntuacionMouse = evaluacionData.mouse.puntuacion !== null && evaluacionData.mouse.tiempoUso !== null ?
      Math.max(0, evaluacionData.mouse.puntuacion + 
        evaluacionData.mouse.incrementos.length + evaluacionData.mouse.tiempoUso) : 0;
    
    const puntuacionTeclado = evaluacionData.teclado.puntuacion !== null && evaluacionData.teclado.tiempoUso !== null ?
      Math.max(0, evaluacionData.teclado.puntuacion + 
        evaluacionData.teclado.incrementos.length + evaluacionData.teclado.tiempoUso) : 0;

    // Solo calcular tablas si todos los campos están seleccionados
    let tablaB = 0;
    let tablaC = 0;
    let puntuacionFinal = 0;

    if (evaluacionData.pantalla.puntuacion !== null && evaluacionData.pantalla.tiempoUso !== null &&
        evaluacionData.telefono.puntuacion !== null && evaluacionData.telefono.tiempoUso !== null &&
        evaluacionData.mouse.puntuacion !== null && evaluacionData.mouse.tiempoUso !== null &&
        evaluacionData.teclado.puntuacion !== null && evaluacionData.teclado.tiempoUso !== null) {
      
      // Tabla B (Pantalla + Teléfono)
      tablaB = obtenerTablaB(puntuacionPantalla, puntuacionTelefono);
      
      // Tabla C (Mouse + Teclado)
      tablaC = obtenerTablaC(puntuacionMouse, puntuacionTeclado);
      
      // Tabla D (Resultado final de Pantalla y Periféricos)
      puntuacionFinal = obtenerTablaD(tablaB, tablaC);
    }

    setPuntuaciones({
      puntuacionPantalla,
      puntuacionTelefono,
      puntuacionMouse,
      puntuacionTeclado,
      tablaB,
      tablaC,
      puntuacionPantallaPerifericos: puntuacionFinal
    });
  }, [evaluacionData]);

  // ✅ SOLUCIÓN 3: useEffect con cleanup y delay
  useEffect(() => {
    const timeoutId = setTimeout(calcularPuntuaciones, 50);
    return () => clearTimeout(timeoutId);
  }, [calcularPuntuaciones]);

  const obtenerTablaB = (pantalla, telefono) => {
    const tabla = [
      [1, 1, 1, 2, 3, 4, 5, 6],
      [1, 1, 2, 2, 3, 4, 5, 6],
      [1, 2, 2, 3, 3, 4, 6, 7],
      [2, 2, 3, 3, 4, 5, 6, 8],
      [3, 3, 4, 4, 5, 6, 7, 8],
      [4, 4, 5, 5, 6, 7, 8, 9],
      [5, 5, 6, 7, 8, 8, 9, 9]
    ];

    const fila = Math.min(telefono, tabla.length - 1);
    const columna = Math.min(pantalla, tabla[0].length - 1);
    
    return tabla[fila][columna];
  };

  const obtenerTablaC = (mouse, teclado) => {
    const tabla = [
      [1, 1, 1, 2, 3, 4, 5, 6],
      [1, 1, 2, 3, 4, 5, 6, 7],
      [1, 2, 2, 3, 4, 5, 6, 7],
      [2, 3, 3, 3, 5, 6, 7, 8],
      [3, 4, 4, 5, 5, 6, 7, 8],
      [4, 5, 5, 6, 6, 7, 8, 9],
      [5, 6, 6, 7, 7, 8, 8, 9],
      [6, 7, 7, 8, 8, 9, 9, 9]
    ];

    const fila = Math.min(mouse, tabla.length - 1);
    const columna = Math.min(teclado, tabla[0].length - 1);
    
    return tabla[fila][columna];
  };

  const obtenerTablaD = (tablaB, tablaC) => {
    const tabla = [
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

    const fila = Math.min(Math.max(0, tablaB - 1), tabla.length - 1);
    const columna = Math.min(Math.max(0, tablaC - 1), tabla[0].length - 1);
    
    return tabla[fila][columna];
  };

  // ✅ SOLUCIÓN 4: Preservar scroll en los handlers
  const handleSeleccionOpcion = useCallback((elemento, puntuacion, incrementos = [], indiceOpcion, event) => {
    // Prevenir comportamiento por defecto
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Guardar posición actual del scroll
    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
    
    setEvaluacionData(prev => ({
      ...prev,
      [elemento]: {
        ...prev[elemento],
        puntuacion,
        incrementos,
        opcionSeleccionada: indiceOpcion
      }
    }));
    
    // Restaurar posición del scroll después del re-render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    });
  }, []);

  const handleTiempoUso = useCallback((elemento, tiempo, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
    
    setEvaluacionData(prev => ({
      ...prev,
      [elemento]: {
        ...prev[elemento],
        tiempoUso: tiempo
      }
    }));
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    });
  }, []);

  const handleContinuar = () => {
    // Validar que todos los campos estén seleccionados
    if (evaluacionData.pantalla.opcionSeleccionada === null || evaluacionData.pantalla.tiempoUso === null ||
        evaluacionData.telefono.opcionSeleccionada === null || evaluacionData.telefono.tiempoUso === null ||
        evaluacionData.mouse.opcionSeleccionada === null || evaluacionData.mouse.tiempoUso === null ||
        evaluacionData.teclado.opcionSeleccionada === null || evaluacionData.teclado.tiempoUso === null) {
      alert('Por favor, complete todas las evaluaciones antes de continuar.');
      return;
    }

    const datosCompletos = {
      ...formData,
      evaluacionPantallaPerifericos: {
        ...evaluacionData,
        puntuaciones
      }
    };

    if (onNext) {
      onNext(datosCompletos);
    }
  };

  // ✅ SOLUCIÓN 5: Componente optimizado sin re-renders innecesarios
  const OpcionEvaluacion = React.memo(({ titulo, elemento, opciones }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300">{titulo}</h3>
      
      {/* Opciones principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opciones.map((opcion, index) => {
          const isSelected = evaluacionData[elemento].opcionSeleccionada === index;
          
          return (
            <div
              key={`${elemento}-${index}`}
              className={`group relative cursor-pointer border-2 rounded-lg transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                  className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-lg flex items-center justify-center text-white"
                  style={{ display: opcion.imagen ? 'none' : 'flex' }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖥️</div>
                    <div className="text-sm font-medium">Sin imagen</div>
                  </div>
                </div>
                
                {/* Badge de puntuación */}
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {opcion.puntuacion + (opcion.incrementos?.length || 0)}
                </div>
                
                {/* Indicador de selección */}
                {isSelected && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white rounded-full p-1">
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

      {/* ✅ SOLUCIÓN 8: Tiempo de uso con div en lugar de button */}
      <div className="mt-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Tiempo de uso diario:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { valor: -1, descripcion: "Menos de 1 hora", color: "green", icono: "🟢" },
            { valor: 0, descripcion: "Entre 1 y 4 horas", color: "yellow", icono: "🟡" },
            { valor: 1, descripcion: "Más de 4 horas", color: "red", icono: "🔴" }
          ].map((opcion) => (
            <div
              key={opcion.valor}
              className={`p-3 border rounded-lg transition-all duration-200 cursor-pointer ${
                evaluacionData[elemento].tiempoUso === opcion.valor
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={(e) => handleTiempoUso(elemento, opcion.valor, e)}
            >
              <div className="flex items-center justify-center mb-1">
                <span className="text-lg mr-2">{opcion.icono}</span>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  opcion.color === 'green' ? 'bg-green-100 text-green-800' :
                  opcion.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {opcion.valor > 0 ? '+1' : opcion.valor < 0 ? '-1' : '0'}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{opcion.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ));

  const opcionesPantalla = [
    { 
      puntuacion: 1, 
      descripcion: "Pantalla a altura y distancia correctas", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura1.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Pantalla muy alta o muy baja", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura2.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Pantalla muy cerca o muy lejos", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura3.png"
    },
    { 
      puntuacion: 1, 
      descripcion: "Correcta + no ajustable", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura4.png"
    }
  ];

  const opcionesTelefono = [
    { 
      puntuacion: 1, 
      descripcion: "Uso normal del teléfono", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion del telefono/postura1.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Teléfono entre hombro y oreja", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion del telefono/postura2.png"
    },
    { 
      puntuacion: 1, 
      descripcion: "Con auriculares o manos libres", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion del telefono/postura3.png"
    }
  ];

  const opcionesMouse = [
    { 
      puntuacion: 1, 
      descripcion: "Mouse a altura y posición correctas", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura1.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Mouse muy alto o muy bajo", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura2.png"
    },
    { 
      puntuacion: 1, 
      descripcion: "Correcto + sin soporte de muñeca", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura3.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Inadecuado + sin soporte", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura4.png"
    }
  ];

  const opcionesTeclado = [
    { 
      puntuacion: 1, 
      descripcion: "Teclado a altura y ángulo correctos", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura1.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Teclado muy alto o ángulo inadecuado", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura2.png"
    },
    { 
      puntuacion: 1, 
      descripcion: "Correcto + sin soporte de muñeca", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura3.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Inadecuado + sin soporte", 
      incrementos: ["+1"],
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura4.png"
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-green-500 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Pantalla y Periféricos</h1>
            <p className="text-orange-100 mt-1">Evaluación ergonómica de monitor, teclado, mouse y teléfono</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Información del puesto */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Puesto: {formData?.identificadorPuesto}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trabajador: {formData?.nombreTrabajador}</p>
            </div>

            {/* ✅ SOLUCIÓN 9: Puntuación con altura fija y mejor estructura */}
            <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">Puntuación Actual de Pantalla y Periféricos</h3>
                {(puntuaciones.puntuacionPantalla > 0 || puntuaciones.puntuacionTelefono > 0 || 
                  puntuaciones.puntuacionMouse > 0 || puntuaciones.puntuacionTeclado > 0) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMostrarResultados(!mostrarResultados);
                    }}
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 text-sm font-medium"
                  >
                    {mostrarResultados ? 'Ocultar' : 'Ver'} Detalles
                  </button>
                )}
              </div>
              
              <div className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-4">
                Puntuación: {puntuaciones.puntuacionPantallaPerifericos || '-'}
              </div>
              
              {/* ✅ Contenedor con altura mínima fija */}
              <div style={{ minHeight: mostrarResultados ? 'auto' : '0px' }}>
                {mostrarResultados && (puntuaciones.puntuacionPantalla > 0 || puntuaciones.puntuacionTelefono > 0 || 
                  puntuaciones.puntuacionMouse > 0 || puntuaciones.puntuacionTeclado > 0) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="font-medium">Pantalla</p>
                      <p className="text-lg font-bold text-orange-600">{puntuaciones.puntuacionPantalla || '-'}</p>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="font-medium">Teléfono</p>
                      <p className="text-lg font-bold text-orange-600">{puntuaciones.puntuacionTelefono || '-'}</p>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="font-medium">Mouse</p>
                      <p className="text-lg font-bold text-orange-600">{puntuaciones.puntuacionMouse || '-'}</p>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="font-medium">Teclado</p>
                      <p className="text-lg font-bold text-orange-600">{puntuaciones.puntuacionTeclado || '-'}</p>
                    </div>
                    {puntuaciones.tablaB > 0 && (
                      <>
                        <div className="col-span-2 text-center p-2 bg-blue-50 dark:bg-blue-900 rounded">
                          <p className="font-medium">Tabla B (Pantalla+Teléfono)</p>
                          <p className="text-lg font-bold text-blue-600">{puntuaciones.tablaB}</p>
                        </div>
                        <div className="col-span-2 text-center p-2 bg-purple-50 dark:bg-purple-900 rounded">
                          <p className="font-medium">Tabla C (Mouse+Teclado)</p>
                          <p className="text-lg font-bold text-purple-600">{puntuaciones.tablaC}</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Evaluaciones */}
            <OpcionEvaluacion 
              titulo="Monitor/Pantalla"
              elemento="pantalla"
              opciones={opcionesPantalla}
            />

            <OpcionEvaluacion 
              titulo="Teléfono"
              elemento="telefono"
              opciones={opcionesTelefono}
            />

            <OpcionEvaluacion 
              titulo="Mouse"
              elemento="mouse"
              opciones={opcionesMouse}
            />

            <OpcionEvaluacion 
              titulo="Teclado"
              elemento="teclado"
              opciones={opcionesTeclado}
            />

            {/* Navegación */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                ← Volver a Resultado Tabla A
              </button>
              
              <button
                onClick={handleContinuar}
                className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-8 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-green-600 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg"
              >
                Ver Tablas B, C y D →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluacionPantallaPerifericos;