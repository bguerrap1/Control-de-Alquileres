const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sql, poolPromise } = require('./db.js');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// ⚡ Evitar cache para que GET siempre traiga datos actualizados
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// =======================
// Rutas CRUD Propiedades
// =======================

// Obtener todas las propiedades
app.get('/api/propiedades', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Propiedad');
    res.status(200).json({
      success: true,
      propiedadData: result.recordset
    });
  } catch (error) {
    console.error("GET /api/propiedades error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message
    });
  }
});

// Obtener propiedad por ID
app.get('/api/propiedades/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Identificador de propiedad inválido"
      });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Propiedad', sql.Int, id)
      .query('SELECT * FROM Propiedad WHERE ID_Propiedad = @ID_Propiedad');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Propiedad no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      propiedadData: result.recordset[0]
    });

  } catch (error) {
    console.error("GET /api/propiedades/:id error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message
    });
  }
});

// Agregar nueva propiedad
app.post('/api/propiedades', async (req, res) => {
  try {
    const { ID_Tipo, NumeroDeHabitaciones, AreaSuperficial, Direccion, Disponibilidad } = req.body;

    if (!ID_Tipo || !NumeroDeHabitaciones || !AreaSuperficial || !Direccion || Disponibilidad === undefined) {
      return res.status(400).json({
        success: false,
        message: "Por favor ingrese todos los campos"
      });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Tipo', sql.Int, ID_Tipo)
      .input('NumeroDeHabitaciones', sql.Int, NumeroDeHabitaciones)
      .input('AreaSuperficial', sql.VarChar, AreaSuperficial)
      .input('Direccion', sql.VarChar, Direccion)
      .input('Disponibilidad', sql.Bit, Disponibilidad)
      .query(`
        INSERT INTO Propiedad (ID_Tipo, NumeroDeHabitaciones, AreaSuperficial, Direccion, Disponibilidad)
        VALUES (@ID_Tipo, @NumeroDeHabitaciones, @AreaSuperficial, @Direccion, @Disponibilidad)
      `);

    res.status(200).json({ success: true, rowsAffected: result.rowsAffected });

  } catch (error) {
    console.error("POST /api/propiedades error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Actualizar propiedad existente
app.put('/api/propiedades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ID_Tipo, NumeroDeHabitaciones, AreaSuperficial, Direccion, Disponibilidad } = req.body;

    if (ID_Tipo === undefined || NumeroDeHabitaciones === undefined || AreaSuperficial === undefined || Direccion === undefined || Disponibilidad === undefined) {
      return res.status(400).json({
        success: false,
        message: "Por favor ingrese todos los campos"
      });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Propiedad', sql.Int, id)
      .input('ID_Tipo', sql.Int, ID_Tipo)
      .input('NumeroDeHabitaciones', sql.Int, NumeroDeHabitaciones)
      .input('AreaSuperficial', sql.VarChar, AreaSuperficial)
      .input('Direccion', sql.VarChar, Direccion)
      .input('Disponibilidad', sql.Bit, Disponibilidad)
      .query(`
        UPDATE Propiedad
        SET
          ID_Tipo = @ID_Tipo,
          NumeroDeHabitaciones = @NumeroDeHabitaciones,
          AreaSuperficial = @AreaSuperficial,
          Direccion = @Direccion,
          Disponibilidad = @Disponibilidad
        WHERE ID_Propiedad = @ID_Propiedad
      `);

    res.status(200).json({ success: true, rowsAffected: result.rowsAffected });

  } catch (error) {
    console.error("PUT /api/propiedades/:id error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Eliminar propiedad
app.delete('/api/propiedades/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Identificador de propiedad inválido"
      });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Propiedad', sql.Int, id)
      .query('DELETE FROM Propiedad WHERE ID_Propiedad = @ID_Propiedad');

    res.status(200).json({ success: true, rowsAffected: result.rowsAffected });

  } catch (error) {
    console.error("DELETE /api/propiedades/:id error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
