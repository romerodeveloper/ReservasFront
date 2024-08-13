import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form, Alert } from 'react-bootstrap';

function App() {
  const [reservas, setReservas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentReserva, setCurrentReserva] = useState(null);
  const [newReserva, setNewReserva] = useState({});
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState({
    nombrePersona: '',
    fechaInicio: '',
    fechaFin: '',
    idServicio: ''
  });


  useEffect(() => {
    axios.get('http://localhost:8080/reservas')
      .then(response => {
        setReservas(response.data);
      })
      .catch(error => {
        console.error('Error fetching reservas:', error);
      });

    axios.get('http://localhost:8080/servicios')
      .then(response => {
        setServicios(response.data);
      })
      .catch(error => {
        console.error('Error fetching servicios:', error);
      });

    axios.get('http://localhost:8080/personas')
      .then(response => {
        setPersonas(response.data);
      })
      .catch(error => {
        console.error('Error fetching personas:', error);
      });
  }, []);

  const handleShowUpdateModal = (reserva) => {
    setCurrentReserva(reserva);
    setFecha(reserva.fecha.split('T')[0]);
    setHora(reserva.fecha.split('T')[1].slice(0, 5));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCurrentReserva(null);
    setNewReserva({});
    setShowModal(false);
    setShowAddModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'fecha') {
      setFecha(value);
    } else if (name === 'hora') {
      setHora(value);
    } else if (name.startsWith('new')) {
      setNewReserva(prevState => ({
        ...prevState,
        [name.replace('new', '')]: value
      }));
    } else {
      setCurrentReserva(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const cleanMessage = () => {
    setErrorMessage('');
    setSuccessMessage('');
  }

  const handleUpdateReserva = () => {
    const updatedReserva = {
      ...currentReserva,
      fecha: `${fecha}T${hora}:00`
    };

    axios.put('http://localhost:8080/reservas', updatedReserva)
      .then(response => {
        setReservas(prevReservas => prevReservas.map(reserva =>
          reserva.id === currentReserva.id ? response.data : reserva
        ));
        setSuccessMessage('Reserva actualizada correctamente.');
        setTimeout(() => {
          cleanMessage();
          handleCloseModal();
        }, 2000);
      })
      .catch(error => {
        const message = error.response?.data?.message || 'Error al actualizar la reserva.';
        setErrorMessage(message);
      });
  };

  const handleDeleteReserva = (id) => {
    axios.delete(`http://localhost:8080/reservas/${id}`)
      .then(() => {
        setReservas(prevReservas => prevReservas.filter(reserva => reserva.id !== id));
        setSuccessMessage('Reserva eliminada correctamente.');
        setTimeout(() => {
          cleanMessage();
          handleCloseModal();
        }, 2000);
      })
      .catch(error => {
        console.error('Error deleting reserva:', error);
        setTimeout(() => {
          cleanMessage();
        }, 2000);
      });
  };

  const handleAddReserva = () => {
    const nuevaReserva = {
      fecha: `${newReserva.fecha}T${newReserva.hora}:00`,
      estado: newReserva.estado,
      idPersona: parseInt(newReserva.idPersona, 10),
      idServicio: parseInt(newReserva.idServicio, 10)
    };

    axios.post('http://localhost:8080/reservas', nuevaReserva)
      .then(response => {
        setReservas([...reservas, response.data]);
        setSuccessMessage('Reserva añadida correctamente.');
        setTimeout(() => {
          cleanMessage();
          handleCloseModal();
        }, 2000);
      })
      .catch(error => {
        const message = error.response?.data?.message || 'Error al añadir la reserva.';
        setErrorMessage(message);
        setTimeout(() => {
          cleanMessage();
        }, 2000);
      });
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const filteredReservas = reservas.filter(reserva => {
    const matchesNombrePersona = reserva.nombrePersona.toLowerCase().includes(filters.nombrePersona.toLowerCase());
    const matchesFecha = (!filters.fechaInicio || reserva.fecha.split('T')[0] >= filters.fechaInicio) &&
                         (!filters.fechaFin || reserva.fecha.split('T')[0] <= filters.fechaFin);
    const matchesServicio = !filters.idServicio || reserva.idServicio === parseInt(filters.idServicio, 10);

    return matchesNombrePersona && matchesFecha && matchesServicio;
  });

  return (
    <div className="App container mt-5">
  <h1 className="text-center mb-4">Reservas</h1>
  <div className="text-center mb-4">
    <Button variant="primary" onClick={() => setShowModal(true)}>
      Ver Reservas
    </Button>{' '}
    <Button variant="success" onClick={() => setShowAddModal(true)}>
      Nueva Reserva
    </Button>
  </div>

  <Modal show={showModal && !showAddModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Lista de Reservas</Modal.Title>
        </Modal.Header>
        {errorMessage && (
          <Alert variant="danger" className="position-absolute w-100 text-center" style={{ top: '-60px' }}
            onClose={() => setErrorMessage('')}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="position-absolute w-100 text-center" style={{ top: '-60px' }}
            onClose={() => setSuccessMessage('')}
            dismissible
          >
            {successMessage}
          </Alert>
        )}
        <Modal.Body>
          <Form className="mb-4">
            <Form.Group controlId="filterNombrePersona">
              <Form.Label>Nombre Persona</Form.Label>
              <Form.Control
                type="text"
                name="nombrePersona"
                value={filters.nombrePersona}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="filterFechaInicio">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicio"
                value={filters.fechaInicio}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="filterFechaFin">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                name="fechaFin"
                value={filters.fechaFin}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="filterServicio">
              <Form.Label>Servicio</Form.Label>
              <Form.Control
                as="select"
                name="idServicio"
                value={filters.idServicio}
                onChange={handleFilterChange}
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre} - {servicio.descripcion} - ${servicio.precio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.map((reserva, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{reserva.nombrePersona}</td>
                  <td>{reserva.fecha}</td>
                  <td>{reserva.nombreServicio}</td>
                  <td>{reserva.estado}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleShowUpdateModal(reserva)}>
                      Editar
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteReserva(reserva.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

  {currentReserva && !showAddModal && (
    <Modal show={Boolean(currentReserva)} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {errorMessage && (
              <Alert variant="danger" className="position-absolute w-100 text-center" style={{ top: '-60px' }}
              onClose={() => setErrorMessage('')}
              dismissible
              >
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert variant="success" className="position-absolute w-100 text-center" style={{ top: '-60px' }}
              onClose={() => setSuccessMessage('')}
              dismissible
              >
                {successMessage}
              </Alert>
            )}
        <Form>
          <Form.Group controlId="formFecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={fecha}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formHora">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              name="hora"
              value={hora}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formServicio">
            <Form.Label>Servicio</Form.Label>
            <Form.Control
              as="select"
              name="idServicio"
              value={currentReserva.idServicio || ''}
              onChange={handleInputChange}
            >
              {servicios.map(servicio => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre} - {servicio.descripcion} - ${servicio.precio}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              name="estado"
              value={currentReserva.estado}
              onChange={handleInputChange}
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CONFIRMADA">CONFIRMADA</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleUpdateReserva}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  )}

  {showAddModal && (
    <Modal show={showAddModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nueva Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {errorMessage && (
              <Alert variant="danger" className="position-absolute w-100 text-center" style={{ top: '-60px' }}
              onClose={() => setErrorMessage('')}
              dismissible
              >
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert variant="success" className="position-absolute w-100 text-center" style={{ top: '-60px' }}
              onClose={() => setSuccessMessage('')}
              dismissible
              >
                {successMessage}
              </Alert>
            )}
        <Form>
          <Form.Group controlId="newFormPersona">
            <Form.Label>Persona</Form.Label>
            <Form.Control
              as="select"
              name="newidPersona"
              value={newReserva.idPersona || ''}
              onChange={handleInputChange}
            >
              <option value="">Seleccione una persona</option>
              {personas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="newFormFecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="newfecha"
              value={newReserva.fecha || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="newFormHora">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              name="newhora"
              value={newReserva.hora || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="newFormServicio">
            <Form.Label>Servicio</Form.Label>
            <Form.Control
              as="select"
              name="newidServicio"
              value={newReserva.idServicio || ''}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un servicio</option>
              {servicios.map(servicio => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre} - {servicio.descripcion} - ${servicio.precio}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="newFormEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              name="newestado"
              value={newReserva.estado || ''}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un estado</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CONFIRMADA">CONFIRMADA</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleAddReserva}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  )}
</div>

  );
}

export default App;
