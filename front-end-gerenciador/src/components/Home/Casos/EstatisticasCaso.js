import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { BarChart as BarChartIcon, GetApp as DownloadIcon } from '@mui/icons-material';
import * as htmlToImage from 'html-to-image';

const EstatisticaCaso = () => {
  const [estatisticas, setEstatisticas] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const obterEstatisticas = async () => {
      try {
        const response = await axios.post('http://localhost:3333/estatisticasCasos');
        setEstatisticas(response.data);
      } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
      }
    };

    obterEstatisticas();
  }, []);

  const downloadImage = () => {
    if (chartRef.current) {
      const chartNode = chartRef.current.container;
      const width = chartNode.clientWidth;
      const height = chartNode.clientHeight;

      htmlToImage.toPng(chartNode, { width, height })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'estatisticas_casos.png';
          link.click();
        })
        .catch((error) => {
          console.error('Erro ao converter para imagem:', error);
        });
    }
  };

  if (!estatisticas) {
    return <p>Carregando estatísticas...</p>;
  }

  // Veja as estatísticas aqui
  const data = [
    { name: 'Aguardando', value: estatisticas.aguardando, color: '#FFA500' },
    { name: 'Em Desenvolvimento', value: estatisticas.emDesenvolvimento, color: '#87CEEB' },
    { name: 'Concluídos', value: estatisticas.concluidos, color: '#000080' },
    { name: 'Aprovados', value: estatisticas.casosAprovados, color: '#008000' },
  ];

  const darkTheme = {
    background: '#333333 ', // Cor de fundo
    axis: { stroke: '#555', tick: '#888' }, // Cores dos eixos
    grid: { stroke: '#555' }, // Cor das linhas de grade
    tooltip: { background: '#333', color: '#fff' }, // Cores da dica de ferramenta
  };

  return (
    <Box textAlign="center" color="#fff" mt={4}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <BarChartIcon style={{ fontSize: '30px', color: 'black' }} />
        <span style={{ fontSize: '40px', fontWeight: 'bold', marginLeft: '10px', color: 'black' }}>ESTATISTICAS DE CASOS DO PROJETO</span>
        <IconButton color="primary" onClick={downloadImage} style={{ marginLeft: '10px' }}>
          <DownloadIcon />
        </IconButton>
      </div>
      <BarChart ref={chartRef} width={1200} height={500} data={data} style={darkTheme}>
        <CartesianGrid strokeDasharray="3 3" stroke={darkTheme.grid.stroke} />
        <XAxis dataKey="name" stroke={darkTheme.axis.stroke} tick={{ fill: darkTheme.axis.tick }} />
        <YAxis stroke={darkTheme.axis.stroke} tick={{ fill: darkTheme.axis.tick }} />
        <Tooltip
          wrapperStyle={{ background: darkTheme.tooltip.background, color: darkTheme.tooltip.color }}
        />
        <Legend />
        <Bar dataKey="value" fill="#808080" label={{ fill: '#fff' }}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </Box>
  );
};

export default EstatisticaCaso;
