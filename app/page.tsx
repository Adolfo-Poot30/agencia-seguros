'use client';

import { useState, useEffect } from 'react';

export default function TrafficDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control de Tránsito</h1>
        <p className="text-gray-600">Gestión integral de parque vehicular y siniestralidad</p>
      </header>

      {/* 1. KPIs Rápidos (Mantenemos el ancho total arriba) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Municipio Crítico</h3>
          <p className="text-2xl font-bold text-gray-800">{data?.municipioLider?.nombre || 'N/A'}</p>
          <span className="text-sm text-red-600 font-medium">{data?.municipioLider?.total_accidentes} accidentes</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Hora Pico</h3>
          <p className="text-2xl font-bold text-gray-800">{data?.horasPico[0]?.hora}:00 hrs</p>
          <span className="text-sm text-blue-600 font-medium">Mayor concentración</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Máxima Siniestralidad</h3>
          <p className="text-2xl font-bold text-gray-800 truncate">{data?.personaMayorRiesgo?.nombre} {data?.personaMayorRiesgo?.apellido}</p>
          <span className="text-sm text-yellow-600 font-medium">{data?.personaMayorRiesgo?.total_accidentes} eventos</span>
        </div>
      </div>

      {/* 2. TABLA DE PÓLIZAS - OCUPA TODO EL ANCHO (W-FULL) */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-800">Detalle Global de Pólizas y Vehículos</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {data?.reporteGeneral.length} Registros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase letter tracking-wider">
              <tr>
                <th className="px-6 py-4">Propietario</th>
                <th className="px-6 py-4">Vehículo</th>
                <th className="px-6 py-4">Placa</th>
                <th className="px-6 py-4">Cobertura</th>
                <th className="px-6 py-4">Fecha Compra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {data?.reporteGeneral.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-700">{item.nombre} {item.apellido}</td>
                  <td className="px-6 py-4 text-gray-600">{item.marca} {item.modelo} ({item.anio})</td>
                  <td className="px-6 py-4"><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs font-bold">{item.placa}</span></td>
                  <td className="px-6 py-4 text-green-600 font-bold">${item.monto_cobertura.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(item.fecha_compra).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SECCIÓN INFERIOR - ELEMENTOS DE IZQUIERDA A DERECHA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Infracciones */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-purple-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Infracciones por Persona
          </h2>
          <div className="divide-y divide-gray-50">
            {data?.infracciones?.map((inf: any, idx: number) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">{inf.nombre} {inf.apellido}</span>
                <span className="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {inf.total_infracciones} multas
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Accidentes por Vehículo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-orange-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Accidentes por Placa
          </h2>
          <div className="space-y-4">
            {data?.accidentesPorVehiculo.map((v: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase text-gray-500">
                  <span>{v.placa}</span>
                  <span>{v.total_accidentes}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500" 
                    style={{ width: `${Math.min((v.total_accidentes / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución Horaria */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Horas de Incidencia
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {data?.horasPico.slice(0, 6).map((h: any, idx: number) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-blue-700 font-bold text-sm">{h.hora}:00</p>
                <p className="text-xs text-gray-500">{h.total} reportes</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}