// Caso.js

import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';

function MarcarCasoComoConcluido(props) {
  const [observacao, setObservacao] = useState('');

  const handleObservacaoChange = (event) => {
    setObservacao(event.target.value);
  };

  const marcarComoConcluido = () => {
    // Enviar a observação e outras informações ao seu servidor para marcar o caso como concluído
    const data = {
      caso: props.caso.nome,
      observacao: observacao,
    };

    // Faça uma requisição ao servidor aqui, por exemplo:
    // axios.post('http://seuservidor/api/marcarCasoComoConcluido', data)
    //   .then(response => {
    //     // Caso marcado como concluído com sucesso
    //     props.onConcluido();
    //   })
    //   .catch(error => {
    //     console.error('Erro ao marcar o caso como concluído:', error);
    //   });
  };

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Typography variant="h5">Marcar Caso como Concluído</Typography>
      <form>
        <TextField
          label="Observação"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={observacao}
          onChange={handleObservacaoChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={marcarComoConcluido}
        >
          Marcar como Concluído
        </Button>
      </form>
    </Paper>
  );
}

export default MarcarCasoComoConcluido;
