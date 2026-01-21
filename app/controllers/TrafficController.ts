import { Pool } from 'pg';

// Definición de tipos para las respuestas
interface AccidentesVehiculo { placa: string; total_accidentes: number; }
interface HoraPico { hora: number; total: number; }
interface MunicipioTop { nombre: string; total_accidentes: number; }
interface PersonaAccidentes { nombre: string; apellido: string; total_accidentes: number; }
interface PersonaInfracciones {
  nombre: string;
  apellido: string;
  total_infracciones: number;
}
interface ConsultaGeneral {
  nombre: string;
  apellido: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  monto_cobertura: number;
  fecha_compra: Date;
}

export class TrafficController {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /** 1. Obtener el número de accidentes de cada vehículo */
  async getAccidentesPorVehiculo(): Promise<AccidentesVehiculo[]> {
    const query = `
      SELECT v.placa, COUNT(a.id) AS total_accidentes
      FROM vehiculos v
      LEFT JOIN accidentes a ON v.id = a.vehiculo_id
      GROUP BY v.id, v.placa;
    `;
    const res = await this.pool.query(query);
    return res.rows;
  }

  /** 2. Horas con más accidentes */
  async getHorasPicoAccidentes(): Promise<HoraPico[]> {
    const query = `
      SELECT EXTRACT(HOUR FROM fecha) AS hora, COUNT(*) AS total
      FROM accidentes
      GROUP BY hora
      ORDER BY total DESC;
    `;
    const res = await this.pool.query(query);
    return res.rows;
  }

  /** 3. Municipio con más accidentes */
  async getMunicipioMasAccidentado(): Promise<MunicipioTop | null> {
    const query = `
      SELECT m.nombre, COUNT(a.id) AS total_accidentes
      FROM municipios m
      JOIN accidentes a ON m.id = a.municipio_id
      GROUP BY m.id, m.nombre
      ORDER BY total_accidentes DESC
      LIMIT 1;
    `;
    const res = await this.pool.query(query);
    return res.rows[0] || null;
  }

  /** 4. Personas con mayor índice de accidentes */
  async getPersonaMayorSiniestralidad(): Promise<PersonaAccidentes | null> {
    const query = `
      SELECT p.nombre, p.apellido, COUNT(a.id) AS total_accidentes
      FROM personas p
      JOIN vehiculos v ON p.id = v.persona_id
      JOIN accidentes a ON v.id = a.vehiculo_id
      GROUP BY p.id, p.nombre, p.apellido
      ORDER BY total_accidentes DESC
      LIMIT 1;
    `;
    const res = await this.pool.query(query);
    return res.rows[0] || null;
  }

  /** 5. Consulta general: Persona, Vehículo y Póliza */
  async getConsultaGeneralDetallada(): Promise<ConsultaGeneral[]> {
    const query = `
      SELECT 
          p.nombre, p.apellido, v.placa, v.marca, 
          v.modelo, v.anio, po.monto_cobertura, po.fecha_compra
      FROM personas p
      JOIN vehiculos v ON p.id = v.persona_id
      JOIN polizas po ON v.id = po.vehiculo_id;
    `;
    const res = await this.pool.query(query);
    return res.rows;
  }

async getInfraccionesPorPersona(): Promise<PersonaInfracciones[]> {
  const query = `
    SELECT 
        p.nombre, 
        p.apellido, 
        COUNT(i.id) AS total_infracciones
    FROM personas p
    LEFT JOIN vehiculos v ON p.id = v.persona_id
    LEFT JOIN infracciones i ON v.id = i.vehiculo_id
    GROUP BY p.id, p.nombre, p.apellido
    ORDER BY total_infracciones DESC;
  `;
  const res = await this.pool.query(query);
  return res.rows;
}
}