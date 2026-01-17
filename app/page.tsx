'use client';

import { useState, useEffect } from 'react';

export default function TrafficDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('general'); // Estado para alternar vistas en móvil

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
        <p className="text-gray-600">Resumen analítico de accidentes y pólizas</p>
      </header>

      {/* Grid de KPIs Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Municipio Crítico</h3>
          <p className="text-2xl font-bold text-gray-800">{data?.municipioLider?.nombre || 'N/A'}</p>
          <span className="text-sm text-red-600">{data?.municipioLider?.total_accidentes} accidentes totales</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Hora de Mayor Riesgo</h3>
          <p className="text-2xl font-bold text-gray-800">{data?.horasPico[0]?.hora}:00 hrs</p>
          <span className="text-sm text-blue-600">Pico máximo de incidencias</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Conductor con Más Multas/Acc</h3>
          <p className="text-2xl font-bold text-gray-800">{data?.personaMayorRiesgo?.nombre} {data?.personaMayorRiesgo?.apellido}</p>
          <span className="text-sm text-yellow-600">{data?.personaMayorRiesgo?.total_accidentes} registros</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabla Principal - Consulta General */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Detalle de Pólizas y Vehículos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4">Propietario</th>
                  <th className="px-6 py-4">Vehículo</th>
                  <th className="px-6 py-4">Cobertura</th>
                  <th className="px-6 py-4">Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.reporteGeneral.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{item.nombre} {item.apellido}</td>
                    <td className="px-6 py-4 text-gray-600">{item.marca} {item.modelo} ({item.placa})</td>
                    <td className="px-6 py-4 text-green-600 font-bold">${item.monto_cobertura}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(item.fecha_compra).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar de Estadísticas Secundarias */}
        <div className="space-y-8">
          {/* Accidentes por Vehículo */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Accidentes por Placa</h2>
            <div className="space-y-4">
              {data?.accidentesPorVehiculo.map((v: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="bg-gray-100 px-3 py-1 rounded text-sm font-mono font-bold">{v.placa}</span>
                  <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-400" 
                      style={{ width: `${(v.total_accidentes / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{v.total_accidentes}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Listado de Horas Pico */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribución Horaria</h2>
            <div className="grid grid-cols-2 gap-2">
              {data?.horasPico.slice(0, 4).map((h: any, idx: number) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg text-center">
                  <span className="block text-blue-800 font-bold">{h.hora}:00</span>
                  <span className="text-xs text-blue-600">{h.total} accidentes</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}