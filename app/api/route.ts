import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { TrafficController } from '@/app/controllers/TrafficController';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const controller = new TrafficController(pool);

export async function GET() {
  try {
    const [accidentes, horas, topMunicipio, topPersona, general] = await Promise.all([
      controller.getAccidentesPorVehiculo(),
      controller.getHorasPicoAccidentes(),
      controller.getMunicipioMasAccidentado(),
      controller.getPersonaMayorSiniestralidad(),
      controller.getConsultaGeneralDetallada(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        accidentesPorVehiculo: accidentes,
        horasPico: horas,
        municipioLider: topMunicipio,
        personaMayorRiesgo: topPersona,
        reporteGeneral: general
      }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}