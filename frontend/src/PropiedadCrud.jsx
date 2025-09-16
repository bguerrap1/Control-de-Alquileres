import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

const PropiedadCrud = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [Propiedad, setPropiedad] = useState({
    ID_Propiedad: "",
    ID_Tipo: "",
    NumeroDeHabitaciones: "",
    AreaSuperficial: "",
    Direccion: "",
    Disponibilidad: false,
  });
  const [editing, setEditing] = useState(false);
  const [ID_Propiedad, setPropiedadID] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = "http://localhost:5000/api/propiedades";

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const fetchPropiedades = async () => {
    try {
      const res = await axios.get(API_URL, { headers: { "Cache-Control": "no-cache" } });
      setPropiedades(res.data.propiedadData || []);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar propiedades");
    }
  };

  const handleNewClick = () => {
    setEditing(false);
    setPropiedad({
      ID_Propiedad: "",
      ID_Tipo: "",
      NumeroDeHabitaciones: "",
      AreaSuperficial: "",
      Direccion: "",
      Disponibilidad: false,
    });
    setShowModal(true);
  };

  const editPropiedad = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, { headers: { "Cache-Control": "no-cache" } });
      setPropiedad(res.data.propiedadData);
      setPropiedadID(res.data.propiedadData.ID_Propiedad);
      setEditing(true);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar la propiedad");
    }
  };

  const deletePropiedad = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta propiedad?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Propiedad eliminada");
      fetchPropiedades();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar propiedad");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropiedad((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddAndUpdate = async () => {
    try {
      if (!Propiedad.ID_Tipo || !Propiedad.NumeroDeHabitaciones || !Propiedad.AreaSuperficial || !Propiedad.Direccion) {
        toast.error("Completa todos los campos");
        return;
      }

      const payload = {
        ...Propiedad,
        ID_Tipo: parseInt(Propiedad.ID_Tipo, 10),
        NumeroDeHabitaciones: parseInt(Propiedad.NumeroDeHabitaciones, 10),
        Disponibilidad: !!Propiedad.Disponibilidad,
      };

      if (editing && ID_Propiedad) {
        await axios.put(`${API_URL}/${ID_Propiedad}`, payload);
        toast.success("Propiedad actualizada");
      } else {
        await axios.post(API_URL, payload);
        toast.success("Propiedad agregada");
      }

      await fetchPropiedades();
      setShowModal(false);
      setEditing(false);
      setPropiedad({
        ID_Propiedad: "",
        ID_Tipo: "",
        NumeroDeHabitaciones: "",
        AreaSuperficial: "",
        Direccion: "",
        Disponibilidad: false,
      });

    } catch (err) {
      console.error(err);
      toast.error("Error al guardar propiedad");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <Button className="mb-3" onClick={handleNewClick}>
        Agregar nueva propiedad
      </Button>

      <h1>Propiedades CRUD</h1>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID_Tipo</th>
            <th>Habitaciones</th>
            <th>Área</th>
            <th>Dirección</th>
            <th>Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {propiedades.map((emp) => (
            <tr key={emp.ID_Propiedad}>
              <td>{emp.ID_Tipo}</td>
              <td>{emp.NumeroDeHabitaciones}</td>
              <td>{emp.AreaSuperficial}</td>
              <td>{emp.Direccion}</td>
              <td>{emp.Disponibilidad ? "Sí" : "No"}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => editPropiedad(emp.ID_Propiedad)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => deletePropiedad(emp.ID_Propiedad)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal usando react-bootstrap */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Editar propiedad" : "Agregar propiedad"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Tipo</Form.Label>
              <Form.Control
                type="text"
                name="ID_Tipo"
                value={Propiedad.ID_Tipo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Habitaciones</Form.Label>
              <Form.Control
                type="text"
                name="NumeroDeHabitaciones"
                value={Propiedad.NumeroDeHabitaciones}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Área</Form.Label>
              <Form.Control
                type="text"
                name="AreaSuperficial"
                value={Propiedad.AreaSuperficial}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="Direccion"
                value={Propiedad.Direccion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Disponible"
                name="Disponibilidad"
                checked={Propiedad.Disponibilidad}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddAndUpdate}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PropiedadCrud;
