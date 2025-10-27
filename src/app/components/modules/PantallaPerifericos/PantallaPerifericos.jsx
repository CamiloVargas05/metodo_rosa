'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const EvaluacionPantallaPerifericos = ({ onNext, onBack, formData }) => {
  const [evaluacionData, setEvaluacionData] = useState({
    pantalla: {
      puntuacion: null,
      incrementos: [],
      tiempoUso: null,
      opcionSeleccionada: null,
      opcionalesSeleccionadas: [] // Array para múltiples opcionales
    },
    telefono: {
      puntuacion: null,
      incrementos: [],
      tiempoUso: null,
      opcionSeleccionada: null,
      opcionalesSeleccionadas: []
    },
    mouse: {
      puntuacion: null,
      incrementos: [],
      tiempoUso: null,
      opcionSeleccionada: null,
      opcionalesSeleccionadas: []
    },
    teclado: {
      puntuacion: null,
      incrementos: [],
      tiempoUso: null,
      opcionSeleccionada: null,
      opcionalesSeleccionadas: []
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
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [camposFaltantes, setCamposFaltantes] = useState([]);
  
  
  const scrollPositionRef = useRef(0);
  const containerRef = useRef(null);

  const calcularPuntuaciones = useCallback(() => {
    // Calcular incrementos de opcionales seleccionadas
    const incrementosPantalla = evaluacionData.pantalla.opcionalesSeleccionadas.reduce((sum, opt) => sum + opt.valor, 0);
    const incrementosTelefono = evaluacionData.telefono.opcionalesSeleccionadas.reduce((sum, opt) => sum + opt.valor, 0);
    const incrementosMouse = evaluacionData.mouse.opcionalesSeleccionadas.reduce((sum, opt) => sum + opt.valor, 0);
    const incrementosTeclado = evaluacionData.teclado.opcionalesSeleccionadas.reduce((sum, opt) => sum + opt.valor, 0);

    // Calcular puntuaciones individuales (incluso si no están todos completos)
    const puntuacionPantalla = evaluacionData.pantalla.puntuacion !== null && evaluacionData.pantalla.tiempoUso !== null ?
      Math.max(0, evaluacionData.pantalla.puntuacion + incrementosPantalla + evaluacionData.pantalla.tiempoUso) : 0;
    
    const puntuacionTelefono = evaluacionData.telefono.puntuacion !== null && evaluacionData.telefono.tiempoUso !== null ?
      Math.max(0, evaluacionData.telefono.puntuacion + incrementosTelefono + evaluacionData.telefono.tiempoUso) : 0;
    
    const puntuacionMouse = evaluacionData.mouse.puntuacion !== null && evaluacionData.mouse.tiempoUso !== null ?
      Math.max(0, evaluacionData.mouse.puntuacion + incrementosMouse + evaluacionData.mouse.tiempoUso) : 0;
    
    const puntuacionTeclado = evaluacionData.teclado.puntuacion !== null && evaluacionData.teclado.tiempoUso !== null ?
      Math.max(0, evaluacionData.teclado.puntuacion + incrementosTeclado + evaluacionData.teclado.tiempoUso) : 0;

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

 
  const handleSeleccionOpcion = useCallback((elemento, puntuacion, indiceOpcion, event) => {
    // Prevenir comportamiento por defecto
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    

    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
    
    setEvaluacionData(prev => ({
      ...prev,
      [elemento]: {
        ...prev[elemento],
        puntuacion,
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
    
    setEvaluacionData(prev => {
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
    const faltantes = [];
    
    // Validar opciones seleccionadas
    if (evaluacionData.pantalla.opcionSeleccionada === null) {
      faltantes.push('Pantalla - Selección de postura');
    }
    if (evaluacionData.pantalla.tiempoUso === null) {
      faltantes.push('Pantalla - Tiempo de uso');
    }
    if (evaluacionData.telefono.opcionSeleccionada === null) {
      faltantes.push('Teléfono - Selección de postura');
    }
    if (evaluacionData.telefono.tiempoUso === null) {
      faltantes.push('Teléfono - Tiempo de uso');
    }
    if (evaluacionData.mouse.opcionSeleccionada === null) {
      faltantes.push('Mouse - Selección de postura');
    }
    if (evaluacionData.mouse.tiempoUso === null) {
      faltantes.push('Mouse - Tiempo de uso');
    }
    if (evaluacionData.teclado.opcionSeleccionada === null) {
      faltantes.push('Teclado - Selección de postura');
    }
    if (evaluacionData.teclado.tiempoUso === null) {
      faltantes.push('Teclado - Tiempo de uso');
    }

    if (faltantes.length > 0) {
      setCamposFaltantes(faltantes);
      setMostrarAlerta(true);
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


  const OpcionEvaluacion = React.memo(({ titulo, elemento, opciones, opcionesOpcionales = [] }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">{titulo}</h3>
      
      {/* Opciones principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opciones.map((opcion, index) => {
          const isSelected = evaluacionData[elemento].opcionSeleccionada === index;
          
          return (
            <div
              key={`${elemento}-${index}`}
              className={`group relative cursor-pointer border-2 rounded-lg transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={(e) => handleSeleccionOpcion(elemento, opcion.puntuacion, index, e)}
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
                
                {/* Badge de puntuación (solo puntuación base, sin incrementos) */}
                <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full shadow-md ${
                  isSelected 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400'
                }`}>
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
              
              {/* ✅ SOLUCIÓN 7: Contenido con padding fijo */}
              <div className="p-3" style={{ minHeight: '80px' }}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 leading-tight">
                  {opcion.descripcion}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Opciones Adicionales */}
      {opcionesOpcionales.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-md font-semibold text-orange-700 dark:text-orange-300 mb-3">
            Opciones Adicionales (+1 punto cada una)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {opcionesOpcionales.map((opcion, index) => {
              const opcionalId = `${elemento}-opt-${index}`;
              const isSelected = evaluacionData[elemento].opcionalesSeleccionadas.some(opt => opt.id === opcionalId);
              
              return (
                <div
                  key={opcionalId}
                  className={`group relative cursor-pointer border-2 rounded-lg transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleOpcional(elemento, opcionalId, opcion.valor, e);
                  }}
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
                      className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-lg flex items-center justify-center text-white"
                      style={{ display: opcion.imagen ? 'none' : 'flex' }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">📋</div>
                        <div className="text-sm font-medium">Sin imagen</div>
                      </div>
                    </div>
                    
                    {/* Badge de puntuación */}
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      +{opcion.valor}
                    </div>
                    
                    {/* Indicador de selección - Checkbox estilo */}
                    <div className={`absolute top-2 left-2 rounded border-2 p-1 transition-all ${
                      isSelected 
                        ? 'bg-orange-500 border-orange-500' 
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500'
                    }`}>
                      {isSelected ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-4 h-4"></div>
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
      descripcion: "Pantalla a entre 45 y 75 cm. de distancia de los ojos y borde superior a la altura de los ojos", 
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura1.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Pantalla muy baja. 30° por debajo del nivel de los ojos", 
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura2.png"
    },
    { 
      puntuacion: 3, 
      descripcion: "Pantalla demasiado alta. Provoca extensión de cuello", 
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura3.png"
    }
  ];

  const opcionesTelefono = [
    { 
      puntuacion: 1, 
      descripcion: "Se usan cascos auriculares o se usa el teléfono con una mano y el cuello en posición neutral. El teléfono está cerca (30 cm. o menos)", 
      imagen: "/imgs/img-posturas/Puntuacion del telefono/postura1.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "El teléfono está lejos. A más de 30 cm", 
      imagen: "/imgs/img-posturas/Puntuacion del telefono/postura2.png"
    }
  ];

  const opcionesMouse = [
    { 
      puntuacion: 1, 
      descripcion: "El mouse está alineado con el hombro", 
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura1.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "El mouse no está alineado con el hombro o está lejos del cuerpo", 
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura2.png"
    }
  ];

  const opcionesTeclado = [
    { 
      puntuacion: 1, 
      descripcion: "Las muñecas están rectas y los hombros relajados", 
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura1.png"
    },
    { 
      puntuacion: 2, 
      descripcion: "Las muñecas están extendidas más de 15°", 
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura2.png"
    }
  ];

  // Opcionales para Pantalla
  const opcionalesPantalla = [
    { 
      valor: 1,
      descripcion: "Pantalla desviada lateralmente. Es necesario girar el cuello", 
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura1.png"
    },
    { 
      valor: 1,
      descripcion: "Es necesario manejar documentos y no existe un atril o soporte para ellos", 
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura2.png"
    },
    { 
      valor: 1,
      descripcion: "Brillos o reflejos en la pantalla", 
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura3.png"
    },
    { 
      valor: 1,
      descripcion: "Pantalla muy lejos. A más de 75 cm. de distancia o fuera del alcance del brazo", 
      imagen: "/imgs/img-posturas/Puntuacion de la pantalla/postura4.png"
    }
  ];

  // Opcionales para Teléfono
  const opcionesTelefono_Opcionales = [
    { 
      valor: 2,
      descripcion: "El teléfono se sujeta entre el cuello y el hombro", 
      imagen: "/imgs/img-posturas/Puntuacion del telefono/postura2.png"
    },
    { 
      valor: 1,
      descripcion: "El teléfono no tiene función manos libres", 
      imagen: "/imgs/img-posturas/Puntuacion del telefono/postura1.png"
    }
  ];

  // Opcionales para Mouse
  const opcionalesMouse = [
    { 
      valor: 1,
      descripcion: "Mouse muy pequeño. Requiere agarrarlo con la mano en pinza", 
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura1.png"
    },
    { 
      valor: 2,
      descripcion: "El mouse y teclado están a diferentes alturas", 
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura2.png"
    },
    { 
      valor: 1,
      descripcion: "Reposamanos duro o existen puntos de presión en la mano al usar el mouse", 
      imagen: "/imgs/img-posturas/Puntuacion del mouse/postura3.png"
    }
  ];

  // Opcionales para Teclado
  const opcionalesTeclado = [
    { 
      valor: 1,
      descripcion: "Las muñecas están desviadas lateralmente hacia dentro o hacia afuera", 
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura1.png"
    },
    { 
      valor: 1,
      descripcion: "El teclado está demasiado alto. Los hombros están encogidos", 
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura2.png"
    },
    { 
      valor: 1,
      descripcion: "Se deben alcanzar objetos alejados o por encima del nivel de la cabeza", 
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura3.png"
    },
    { 
      valor: 1,
      descripcion: "El teclado, o la plataforma sobre la que reposa, no son ajustables", 
      imagen: "/imgs/img-posturas/Puntuacion del teclado/postura4.png"
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
                  className="flex-1 bg-gradient-to-r from-orange-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
              opcionesOpcionales={opcionalesPantalla}
            />

            <OpcionEvaluacion 
              titulo="Teléfono"
              elemento="telefono"
              opciones={opcionesTelefono}
              opcionesOpcionales={opcionesTelefono_Opcionales}
            />

            <OpcionEvaluacion 
              titulo="Mouse"
              elemento="mouse"
              opciones={opcionesMouse}
              opcionesOpcionales={opcionalesMouse}
            />

            <OpcionEvaluacion 
              titulo="Teclado"
              elemento="teclado"
              opciones={opcionesTeclado}
              opcionesOpcionales={opcionalesTeclado}
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