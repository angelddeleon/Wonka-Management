import { createClient } from '@libsql/client'
const Token = process.env.DB_MAN_TOKEN
const urlMan = process.env.mode === 'production' ? process.env.DB_MAN_URL : 'file:./backend/local.db'

const client = createClient({
  authToken: Token,
  url: urlMan
})

// initialize model of the database for the maintenance and machine

// create the tables

if (process.env.mode !== 'production') {
  await client.execute(`
  DROP TABLE IF EXISTS MAINTENANCE  
`)
  await client.execute(`
 DROP TABLE IF EXISTS MACHINE
`)
}

await client.execute(`
  CREATE TABLE IF NOT EXISTS MACHINE (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    state TEXT,
    availability int,
    line INT
  )
`)

await client.execute(`
  CREATE TABLE IF NOT EXISTS MAINTENANCE (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machineId INTEGER NOT NULL UNIQUE, 
    type TEXT,
    dateMaintenance  TEXT,
    dateAvailability TEXT,
    FOREIGN KEY (machineId) REFERENCES MACHINE(id)
    )
  `)

// trigger to update the availability of the machine

// preguntar a henry si se puede hacer un trigger para que cuando se inserte un mantenimiento se actualice la disponibilidad de la maquina
await client.execute(`
  CREATE TRIGGER IF NOT EXISTS update_availability
  AFTER INSERT ON MAINTENANCE
  BEGIN
    UPDATE MACHINE
    SET availability = 0
    WHERE id = NEW.machineId;
  END
`)

// trigger to update the availability of the machine if the maintenance is deleted
await client.execute(`
  CREATE TRIGGER IF NOT EXISTS delete_availability
  AFTER DELETE ON MAINTENANCE
  BEGIN
    UPDATE MACHINE
    SET availability = 1,
    state = 'disponible'
    WHERE id = OLD.machineId;
  END
`)

// data for  development mode
if (process.env.mode !== 'production') {
  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['chocolatera', 'uso', 0, 1] })
  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['chocolatera', 'disponible', 1, 0] })
  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['chocolatera', 'defectuosa', 0, 1] })
  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['chocolatera', 'defectuosa', 0, 1] })

  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['caramelera', 'uso', 1, 1] })
  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['caramelera', 'notificada', 1, 1] })

  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['caramelizadora', 'uso', 1, 2] })
  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['caramelizadora', 'defectuosa', 0, 2] })

  await client.execute({ sql: 'INSERT INTO MACHINE (type, state, availability, line) VALUES (?, ?, ?, ?)', args: ['chiclera', 'notificada', 1, 0] })

  // add maintenance
  await client.execute({ sql: 'INSERT INTO MAINTENANCE (machineId, type, dateMaintenance, dateAvailability) VALUES (?, ?, ?, ?)', args: [1, 'preventivo', '2024-03-05', '2024-03-22'] })
  await client.execute({ sql: 'INSERT INTO MAINTENANCE (machineId, type, dateMaintenance, dateAvailability) VALUES (?, ?, ?, ?)', args: [2, 'preventivo', '2024-03-13', '2024-03-22'] })
  await client.execute({ sql: 'INSERT INTO MAINTENANCE (machineId, type, dateAvailability) VALUES (?, ?, ?)', args: [3, 'correctivo', '2024-03-22'] })
}
export default client
