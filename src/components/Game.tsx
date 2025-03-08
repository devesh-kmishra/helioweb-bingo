import { Alert, Box, Button, Fade, Grid2, Typography } from "@mui/material";
import Square from "./Square";
import { useEffect, useRef, useState } from "react";

const Grid = () => {
  const [state1, setState1] = useState(Array(9).fill(null));
  const [state2, setState2] = useState(Array(9).fill(null));
  const [checked1, setChecked1] = useState(Array(9).fill(false));
  const [checked2, setChecked2] = useState(Array(9).fill(false));
  const [fillNum1, setFillNum1] = useState(1);
  const [fillNum2, setFillNum2] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [warning, setWarning] = useState(false);
  const [msg, setMsg] = useState("");
  const [won, setWon] = useState(false);
  const [winnerNote, setWinnerNote] = useState("");
  const numsArr = useRef<number[]>([]);

  useEffect(() => {
    async function startGame() {
      try {
        await fetch(import.meta.env.VITE_URL, {
          method: "GET",
        });
      } catch (error) {
        console.log(error);
      }
    }
    startGame();
  }, []);

  const handleClick = (index: number, user: number) => {
    const copyState1 = [...state1];
    const copyState2 = [...state2];

    if (user === 1) {
      if (copyState1[index] !== null) return;
      copyState1[index] = fillNum1;
      setFillNum1(fillNum1 + 1);
    } else {
      if (copyState2[index] !== null) return;
      copyState2[index] = fillNum2;
      setFillNum2(fillNum2 + 1);
    }
    setState1(copyState1);
    setState2(copyState2);
  };

  const generateRandom = () => {
    const copyChecked1 = [...checked1];
    const copyChecked2 = [...checked2];
    let num: number = 0;

    if (numsArr.current.length >= 9) {
      return;
    } else {
      for (let i = 1; i < 10; ) {
        num = Math.floor(Math.random() * 10);
        if (!numsArr.current.includes(num) && num > 0 && num < 10) {
          numsArr.current.push(num);
          const pos1 = [...state1].indexOf(num);
          const pos2 = [...state2].indexOf(num);
          copyChecked1[pos1] = true;
          copyChecked2[pos2] = true;
          setChecked1(copyChecked1);
          setChecked2(copyChecked2);
          break;
        }
      }
    }
  };

  const startGame = async () => {
    if (state1.includes(null) || state2.includes(null)) {
      setWarning(true);
      setMsg("Please populate all the boxes first.");
      return;
    }

    try {
      setGameStarted(true);
      await fetch(`${import.meta.env.VITE_URL}api/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1: state1,
          user2: state2,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const newTurn = async () => {
    generateRandom();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}api/newturn/${
          numsArr.current[numsArr.current.length - 1]
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const winners: number[] = await response.json();

      if (winners.length > 0) setWon(true);
      if (winners.length === 2) setWinnerNote("It's a tie!");
      if (winners.includes(1) && !winners.includes(2))
        setWinnerNote("User 1 wins!");
      if (winners.includes(2) && !winners.includes(1))
        setWinnerNote("User 2 wins!");
    } catch (error) {
      console.log(error);
    }
  };

  const endGame = async () => {
    try {
      setState1(Array(9).fill(null));
      setState2(Array(9).fill(null));
      setChecked1(Array(9).fill(false));
      setChecked2(Array(9).fill(false));
      setFillNum1(1);
      setFillNum2(1);
      setGameStarted(false);
      setWon(false);
      numsArr.current = [];

      await fetch(`${import.meta.env.VITE_URL}api/finish`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Fade
        in={warning}
        timeout={{ enter: 0, exit: 3000 }}
        addEndListener={() => {
          setTimeout(() => {
            setWarning(false);
          }, 3000);
        }}
      >
        <Alert
          sx={{
            zIndex: 10,
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
          severity='success'
        >
          {msg}
        </Alert>
      </Fade>
      <Box sx={{ marginLeft: "10vw", marginTop: "5vh" }}>
        <Typography variant='h4'>User 1</Typography>
        <Grid2
          container
          sx={{
            width: "40vw",
            height: "30vh",
            border: "1px solid black",
            "& > *": { border: "1px solid black" },
          }}
        >
          <Square
            value={state1[0]}
            click={() => handleClick(0, 1)}
            checked={checked1[0]}
          />
          <Square
            value={state1[1]}
            click={() => handleClick(1, 1)}
            checked={checked1[1]}
          />
          <Square
            value={state1[2]}
            click={() => handleClick(2, 1)}
            checked={checked1[2]}
          />
          <Square
            value={state1[3]}
            click={() => handleClick(3, 1)}
            checked={checked1[3]}
          />
          <Square
            value={state1[4]}
            click={() => handleClick(4, 1)}
            checked={checked1[4]}
          />
          <Square
            value={state1[5]}
            click={() => handleClick(5, 1)}
            checked={checked1[5]}
          />
          <Square
            value={state1[6]}
            click={() => handleClick(6, 1)}
            checked={checked1[6]}
          />
          <Square
            value={state1[7]}
            click={() => handleClick(7, 1)}
            checked={checked1[7]}
          />
          <Square
            value={state1[8]}
            click={() => handleClick(8, 1)}
            checked={checked1[8]}
          />
        </Grid2>
      </Box>
      <Box sx={{ marginLeft: "10vw", marginTop: "5vh" }}>
        <Typography variant='h4'>User 2</Typography>
        <Grid2
          container
          sx={{
            width: "40vw",
            height: "30vh",
            border: "1px solid black",
            "& > *": { border: "1px solid black" },
          }}
        >
          <Square
            value={state2[0]}
            click={() => handleClick(0, 2)}
            checked={checked2[0]}
          />
          <Square
            value={state2[1]}
            click={() => handleClick(1, 2)}
            checked={checked2[1]}
          />
          <Square
            value={state2[2]}
            click={() => handleClick(2, 2)}
            checked={checked2[2]}
          />
          <Square
            value={state2[3]}
            click={() => handleClick(3, 2)}
            checked={checked2[3]}
          />
          <Square
            value={state2[4]}
            click={() => handleClick(4, 2)}
            checked={checked2[4]}
          />
          <Square
            value={state2[5]}
            click={() => handleClick(5, 2)}
            checked={checked2[5]}
          />
          <Square
            value={state2[6]}
            click={() => handleClick(6, 2)}
            checked={checked2[6]}
          />
          <Square
            value={state2[7]}
            click={() => handleClick(7, 2)}
            checked={checked2[7]}
          />
          <Square
            value={state2[8]}
            click={() => handleClick(8, 2)}
            checked={checked2[8]}
          />
        </Grid2>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "25vh",
          right: "10vw",
          width: "20vw",
          height: "25vh",
        }}
      >
        {!gameStarted && (
          <Button
            variant='contained'
            onClick={() => startGame()}
            sx={{
              display: "block",
              width: "100%",
              height: "10vh",
              fontSize: "1.5rem",
              bgcolor: "green",
            }}
          >
            Start Game
          </Button>
        )}
        {gameStarted && !won && (
          <Button
            variant='contained'
            onClick={() => newTurn()}
            sx={{
              display: "block",
              width: "100%",
              height: "10vh",
              fontSize: "1.5rem",
            }}
          >
            Next Turn
          </Button>
        )}
        {won && <Typography variant='h3'>{winnerNote}</Typography>}
        {gameStarted && (
          <Button
            variant='contained'
            onClick={() => endGame()}
            sx={{
              display: "block",
              width: "100%",
              height: "10vh",
              marginTop: "5vh",
              fontSize: "1.5rem",
            }}
          >
            Stop Game
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Grid;
