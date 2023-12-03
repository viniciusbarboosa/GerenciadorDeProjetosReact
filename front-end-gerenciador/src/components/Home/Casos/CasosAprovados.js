import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { CheckCircle } from "@mui/icons-material";
import VisualizarCasoAprovado from "./Modal/VisualizarCasoAprovado";

const CasosAprovados = (props) => {
  const [casosAprovados, setCasosAprovados] = useState([]);
  const [selectedCaso, setSelectedCaso] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:3333/casosAprovados");
        setCasosAprovados(response.data);
      } catch (error) {
        console.error("Erro ao buscar casos aprovados:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (caso) => {
    setSelectedCaso(caso);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCaso(null);
    setModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <CheckCircle style={{ fontSize: '30px', color: 'green' }} />
        <span style={{ fontSize: '40px', fontWeight: 'bold', marginLeft: '10px', color: 'black' }}>CASOS DO APROVADOS</span>
      </div>
      {casosAprovados.map((caso) => (
        <Card key={caso.id} sx={{ marginBottom: 2, cursor: 'pointer' }} onClick={() => handleOpenModal(caso)}>
          <CardContent>
            <Typography variant="h5">Titulo: {caso.nome}</Typography>
            <Typography variant="h6">Numero do Caso: {caso.id}</Typography>
            <Typography variant="h6" color="textSecondary">
              Relator: {caso.nome_relator}
            </Typography>
            {caso.commit && caso.commit !== "" && (
              <div style={{ marginTop: "1px", display: "flex", alignItems: "center" }}>
                <Typography variant="body1" color="black" marginRight={1}>
                  Commit do Caso:
                </Typography>
                <IconButton
                  onClick={() => window.open(caso.commit, "_blank")}
                  color="primary"
                >
                  <GitHubIcon />
                </IconButton>
              </div>
            )}
          </CardContent>
        </Card>
      ))}


{selectedCaso && (
        <VisualizarCasoAprovado
          open={modalOpen}
          handleClose={handleCloseModal}
          userData={props.userData}
          caso={selectedCaso}
        />
      )}

    </div>
  );
};

export default CasosAprovados;