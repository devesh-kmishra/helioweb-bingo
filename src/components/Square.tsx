import { Button, Grid2 } from "@mui/material";
import { RxCross1 } from "react-icons/rx";

const Square = ({
  value,
  click,
  checked,
}: {
  value: number | null;
  click: () => void;
  checked: boolean;
}) => {
  return (
    <Grid2 size={4} sx={{ position: "relative" }}>
      <Button
        sx={{ width: "100%", height: "100%", color: "black" }}
        onClick={click}
      >
        {checked && (
          <RxCross1
            style={{
              width: "100%",
              height: "50%",
              position: "absolute",
              top: "25%",
              zIndex: 10,
            }}
          />
        )}
        {value}
      </Button>
    </Grid2>
  );
};

export default Square;
