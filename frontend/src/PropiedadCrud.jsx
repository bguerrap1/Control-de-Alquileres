import React, {useState, useEffect} from "react";
import axios from "axios";
import {toast, toastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
},[])

const fetchPropiedades = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log(response);
        setPropiedades(response.data.propiedadData);
        setPropiedadID(response.data.propiedadData.ID_Propiedad);
    }
    catch (error) {
        console.log(error);
    }
    return(
        <div className="container mt-5">
            <h1>Propiedades</h1>
        </div>
    )
}



const editPropiedad = async(ID_Propiedad) => {
    try
    {
        const response = await axios.get(`${API_URL}/${ID_Propiedad}`);
        console.log(response);
        setPropiedades(response.data.propiedadData);
    }
    catch (error) {

    }
}

const deletePropiedad = async(id) => {
}

    return (
        <div className="container mt-5">
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
                                <button class name="btn btn-warning me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#propiedadModal"
                                onClick={() => editPropiedad(emp.Propiedad)}
                                >
                                    EDIT 
                                </button>
                                <button class name="btn btn-danger" onClick={ () => deletePropiedad}>DELETE</button>
                            </td>
                        </tr>
                    ))}    
                </tbody>
            </table>
        </div>

    )
}

export default PropiedadCrud;