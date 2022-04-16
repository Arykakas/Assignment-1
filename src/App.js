import React, { useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { Paper } from "@mui/material";

function App() {
  return (
    <div className="App">
      <InputForm />
    </div>
  );
}

const theme = createTheme();

const initialValue = {
  name: "",
  nationality: "",
  age: "",
  gender: "",
};

const ImgFlag = (country) => {
  if (country && country.country) {
    return (
      <img
        src={`https://flagcdn.com/16x12/${country.country.toLowerCase()}.png`}
        alt=""
      />
    );
  }
};

const InputForm = () => {
  function createData(name, age, gender, nationality) {
    return { name, age, gender, nationality };
  }
  const [result, setResult] = useState(initialValue);
  const [search, setSearch] = useState("");
  const [lastSearches, setLastSearches] = useState(
    JSON.parse(window.localStorage.getItem("LS")) || []
  );

  const fetchAge = async (name) => {
    const response = await fetch(`https://api.agify.io/?name=${name}`);
    const { age } = await response.json();
    if (age) return age;
    else return "N/A";
  };

  const fetchGender = async (name) => {
    const response = await fetch(`https://api.genderize.io?name=${name}`);
    const { gender } = await response.json();
    if (gender) return gender;
    else return "N/A";
  };

  const fetchNationality = async (name) => {
    const response = await fetch(`https://api.nationalize.io?name=${name}`);
    const { country } = await response.json();
    console.log(country);
    if (country.length > 0) return country[0].country_id;
    else return "N/A";
  };

  const textChange = async (event) => {
    event.preventDefault();
    const name = event.target.value;
    if (name.length > 1) {
      setTimeout(async () => {
        const age = await fetchAge(name);
        const gender = await fetchGender(name);
        const nationality = await fetchNationality(name);
        setResult({ age, gender, nationality });
      }, 200);
      let LS = JSON.parse(window.localStorage.getItem("LS"));
      if (!LS) {
        window.localStorage.setItem("LS", "[]");
        LS = [];
      }
      if (LS && LS.length === 5) {
        LS.shift();
      }
      LS.push({
        label: name,
        value: name,
      });
      window.localStorage.setItem("LS", JSON.stringify(LS));
      setLastSearches(LS);
    }
    setSearch(name);
  };
  const rows = [
    createData(search, result.age, result.gender, result.nationality),
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            React Js App | Material UI
          </Typography>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={12}>
              <Autocomplete
                id="name"
                options={lastSearches}
                name="name"
                value={search}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => textChange(e)}
                    label="Search"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name </TableCell>
                      <TableCell align="right">Age</TableCell>
                      <TableCell align="right">Gender</TableCell>
                      <TableCell align="right">Nationality</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.age}</TableCell>
                        <TableCell align="right">{row.gender}</TableCell>
                        <TableCell align="right">
                          <ImgFlag country={result.nationality} />{" "}
                          {row.nationality}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
