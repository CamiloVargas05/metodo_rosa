'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const EvaluacionSilla = ({ onNext, onBack, formData }) => {
  const [sillaData, setSillaData] = useState({
    alturaAsiento: {
      puntuacion: null,
      incrementos: [],
      opcionSeleccionada: null,
      opcionalesSeleccionadas: [] // Array para múltiples opcionales
    },
    profundidadAsiento: {
      puntuacion: null,
      incrementos: [],
      opcionSeleccionada: null,
      opcionalesSeleccionadas: []
    },
    reposabrazos: {
      puntuacion: null,
      incrementos: [],
      opcionSeleccionada: null,
      opcionalesSeleccionadas: []
    },
    respaldo: {
      puntuacion: null,
      incrementos: [],
      opcionSeleccionada: null,
      opcionalesSeleccionadas: []
    },
    tiempoUso: null
  });

  const [puntuaciones, setPuntuaciones] = useState({
    tablaA: 0,
    puntuacionSilla: 0
  });

  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [camposFaltantes, setCamposFaltantes] = useState([]);
  

  const scrollPositionRef = useRef(0);
  const containerRef = useRef(null);


  const calcularPuntuaciones = useCallback(() => {
    // Calcular puntuaciones de opcionales seleccionadas
    const incrementosAltura = sillaData.alturaAsiento.opcionalesSeleccionadas.reduce((sum, opt) => sum + opt.valor, 0);
    const incrementosProf = sillaData.profundidadAsiento.opcionalesSeleccionadas.reduce((sum, opt) => sum + opt.valor, 0);
    const incrementosRepos = sillaData.reposabrazos.opcionalesSeleccionadas.reduce((sum, opt) => sum + opt.valor, 0);
    const incrementosResp = sillaData.respaldo.opcionalesSeleccionadas.reduce((sum, opt) => sum + opt.valor, 0);

    const alturaTotal = sillaData.alturaAsiento.puntuacion !== null ? 
      sillaData.alturaAsiento.puntuacion + incrementosAltura : 0;
    const profundidadTotal = sillaData.profundidadAsiento.puntuacion !== null ? 
      sillaData.profundidadAsiento.puntuacion + incrementosProf : 0;
    const reposabrazosTotal = sillaData.reposabrazos.puntuacion !== null ? 
      sillaData.reposabrazos.puntuacion + incrementosRepos : 0;
    const respaldoTotal = sillaData.respaldo.puntuacion !== null ? 
      sillaData.respaldo.puntuacion + incrementosResp : 0;

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
        ...prev[elemento],
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

  // Nueva función para manejar opcionales con ID único
  const handleToggleOpcional = useCallback((elemento, idOpcional, valorIncremento, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
    
    setSillaData(prev => {
      const opcionalesActuales = prev[elemento].opcionalesSeleccionadas;
      const existe = opcionalesActuales.some(opt => opt.id === idOpcional);
      
      return {
        ...prev,
        [elemento]: {
          ...prev[elemento],
          opcionalesSeleccionadas: existe 
            ? opcionalesActuales.filter(opt => opt.id !== idOpcional)
            : [...opcionalesActuales, { id: idOpcional, valor: valorIncremento }]
        }
      };
    });
    
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
    const faltantes = [];
    
    if (sillaData.alturaAsiento.opcionSeleccionada === null) {
      faltantes.push('Altura del Asiento');
    }
    if (sillaData.profundidadAsiento.opcionSeleccionada === null) {
      faltantes.push('Profundidad del Asiento');
    }
    if (sillaData.reposabrazos.opcionSeleccionada === null) {
      faltantes.push('Reposabrazos');
    }
    if (sillaData.respaldo.opcionSeleccionada === null) {
      faltantes.push('Respaldo');
    }
    if (sillaData.tiempoUso === null) {
      faltantes.push('Tiempo de Uso de la Silla');
    }

    if (faltantes.length > 0) {
      setCamposFaltantes(faltantes);
      setMostrarAlerta(true);
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


  const OpcionEvaluacion = React.memo(({ titulo, elemento, opciones, opcionesOpcionales = [] }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">{titulo}</h3>
      
      {/* Opciones principales */}
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
              {/* Contenedor de imagen con altura fija */}
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
                  {opcion.puntuacion}
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
              
              {/* Contenido con padding fijo */}
              <div className="p-3" style={{ minHeight: '80px' }}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 leading-tight">
                  {opcion.descripcion}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Opciones opcionales (incrementos) */}
      {opcionesOpcionales.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-md font-semibold text-orange-700 dark:text-orange-300 mb-3">
            Opciones Adicionales (+1 punto cada una)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {opcionesOpcionales.map((opcion, index) => {
              const idUnico = `${elemento}-opt-${index}`;
              const isSelected = sillaData[elemento].opcionalesSeleccionadas.some(opt => opt.id === idUnico);
              
              return (
                <div
                  key={idUnico}
                  className={`group relative cursor-pointer border-2 rounded-lg transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={(e) => handleToggleOpcional(elemento, idUnico, opcion.valor, e)}
                >
                  {/* Contenedor de imagen con altura fija */}
                  <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                    {opcion.imagen ? (
                      <Image
                        src={opcion.imagen}
                        alt={opcion.descripcion}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
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
                        <div className="text-4xl mb-2">📋</div>
                        <div className="text-sm font-medium">Sin imagen</div>
                      </div>
                    </div>
                    
                    {/* Badge de incremento */}
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      +{opcion.valor}
                    </div>
                    
                    {/* Indicador de selección con checkbox */}
                    <div className={`absolute top-2 left-2 rounded p-1 ${
                      isSelected 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-400'
                    }`}>
                      {isSelected ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Contenido con padding fijo */}
                  <div className="p-3" style={{ minHeight: '80px' }}>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 leading-tight">
                      {opcion.descripcion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  ));

  const opcionesAlturaAsiento = [
    { 
      puntuacion: 1, 
      descripcion: "Rodillas dobladas en torno a los 90 grados.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación_altura_asiento/postura-neutra.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Asiento a una altura baja. Rodillas flexionadas en un ángulo menor a 90 grados.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación_altura_asiento/postura-desviacion.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Asiento a una altura elevada. Rodillas en un ángulo mayor a 90 grados.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación_altura_asiento/postura-desviacion2.png",
    },
    { 
      puntuacion: 3, 
      descripcion: "Sin contacto de los pies con el suelo.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuación_altura_asiento/porstura-si-tocar-asiento.png",
    }
  ];

  const opcionalesAlturaAsiento = [
    { 
      valor: 1,
      descripcion: "Espacio insuficiente para las piernas bajo la mesa.", 
      imagen: "/imgs/img-posturas/Puntuación_altura_asiento/espacio-insuficiente.png",
    },
    { 
      valor: 1,
      descripcion: "La altura del asiento no es regulable.", 
      imagen: "/imgs/img-posturas/Puntuación_altura_asiento/altura-no-regulable.png",
    }
  ];

  const opcionesProfundidadAsiento = [
    { 
      puntuacion: 1,
      descripcion: "Aproximadamente 8 cm de espacio entre el asiento y la parte trasera de las rodillas.",
      incrementos: [],
      imagen: "/imgs/img-posturas/puntuacion_profundidad_asiento/postura2.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Asiento muy largo. Menos de 8 cm de espacio entre el asiento y la parte trasera de las rodillas.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/puntuacion_profundidad_asiento/postura1.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Asiento muy corto. Más de 8 cm de espacio entre el asiento y la parte trasera de las rodillas.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/puntuacion_profundidad_asiento/postura4.png",
    }
  ];

  const opcionalesProfundidadAsiento = [
    { 
      valor: 1, 
      descripcion: "La profundidad del asiento no es regulable.", 
      imagen: "/imgs/img-posturas/puntuacion_profundidad_asiento/postura3.png",
    }
  ];

  const opcionesReposabrazos = [
    { 
      puntuacion: 1, 
      descripcion: "Codos bien apoyados en línea con los hombros. Los hombros están relajados.", 
      incrementos: [], 
      imagen: "/imgs/img-posturas/Puntuacion_reposabrazos/postura1.png",
    },
    { 
      puntuacion: 2, 
      descripcion: "Reposabrazos demasiado altos. Los hombros están encogidos.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion_reposabrazos/postura2.png", 
    },
    { 
      puntuacion: 2, 
      descripcion: "Reposabrazos demasiado bajos. Los codos no apoyan sobre ellos.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion_reposabrazos/postura6.png", 
    }
  ];

  const opcionalesReposabrazos = [
    { 
      valor: 1, 
      descripcion: "Reposabrazos demasiado separados.", 
      imagen: "/imgs/img-posturas/Puntuacion_reposabrazos/postura4.png", 
    },
    { 
      valor: 1, 
      descripcion: "La superficie del reposabrazos es dura o está dañada.", 
      imagen: "/imgs/img-posturas/Puntuacion_reposabrazos/postura3.png", 
    },
    { 
      valor: 1, 
      descripcion: "Reposabrazos no ajustables.", 
      imagen: "/imgs/img-posturas/Puntuacion_reposabrazos/postura5.png", 
    }
  ];

  const opcionesRespaldo = [
    { 
      puntuacion: 1, 
      descripcion: "Respaldo reclinado entre 95 y 110º y apoyo lumbar adecuado.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion_respaldo/postura1.png",
    },
    { 
      puntuacion: 2, 
      descripcion: "Sin apoyo lumbar o apoyo lumbar no situado en la parte baja de la espalda.", 
      incrementos: [], 
      imagen: "/imgs/img-posturas/Puntuacion_respaldo/postura2.png",
    },
    { 
      puntuacion: 2, 
      descripcion: "Respaldo reclinado menos de 95º o más de 110º.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion_respaldo/postura3.png",
    },
    { 
      puntuacion: 2, 
      descripcion: "Sin respaldo o respaldo no utilizado para apoyar la espalda.", 
      incrementos: [],
      imagen: "/imgs/img-posturas/Puntuacion_respaldo/postura4.png",
    }
  ];

  const opcionalesRespaldo = [
    { 
      valor: 1, 
      descripcion: "Superficie de trabajo demasiado alta. Los hombros están encogidos.", 
      imagen: "/imgs/img-posturas/Puntuacion_respaldo/postura5.png",
    },
    { 
      valor: 1, 
      descripcion: "Respaldo no ajustable.", 
      imagen: "/imgs/img-posturas/Puntuacion_respaldo/postura6.png",
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Modal de Alerta Personalizado */}
      {mostrarAlerta && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setMostrarAlerta(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white rounded-full p-2">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Evaluación Incompleta</h3>
                </div>
                <button
                  onClick={() => setMostrarAlerta(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="px-6 py-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                {camposFaltantes.length === 1 
                  ? '📝 Falta completar la siguiente evaluación:' 
                  : '📝 Faltan completar las siguientes evaluaciones:'}
              </p>
              
              {/* Lista de campos faltantes */}
              <div className="bg-orange-50 dark:bg-orange-900/30 border-2 border-orange-200 dark:border-orange-700 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {camposFaltantes.map((campo, index) => (
                    <li key={index} className="flex items-start space-x-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <span className="text-orange-500 dark:text-orange-400 font-bold text-xl mt-0.5">✓</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{campo}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-6 rounded">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Selecciona una opción en {camposFaltantes.length === 1 ? 'este campo' : 'estos campos'} para continuar con la evaluación.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarAlerta(false)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              opcionesOpcionales={opcionalesAlturaAsiento}
            />

            <OpcionEvaluacion 
              titulo="Profundidad del Asiento"
              elemento="profundidadAsiento"
              opciones={opcionesProfundidadAsiento}
              opcionesOpcionales={opcionalesProfundidadAsiento}
            />

            <OpcionEvaluacion 
              titulo="Reposabrazos"
              elemento="reposabrazos"
              opciones={opcionesReposabrazos}
              opcionesOpcionales={opcionalesReposabrazos}
            />

            <OpcionEvaluacion 
              titulo="Respaldo"
              elemento="respaldo"
              opciones={opcionesRespaldo}
              opcionesOpcionales={opcionalesRespaldo}
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