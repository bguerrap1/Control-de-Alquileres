const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {sql, poolPromise} = require('./db.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Obtener todas las propiedades
app.get('/api/propiedades', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Propiedad');
        console.table(result.recordset);
        res.status(200).json({
            success: true,
            propiedadData: result.recordset
        }
        );
    }
    catch (error) {
        console.log('error'. error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
});

//Obtener por id de la propiedad
app.get('/api/propiedades/:id', async (req, res) => {
    try {
        const {id} = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Identificador de propiedad invalido"
            });
        }

        const pool = await poolPromise;
        const result = 
        await pool
        .request()
        .input('ID_Propiedad', sql.Int, id)
        .query('SELECT * FROM Propiedad WHERE ID_Propiedad = @ID_Propiedad');
        console.table(result.recordset);

        if(result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Propiedad no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            propiedadData: result.recordset[0]
        });
    }
    catch (error) {
        console.log('error'. error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
});

//Agregar nueva propiedad
app.post('/api/propiedades', async (req, res) => {
    try{
        const {ID_Tipo, NumeroDeHabitaciones, AreaSuperficial, Direccion, Disponibilidad} = req.body;
        if (!ID_Tipo || !NumeroDeHabitaciones || !AreaSuperficial || !Direccion || !Disponibilidad) {
            return res.status(400).json({
                success: false,
                message: "Por favor ingrese todos los campos"
            });
        }
        const pool = await poolPromise;
        const result = 
        await pool
        .request()
        .input('ID_Tipo', sql.Int, ID_Tipo)
        .input('NumeroDeHabitaciones', sql.Int, NumeroDeHabitaciones)
        .input('AreaSuperficial', sql.VarChar, AreaSuperficial)
        .input('Direccion', sql.VarChar, Direccion)
        .input('Disponibilidad', sql.Bit, Disponibilidad)
        .query('INSERT INTO Propiedad (ID_Tipo, NumeroDeHabitaciones, AreaSuperficial, Direccion, Disponibilidad) VALUES (@ID_Tipo, @NumeroDeHabitaciones, @AreaSuperficial, @Direccion, @Disponibilidad)'  
        );
        res.status(200).json(result.rowsAffected);
    }

    catch (error) 
    {
        res.status(500).json(error.message);
    }

});

// //Actualizar propiedad existente
// app.put('/api/propiedades/:id', async (req, res) => {
//     try{
//         const {id} = req.params;
//         const {ID_Tipo, NumeroDeHabitaciones, AreaSuperficial, Direccion, Disponibilidad} = req.body;
//         const DisponibilidadBit = Disponibilidad ? 1 : 0; // Convertir a bit (1 o 0)
//         if (!ID_Tipo || !NumeroDeHabitaciones || !AreaSuperficial || !Direccion || !DisponibilidadBit) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Por favor ingrese todos los campos"
//             });
//         }
//         const pool = await poolPromise;
//         const result = 
//         await pool
//         .request()
//         .input('ID_Propiedad', sql.Int, id)
//         .input('ID_Tipo', sql.Int, ID_Tipo)
//         .input('NumeroDeHabitaciones', sql.Int, NumeroDeHabitaciones)
//         .input('AreaSuperficial', sql.VarChar, AreaSuperficial)
//         .input('Direccion', sql.VarChar, Direccion)
//         .input('Disponibilidad', sql.Bit, DisponibilidadBit)
//         .query("UPDATE Propiedad SET ID_Tipo=@ID_Tipo, NumeroDeHabitaciones=@NumeroDeHabitaciones, AreaSuperficial=@AreaSuperficial, Direccion=@Direccion, Disponibilidad=@DisponibilidadBit WHERE ID_Propiedad=@ID_Propiedad");
//         res.status(200).json(result.rowsAffected);
//     }

//     catch (error) 
//     {
//         res.status(500).json(error.message);
//     }

// });

app.put('/api/propiedades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ID_Tipo,
      NumeroDeHabitaciones,
      AreaSuperficial,
      Direccion,
      Disponibilidad
    } = req.body;

    if (
      ID_Tipo === undefined ||
      NumeroDeHabitaciones === undefined ||
      AreaSuperficial === undefined ||
      Direccion === undefined ||
      Disponibilidad === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Por favor ingrese todos los campos"
      });
    }

    const DisponibilidadBit = Disponibilidad ? 1 : 0;

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('ID_Propiedad', sql.Int, id)
      .input('ID_Tipo', sql.Int, ID_Tipo)
      .input('NumeroDeHabitaciones', sql.Int, NumeroDeHabitaciones)
      .input('AreaSuperficial', sql.VarChar, AreaSuperficial)
      .input('Direccion', sql.VarChar, Direccion)
      .input('Disponibilidad', sql.Bit, DisponibilidadBit)
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

    res.status(200).json({
      success: true,
      rowsAffected: result.rowsAffected
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

 //Eliminar por id de la propiedad
app.delete('/api/propiedades/:id', async (req, res) => {
    try {
        const {id} = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Identificador de propiedad invalido"
            });
        }

        const pool = await poolPromise;
        const result = 
        await pool
        .request()
        .input('ID_Propiedad', sql.Int, id)
        .query('DELETE FROM Propiedad WHERE ID_Propiedad = @ID_Propiedad');
        console.table(result.recordset);
        res.status(200).json(result.rowsAffected);

        res.status(200).json({
            success: true,
            propiedadData: result.recordset[0]
        });
    }
    catch (error) {
        console.log('error'. error);
        res.status(500).json(error.message);
    }
});   
