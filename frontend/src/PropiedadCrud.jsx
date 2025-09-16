import React, {useState, useEffect} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PropiedadCrud = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [Propiedad, setPropiedad] = useState({
    ID_Propiedad: "",
    ID_Tipo: "",
    NumeroDeHabitaciones: "",
    AreaSuperficial:"",
    Direccion: "",
    Disponibilidad:""    
});
const [editing, setEditing] = useState(false);
const [ID_Propiedad, setPropiedadID] = useState(null);

const API_URL = "http://localhost:5000/api/propiedades";

useEffect(() => {
    fetchPropiedades();
},[]);

const fetchPropiedades = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log(response);
        setPropiedades(response.data.propiedadData);
        setPropiedadID(response.data.propiedadData.ID_Propiedad);
    }
    catch (error) {
        console.log(error);
    };
}

const editPropiedad = async(ID_Propiedad) => {
    try
    {
        const response = await axios.get(`${API_URL}/${ID_Propiedad}`);
        console.log(response);
        setPropiedades(response.data.propiedadData);
        setPropiedadID(response.data.propiedadData.ID_Propiedad);
        setEditing(true);
    }
    catch (error) {

    };
}

const deletePropiedad = async(id) => {
    if(window.confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
        try {
            await axios.delete(`${API_URL}/${id}`);
            toast.success("Propiedad eliminada exitosamente");
            fetchPropiedades();
        }
        catch (error) {
            toast.error(error);
        }

}
}

const handleInputChange = (e) => {
    const {name, value} = e.target;
    setPropiedad({...Propiedad, [name]: value});
}

const handleAddAndUpdate = async() => {
   try {
    if (editing) {
        await axios.put(`${API_URL}/${ID_Propiedad}`, Propiedad);
        toast.success("Propiedad actualizada exitosamente");
        setEditing(false);
    } else {
        await axios.post(API_URL, Propiedad);
        toast.success("Propiedad agregada exitosamente");
    }
    fetchPropiedades();
    setEditing(false);
    setPropiedad({
        ID_Propiedad: "",
        ID_Tipo: "",
        NumeroDeHabitaciones: "",
        AreaSuperficial:"",
        Direccion: "",
        Disponibilidad:""    
    });
   }
   catch (error) {
    toast.error(error);
   }
}   

    return (
        <div className="container mt-5">
            <button className="btn btn-primary mb-2"
            data-bs-toggle="modal"
            data-bs-target="#propiedadModal"
            onClick={() => setEditing(false)}>Agregar nueva propiedad</button>
            <ToastContainer />
            <h1>Propiedades CRUD</h1>
            <table className="Table table-bordered">
                <thead>
                    <tr>
                        <th>ID_Tipo</th>
                        <th>NumeroDeHabitaciones</th>
                        <th>AreaSuperficial</th>
                        <th>Direccion</th>
                        <th>Disponibilidad</th>
                    </tr>
                </thead>
                <tbody>
                    {propiedades.map((emp) => (
                        <tr key={emp.ID_Propiedad}>
                            <td>{emp.ID_Tipo}</td>
                            <td>{emp.NumeroDeHabitaciones}</td>
                            <td>{emp.AreaSuperficial}</td>
                            <td>{emp.Direccion}</td>
                            <td>{emp.Disponibilidad}</td>
                            <td>
                                <button className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#propiedadModal"
                                onClick={() => editPropiedad(emp.ID_Propiedad)}>Editar</button>
                                <button className="btn btn-danger" onClick={ () => deletePropiedad(emp.ID_Propiedad)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}    
                </tbody>
            </table>
            <div className="modal fade"
            id="propiedadModal" tabIndex="-1"
            aria-labelledby="propiedadModalLabel"
            aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="propiedadModalLabel">
                                Detalles de la propiedad
                                {editPropiedad ? "Editar propiedad" : "Agregar propiedad"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>    
                        </div>
                        <div className="modal-body">

                            <input type="text"
                            name= "Tipo de propiedad" placeholder="Ingrese el tipo de propiedad"
                            className="form-control mb-3"
                            value={Propiedad.ID_Tipo}
                            onChange={handleInputChange}/>

                            <input type="text"
                            name= "Numero de habitaciones" placeholder="Ingrese el numero de habitaciones"
                            className="form-control mb-3"
                            value={Propiedad.ID_NumeroDeHabitaciones}
                            onChange={handleInputChange}/>

                            <input type="text"
                            name= "Area Superficial" placeholder="Ingrese el area de metros cuadrados"
                            className="form-control mb-3"
                            value={Propiedad.AreaSuperficial}
                            onChange={handleInputChange}/>

                            <input type="text"
                            name= "Direccion" placeholder="Ingrese la direccion"
                            className="form-control mb-3"
                            value={Propiedad.Direccion}
                            onChange={handleInputChange}/>

                            <input type="text"
                            name= "Disponibilidad" placeholder="Ingrese la disponibilidad"
                            className="form-control mb-3"
                            value={Propiedad.Disponibilidad}
                            onChange={handleInputChange}/>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddAndUpdate}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PropiedadCrud;