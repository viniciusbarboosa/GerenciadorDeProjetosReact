import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function CasoModal({ caso, open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes do Caso</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{caso.nome}</Typography>
        <Typography variant="body2">Descrição: {caso.descricao}</Typography>
        <Typography variant="body2">Relator: {caso.nome_relator}</Typography>
        <Typography variant="body2">Status: {caso.status === 'concluido' ? 'Concluído' : 'Em Desenvolvimento'}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CasoModal;
