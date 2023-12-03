import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography, CircularProgress, Link, IconButton, Paper, Card } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import axios from "axios";

const Commits = (props) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        
        const [, owner, repo] = props.configProjeto.repositorio.match(/github\.com\/([^/]+)\/([^/]+)$/);
        
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`);
        setCommits(response.data);
      } catch (error) {
        setError("Repositório inválido ou não foi Startado no GitHub. Verifique com o dono/administrador do sistema.");
      } finally {
        setLoading(false);
      }
    };

    if (props.configProjeto.repositorio) {
      fetchCommits();
    } else {
      setError("URL do repositório não fornecida.");
      setLoading(false);
    }
  }, [props.configProjeto.repositorio]);

  const handleCommitClick = (commit) => {
    window.open(commit.html_url, "_blank");
  };

  return (
    <div>
      {loading && <CircularProgress />}
      {error && (
        <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <GitHubIcon style={{ fontSize: '28px' }} />
        <span style={{ fontSize: '30px', fontWeight: 'bold',marginLeft: '20px'}}>COMMITS</span>
      </div>

        <Card sx={{ backgroundColor: "#FFEBEE", padding: 2, marginBottom: 2 }}>
          <Typography variant="subtitle1" color="error">
            {error}
          </Typography>
        </Card>
        </div>
      )}
      {commits.length > 0 && (
        <List>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <GitHubIcon style={{ fontSize: '28px' }} />
        <span style={{ fontSize: '30px', fontWeight: 'bold',marginLeft: '20px'}}>COMMITS</span>
      </div>
          {commits.map((commit, index) => (
            <ListItem key={commit.sha} button onClick={() => handleCommitClick(commit)} sx={{ marginBottom: index < commits.length - 1 ? 2 : 0 }}>
              <Paper elevation={3} sx={{ padding: 2, width: "100%" }}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {commit.commit.author.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {commit.commit.message}
                    </Typography>
                  }
                />
                <Link href={commit.html_url} target="_blank" rel="noopener noreferrer">
                  <IconButton size="small">
                    <GitHubIcon />
                  </IconButton>
                </Link>
              </Paper>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Commits;
